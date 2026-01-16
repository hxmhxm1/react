import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma-client'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ error: '请先登录' }, { status: 401 })
  const username = session.user!.name as string
  const user = await prisma.user.findFirst({ where: { username } })
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  const items = await prisma.conversation.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' }
  })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ error: '请先登录' }, { status: 401 })
  const username = session.user!.name as string
  const user = await prisma.user.findFirst({ where: { username } })
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  const body = await request.json().catch(() => ({}))
  const title = (typeof body?.title === 'string' && body.title.trim()) || '新对话'
  const conv = await prisma.conversation.create({ data: { title, ownerId: user.id } })
  return NextResponse.json(conv, { status: 201 })
}