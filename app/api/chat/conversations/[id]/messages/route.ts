import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma-client'
import { chatCompletion } from '@/lib/aliyun'

// 获取某一次对话记录详情
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if(!session || !session.user || !session.user.id){
    return NextResponse.json({error: '请先登录'}, {status: 401})
  }
  const conv = await prisma.conversation.findFirst({ where: { id, ownerId: session.user.id } })
  if (!conv) return NextResponse.json({ error: '对话不存在' }, { status: 404 })
  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(messages)
}

/**
 * 暂时没有用到（非streaming方式）
 * 将用户发送的消息 传给大模型 获取回复
 * 更新message记录，添加用户消息和AI回复
 * 更新conversation记录，添加用户对话，获取AI回复并保存
*/
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const session = await getServerSession(authOptions)
 
  if(!session || !session.user || !session.user.id){
    return NextResponse.json({error: '请先登录'}, {status: 401})
  }

  const conv = await prisma.conversation.findFirst({ where: { id, ownerId: session.user.id } })
  if (!conv) return NextResponse.json({ error: '对话不存在' }, { status: 404 })

  const content = typeof body?.content === 'string' ? body.content.trim() : ''
  if (!content) return NextResponse.json({ error: '消息内容不能为空' }, { status: 400 })

  const existingCount = await prisma.message.count({ where: { conversationId: id } })
  const userMsg = await prisma.message.create({ data: { content, role: 'user', authorId: session.user.id, conversationId: id } })

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