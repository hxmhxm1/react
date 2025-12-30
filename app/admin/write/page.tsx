'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { marked } from 'marked'

export default function WritePage() {
  const router = useRouter()
  const { status } = useSession()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [savedAt, setSavedAt] = useState<string | null>(null)

  // 重定向未登录用户
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // 处理内容变更并更新预览
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    // 使用 marked 库转换 markdown
    const html = marked(newContent) as string
    setPreview(html)
  }

  // 处理发布
  const handlePublish = async () => {
    // 验证
    if (!title.trim()) {
      setMessage({ type: 'error', text: '请输入文章标题' })
      return
    }
    if (!content.trim()) {
      setMessage({ type: 'error', text: '请输入文章内容' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/write-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ 
          type: 'error', 
          text: data.error || '发布失败，请重试' 
        })
        return
      }

      setMessage({ type: 'success', text: '发布成功！' })
      // 清空表单并跳转
      setTitle('')
      setContent('')
      setPreview('')
      localStorage.removeItem('blog_draft')
      
      setTimeout(() => {
        router.push('/blog')
      }, 1500)
    } catch (error) {
      console.error('发布失败:', error)
      setMessage({ 
        type: 'error', 
        text: '网络错误，请检查连接' 
      })
    } finally {
      setLoading(false)
    }
  }

  // 自动保存草稿到本地存储
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        localStorage.setItem('blog_draft', JSON.stringify({ title, content }))
        setSavedAt(new Date().toLocaleTimeString())
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [title, content])

  // 恢复草稿
  useEffect(() => {
    const draft = localStorage.getItem('blog_draft')
    if (draft) {
      try {
        const { title: draftTitle, content: draftContent } = JSON.parse(draft)
        setTitle(draftTitle)
        setContent(draftContent)
        // 初始化预览
        const html = marked(draftContent) as string
        setPreview(html)
      } catch (error) {
        console.error('恢复草稿失败:', error)
      }
    }
  }, [])

  if (status === 'loading') {
    return <div className="pt-20 text-center">加载中...</div>
  }

  return (
    <div className="pt-20 h-screen flex flex-col container mx-auto px-4 bg-white">
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

      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <input 
          type="text" 
          placeholder="请输入文章标题..." 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold border-none outline-none flex-1 placeholder-gray-300 bg-transparent"
        />
        <button 
          onClick={handlePublish}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? '发布中...' : '发布文章'}
        </button>
      </div>

      {/* 状态栏 */}
      <div className="text-xs text-gray-500 mb-2">
        {savedAt && `上次保存: ${savedAt}`}
      </div>

      {/* 编辑区域 - 左右分栏 */}
      <div className="flex-1 flex gap-4 border-t border-gray-200 pt-4 pb-4 overflow-hidden">
        {/* 左侧：输入框 */}
        <div className="w-1/2 flex flex-col">
          <div className="text-xs text-gray-500 mb-2 font-semibold">Markdown 编辑</div>
          <textarea 
            value={content}
            onChange={handleContentChange}
            className="flex-1 p-4 border border-gray-200 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
            placeholder="在此输入 Markdown 内容...&#10;&#10;# 标题&#10;## 小标题&#10;&#10;**加粗文本** 和 *斜体*&#10;&#10;`行内代码` 和 ```代码块```&#10;&#10;[链接](https://example.com)&#10;&#10;* 列表项 1&#10;* 列表项 2"
          />
        </div>

        {/* 右侧：预览区 */}
        <div className="w-1/2 flex flex-col">
          <div className="text-xs text-gray-500 mb-2 font-semibold">预览</div>
          <div 
            className="flex-1 p-4 bg-white border border-gray-200 rounded-lg overflow-y-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: preview || '<p class="text-gray-400">预览区域</p>' }}
          />
        </div>
      </div>
    </div>
  )
}
