import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma-client'
import { NextResponse } from 'next/server'

// 发布博客
export async function POST(request: Request) {
  try {
    // 获取当前用户会话
    const session = await getServerSession(authOptions)
    
    // 检查用户是否已认证
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const { title, content } = body

    // 验证必填字段
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: '标题不能为空' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: '内容不能为空' },
        { status: 400 }
      )
    }

    // 获取当前用户信息
    const username = session.user!.name as string
    const user = await prisma.user.findFirst({
      where: { username }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 创建新的笔记
    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          }
        }
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: '博客发布成功',
        data: note
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('发布博客失败:', error)
    return NextResponse.json(
      { error: '发布博客失败，请稍后重试' },
      { status: 500 }
    )
  }
}