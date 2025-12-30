import { prisma } from '@/lib/prisma-client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'

// 获取当前用户自己的博客
export async function GET() {
  try {
    // 获取当前用户的 session
    const session = await getServerSession(authOptions)

    // 检查用户是否已登录
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    // 根据用户名查找用户
    const user = await prisma.user.findFirst({
      where: { username: session.user.name }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 获取该用户的所有笔记
    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notes)

  } catch (error) {
    console.error('获取用户笔记失败:', error)
    return NextResponse.json(
      { error: '获取笔记失败，请稍后重试' },
      { status: 500 }
    )
  }
}
