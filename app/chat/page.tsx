"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
type Message = {
  id: string
  userId: string
  username: string
  content: string
  createdAt: number
}
import { Button } from "@/components/ui/button"

const ChatPage = () => {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [last, setLast] = useState<number | undefined>(undefined)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true
    let timer: NodeJS.Timeout | null = null
    const load = async () => {
      const url = last ? `/api/chat/messages?since=${last}` : "/api/chat/messages"
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) return
      const data: Message[] = await res.json()
      if (!mounted) return
      if (data.length > 0) {
        setMessages(prev => {
          const next = [...prev, ...data]
          next.sort((a, b) => a.createdAt - b.createdAt)
          return next
        })
        setLast(data[data.length - 1].createdAt)
      }
    }
    load()
    timer = setInterval(load, 2000)
    return () => {
      mounted = false
      if (timer) clearInterval(timer)
    }
  }, [last])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages.length])

  const send = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      })
      if (res.ok) {
        const msg: Message = await res.json()
        setMessages(prev => [...prev, msg])
        setLast(msg.createdAt)
        setInput("")
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="rounded-lg border border-input bg-card">
        <div className="p-4 border-b border-input flex items-center justify-between">
          <div className="font-semibold">对话聊天</div>
          <div className="text-sm text-muted-foreground">
            {session?.user?.name ? `已登录：${session.user.name}` : "未登录"}
          </div>
        </div>
        <div ref={listRef} className="h-[540px] overflow-y-auto p-4 space-y-3">
          {messages.map(m => (
            <div key={m.id} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs">
                {m.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{m.username}</div>
                <div className="mt-0.5 text-sm">{m.content}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString("zh-CN", { hour12: false })}
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">暂无消息</div>
          )}
        </div>
        <div className="p-4 border-t border-input flex items-center gap-3">
          <input
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={session?.user ? "输入消息" : "登录后才能发送消息"}
            disabled={!session?.user}
          />
          <Button onClick={send} disabled={!session?.user || sending}>
            {sending ? "发送中" : "发送"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage