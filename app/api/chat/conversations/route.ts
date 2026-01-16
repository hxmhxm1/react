import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma-client'

// 获取历史对话记录列表
export async function GET() {
  const session = await getServerSession(authOptions)
  if(!session || !session.user || !session.user.id){
    return NextResponse.json({error: '请先登录'}, { status: 401})
  }
  const items = await prisma.conversation.findMany({
    where: {ownerId: session.user.id},
    orderBy: { updatedAt : 'desc'}
  })
  return NextResponse.json(items)
}

// 更新历史对话记录列表
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if(!session || !session.user || !session.user.id){
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const title = (typeof body?.title === 'string' && body.title.trim()) || '新对话'
  const conv = await prisma.conversation.create({ data: { title, ownerId: session.user.id } })
  return NextResponse.json(conv, { status: 201 })
}