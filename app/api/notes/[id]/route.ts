import { prisma } from '@/lib/prisma-client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'

// 删除博客
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 解析动态路由参数
    const { id } = await params

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

    // 查找要删除的笔记
    const note = await prisma.note.findUnique({
      where: { id: id }
    })

    if (!note) {
      return NextResponse.json(
        { error: '笔记不存在' },
        { status: 404 }
      )
    }

    // 检查笔记是否属于当前用户
    if (note.authorId !== user.id) {
      return NextResponse.json(
        { error: '无权删除他人的笔记' },
        { status: 403 }
      )
    }

    // 删除笔记
    await prisma.note.delete({
      where: { id: id }
    })

    return NextResponse.json(
      {
        success: true,
        message: '笔记删除成功'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('删除笔记失败:', error)
    return NextResponse.json(
      { error: '删除笔记失败，请稍后重试' },
      { status: 500 }
    )
  }
}
