import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma-client'
import { chatCompletion } from '@/lib/aliyun'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ error: '请先登录' }, { status: 401 })
  const username = session.user!.name as string
  const user = await prisma.user.findFirst({ where: { username } })
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  const conv = await prisma.conversation.findFirst({ where: { id, ownerId: user.id } })
  if (!conv) return NextResponse.json({ error: '对话不存在' }, { status: 404 })
  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(messages)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ error: '请先登录' }, { status: 401 })
  const username = session.user!.name as string
  const user = await prisma.user.findFirst({ where: { username } })
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  const conv = await prisma.conversation.findFirst({ where: { id, ownerId: user.id } })
  if (!conv) return NextResponse.json({ error: '对话不存在' }, { status: 404 })

  const body = await request.json()
  const content = typeof body?.content === 'string' ? body.content.trim() : ''
  if (!content) return NextResponse.json({ error: '消息内容不能为空' }, { status: 400 })

  const existingCount = await prisma.message.count({ where: { conversationId: id } })
  const userMsg = await prisma.message.create({ data: { content, role: 'user', authorId: user.id, conversationId: id } })

  const history = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: 'asc' },
    take: 20
  })

  const prompt = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  const aiReply = await chatCompletion(prompt)

  const assistantMsg = await prisma.message.create({
    data: { content: aiReply, role: 'assistant', conversationId: id }
  })

  const titleCandidate = content.slice(0, 20)
  await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date(), title: existingCount === 0 ? titleCandidate : conv.title } })

  return NextResponse.json({ user: userMsg, assistant: assistantMsg }, { status: 201 })
}