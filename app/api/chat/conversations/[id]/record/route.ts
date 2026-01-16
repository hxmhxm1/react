import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma-client'

/**
 * 更新message记录，添加用户消息和AI回复
 * 更新conversation记录，添加用户对话，获取AI回复并保存
*/
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const session = await getServerSession(authOptions)
  if(!session || !session.user || !session.user.id){
    return NextResponse.json({ error: '请先登录' }, { status: 401})
  }
  const conv = await prisma.conversation.findFirst({ where: { id, ownerId: session.user.id } })
  if (!conv) return NextResponse.json({ error: '对话不存在' }, { status: 404 })

  const userContent = typeof body?.userContent === 'string' ? body.userContent.trim() : ''
  const assistantContent = typeof body?.assistantContent === 'string' ? body.assistantContent.trim() : ''
  if (!userContent || !assistantContent) return NextResponse.json({ error: '内容不能为空' }, { status: 400 })

  const existingCount = await prisma.message.count({ where: { conversationId: id } })
  const userMsg = await prisma.message.create({ data: { content: userContent, role: 'user', authorId: session.user.id, conversationId: id } })
  const assistantMsg = await prisma.message.create({ data: { content: assistantContent, role: 'assistant', conversationId: id } })
  const titleCandidate = userContent.slice(0, 20)
  await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date(), title: existingCount === 0 ? titleCandidate : conv.title } })

  return NextResponse.json({ user: userMsg, assistant: assistantMsg }, { status: 201 })
}