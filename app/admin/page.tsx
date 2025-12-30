'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    username: string
  }
}

export default function AdminPage() {
  const router = useRouter()
  const { status } = useSession()

  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  // 重定向未登录用户
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // 获取用户自己的博客
  useEffect(() => {
    if (status === 'authenticated') {
      fetchMyNotes()
    }
  }, [status])

  const fetchMyNotes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notes/my-notes')
      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || '获取博客失败' })
        return
      }

      setNotes(data.data || [])
    } catch (error) {
      console.error('获取博客失败:', error)
      setMessage({ type: 'error', text: '获取博客失败，请稍后重试' })
    } finally {
      setLoading(false)
    }
  }

  // 删除博客
  const handleDelete = async (noteId: string) => {
    if (!confirm('确定要删除这篇博客吗？')) return

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || '删除失败' })
        return
      }

      setMessage({ type: 'success', text: '删除成功' })
      setNotes(notes.filter(n => n.id !== noteId))
    } catch (error) {
      console.error('删除失败:', error)
      setMessage({ type: 'error', text: '删除失败，请稍后重试' })
    }
  }

  if (status === 'loading' || loading) {
    return <div className="pt-20 text-center">加载中...</div>
  }

  return (
    <div className="pt-20 min-h-screen container mx-auto px-4 py-8">
      {/* 提示消息 */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* 标题和操作按钮 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">我的博客</h1>
        <Link
          href="/admin/write"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + 新建博客
        </Link>
      </div>

      {/* 博客列表 */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">还没有博客，点击上方按钮创建第一篇吧！</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {note.content.substring(0, 150)}...
                  </p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>创建：{new Date(note.createdAt).toLocaleDateString()}</span>
                    <span>更新：{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/blog/${note.id}`}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                  >
                    查看
                  </Link>
                  <Link
                    href={`/admin/write?id=${note.id}`}
                    className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors text-sm"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}