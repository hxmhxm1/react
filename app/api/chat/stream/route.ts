import { NextResponse } from 'next/server'

function escapeSse(text: string) {
  return text.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"')
}

export async function POST(request: Request) {
  const { query } = await request.json().catch(() => ({ query: '' })) as { query?: string }
  if (!query || !query.trim()) {
    const body = 'data: {"error":"查询内容不能为空"}\n\n'
    return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
  }

  const MODEL_NAME = process.env.MODEL_NAME
  const ARK_API_KEY = process.env.ARK_API_KEY
  const API_BASE_URL = process.env.API_BASE_URL

  if (!MODEL_NAME || !ARK_API_KEY || !API_BASE_URL) {
    const body = 'data: {"error":"缺少必要的环境变量: MODEL_NAME/ARK_API_KEY/API_BASE_URL"}\n\n'
    return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
  }

  const external = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ARK_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL_NAME, messages: [{ role: 'user', content: query }], stream: true })
  })

  if (!external.ok || !external.body) {
    const body = `data: {"error":"HTTP ${external.status}"}\n\n`
    return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
  }

  const encoder = new TextEncoder()
  const bodyStream = external.body!
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode('data: {"status":"started"}\n\n'))
      const reader = bodyStream.getReader()
      const decoder = new TextDecoder()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(l => l.trim())
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const data = line.slice(5).trim()
            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: {"status":"completed"}\n\n'))
              continue
            }
            try {
              const parsed = JSON.parse(data)
              const delta = parsed?.choices?.[0]?.delta?.content ?? ''
              if (delta) controller.enqueue(encoder.encode(`data: {"content":"${escapeSse(String(delta))}"}\n\n`))
            } catch {}
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`data: {"error":"${escapeSse(String(err))}"}\n\n`))
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}