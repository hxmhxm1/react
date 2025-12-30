import { prisma } from '@/lib/prisma-client'
import { NextResponse } from 'next/server'

// 获取所有博客
// 通过id获取某个
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get('id') // 获取查询参数 ?id=xxx
    if(noteId){
      const content = await prisma.note.findFirst({where: { id: noteId}})
      return NextResponse.json(content)
    }

    const notes = await prisma.note.findMany()
    return NextResponse.json(notes)

  } catch (error) {
    console.error('获取笔记失败:', error)
    return NextResponse.json({ error: '获取笔记失败' }, { status: 500 })
  }
}
