type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export async function chatCompletion(messages: ChatMessage[]) {
  const apiKey = process.env.ALIYUN_API_KEY
  const model = process.env.ALIYUN_MODEL || 'qwen2.5'
  const endpoint = process.env.ALIYUN_ENDPOINT || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
  if (!apiKey) throw new Error('缺少 ALIYUN_API_KEY')
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Aliyun Error: ${res.status} ${text}`)
  }
  const data = await res.json()
  const choice = data?.choices?.[0]?.message?.content ?? ''
  return typeof choice === 'string' ? choice : String(choice)
}

export type { ChatMessage }