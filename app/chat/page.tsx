"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const ChatPage = () => {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<{ id: string; title: string }[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string; createdAt: string }[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  const loadConversations = async () => {
    const res = await fetch('/api/chat/conversations', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setConversations(data)
      if (!currentId && data.length > 0) setCurrentId(data[0].id)
    }
  }

  const loadMessages = async (id: string) => {
    const res = await fetch(`/api/chat/conversations/${id}/messages`, { cache: 'no-store' })
    if (res.ok) setMessages(await res.json())
  }

  useEffect(() => { loadConversations() }, [])
  useEffect(() => { if (currentId) loadMessages(currentId) }, [currentId])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const startConversation = async () => {
    const res = await fetch('/api/chat/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: '新对话' }) })
    if (res.ok) {
      const conv = await res.json()
      await loadConversations()
      setCurrentId(conv.id)
      setMessages([])
    }
  }

  const deleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('确定要删除该对话吗？')) return

    try {
      const res = await fetch(`/api/chat/conversations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        if (currentId === id) {
          setCurrentId(null)
          setMessages([])
        }
        await loadConversations()
      }
    } catch (error) {
      console.error('删除对话失败', error)
    }
  }

  const send = async () => {
    if (!input.trim() || sending || !currentId) return
    setSending(true)
    setInput("")
    const uid = (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : `u_${Date.now()}`
    const aid = (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : `a_${Date.now()}`
    const userMsg = { id: uid, role: 'user' as const, content: input.trim(), createdAt: new Date().toISOString() }
    const assistantMsg = { id: aid, role: 'assistant' as const, content: '', createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg, assistantMsg])
    try {
      const res = await fetch('/api/chat/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: input.trim() }) })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (reader) {
        let assistantContent = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(l => l.trim())
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const jsonStr = line.slice(5).trim()
            if (jsonStr === '[DONE]') continue
            try {
              const data = JSON.parse(jsonStr)
              if (data?.content) {
                assistantContent += String(data.content).replace(/\\n/g, '\n').replace(/\\r/g, '\r')
                const contentNow = assistantContent
                setMessages(prev => prev.map(m => m.id === aid ? { ...m, content: contentNow } : m))
              }
            } catch {}
          }
        }
        await fetch(`/api/chat/conversations/${currentId}/record`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userContent: userMsg.content, assistantContent }) })
        await loadConversations()
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-full flex">
      <aside className="w-72 border-r border-input bg-card p-3 flex flex-col gap-3">
        <Button onClick={startConversation} className="w-full">开启新对话</Button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.map(c => (
            <div 
              key={c.id} 
              onClick={() => setCurrentId(c.id)} 
              className={`group w-full flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${currentId===c.id? 'bg-secondary' : 'hover:bg-accent'}`}
            >
              <span className="truncate text-sm">{c.title}</span>
              <button 
                onClick={(e) => deleteConversation(e, c.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
                title="删除对话"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {conversations.length===0 && (
            <div className="text-sm text-muted-foreground text-center py-4">暂无对话</div>
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <div className="h-16 border-b border-input flex items-center px-6 justify-between">
          <div className="font-semibold">{conversations.find(c=>c.id===currentId)?.title || '对话'}</div>
        </div>
        <div ref={listRef} className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.length===0 && (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">今天有什么可以帮到你？</div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role==='user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-md ${m.role==='user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{m.content}</div>
            </div>
          ))}
        </div>
        <div className="h-20 border-t border-input px-6 flex items-center gap-3">
          <input 
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none" 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={session?.user ? '输入消息' : '登录后才能发送消息'} 
            disabled={!session?.user || !currentId} 
          />
          <Button onClick={send} disabled={!session?.user || sending || !currentId}>{sending ? '回复中' : '发送'}</Button>
        </div>
      </main>
    </div>
  )
}

export default ChatPage