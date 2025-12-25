import { prisma } from '@/lib/prisma-client'
import { NextResponse } from 'next/server'
import type { Note } from '@prisma/client'

export async function GET() {
  try {
    const notes = await prisma.note.findMany()
    
    // 构造返回数据
    const res = notes.map((note: Note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      updateTime: note.updatedAt
    }))
    
    return NextResponse.json(res)
  } catch (error) {
    console.error('获取笔记失败:', error)
    return NextResponse.json(
      { error: '获取笔记失败' },
      { status: 500 }
    )
  }
}
