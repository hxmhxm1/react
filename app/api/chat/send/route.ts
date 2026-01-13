import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma-client'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }
  const body = await request.json()
  const content = typeof body?.content === 'string' ? body.content.trim() : ''
  if (!content) {
    return NextResponse.json({ error: '消息内容不能为空' }, { status: 400 })
  }
  const username = session.user!.name as string
  const user = await prisma.user.findFirst({ where: { username } })
  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  }
  const saved = await prisma.message.create({
    data: { content, authorId: user.id },
    include: { author: { select: { id: true, username: true } } }
  })
  const msg = {
    id: saved.id,
    userId: saved.authorId,
    username: saved.author.username,
    content: saved.content,
    createdAt: saved.createdAt.getTime(),
  }
  return NextResponse.json(msg, { status: 201 })
}