import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma-client'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id }
    })

    if (!conversation) {
      return NextResponse.json({ error: '对话不存在' }, { status: 404 })
    }

    if (conversation.ownerId !== session.user.id) {
      return NextResponse.json({ error: '无权删除该对话' }, { status: 403 })
    }

    // 手动处理级联删除：先删除关联的消息，再删除对话
    // 使用事务确保操作的原子性
    await prisma.$transaction([
      prisma.message.deleteMany({
        where: { conversationId: id }
      }),
      prisma.conversation.delete({
        where: { id }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除对话失败:', error)
    // 返回更具体的错误信息以便调试（在生产环境中可能需要隐藏）
    return NextResponse.json(
      { error: '删除对话失败', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    )
  }
}
