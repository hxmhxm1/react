'use client'

import { TNote } from '@/types/notes'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

export default function BlogPage() {
  const [notes, setNotes] = useState<TNote[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes/my-notes')
      const data = res.ok ? await res.json() : []
      setNotes(data)
    } catch (error) {
      console.error('获取博客列表失败:', error)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault() // 阻止 Link 跳转
    
    if (!window.confirm('确定要删除这篇博客吗？此操作不可恢复。')) {
      return
    }

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        // 从列表中移除
        setNotes(prev => prev.filter(note => note.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || '删除失败')
      }
    } catch (error) {
      console.error('删除请求失败:', error)
      alert('网络错误，请稍后重试')
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <div className="text-2xl font-bold">博客管理</div>
          <p className="text-sm text-gray-500">共 {notes.length} 篇</p>
        </div>
        <Link 
          href="/admin/write" 
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
        >
          写新博客
        </Link>
      </div>
      
      {notes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">暂无博客文章</p>
          <Link href="/admin/write" className="text-blue-600 hover:underline">去写第一篇</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note: TNote) => (
            <Link key={note.id} href={`/blog/${note.id}`} className="group relative">
              <article className="h-full rounded-lg border border-black/10 bg-white shadow-sm p-5 transition hover:shadow-lg hover:border-black/20 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {note.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">
                  {note.content}
                </p>
                <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(note.updatedAt).toLocaleString('zh-CN', { hour12: false })}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, note.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors z-10"
                    title="删除博客"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}