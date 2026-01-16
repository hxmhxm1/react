import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sinceStr = searchParams.get('since')
  const since = sinceStr ? Number(sinceStr) : undefined

  const where = since ? { createdAt: { gt: new Date(since) } } : {}

  const messages = await prisma.message.findMany({
    where,
    include: { author: { select: { id: true, username: true } } },
    orderBy: { createdAt: 'asc' }
  })

  const data = messages.map(m => ({
    id: m.id,
    userId: m.authorId,
    username: m.author?.username ?? '未知',
    content: m.content,
    createdAt: m.createdAt.getTime(),
  }))

  return NextResponse.json(data)
}