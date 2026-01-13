type Message = {
  id: string
  userId: string
  username: string
  content: string
  createdAt: number
}

class ChatStore {
  private messages: Message[] = []
  private max = 200

  add(userId: string, username: string, content: string) {
    const msg: Message = {
      id: crypto.randomUUID(),
      userId,
      username,
      content,
      createdAt: Date.now(),
    }
    this.messages.push(msg)
    if (this.messages.length > this.max) this.messages = this.messages.slice(-this.max)
    return msg
  }

  list(since?: number) {
    if (!since) return this.messages
    return this.messages.filter(m => m.createdAt > since)
  }
}

const globalStore = global as unknown as { __chatStore?: ChatStore }
if (!globalStore.__chatStore) globalStore.__chatStore = new ChatStore()

export const chatStore = globalStore.__chatStore!
export type { Message }