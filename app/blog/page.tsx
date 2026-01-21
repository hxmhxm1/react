import { BASE_URL } from '@/const'
import { TNote } from '@/types/notes'
import { headers } from 'next/headers'
import Link from 'next/link'


export default async function BlogPage() {
  const h = await headers()
  const cookie = h.get('cookie') ?? ''
  let notes: TNote[] = []
  try {
    const res = await fetch(`${BASE_URL}/api/notes`, { cache: 'no-store', headers: { cookie } })
    notes = res.ok ? await res.json() : []
  } catch {
    notes = []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-2xl font-bold">博客</div>
        <p className="text-sm text-gray-500">共 {notes.length} 篇</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note: TNote) => (
          <Link key={note.id} href={`/blog/${note.id}`}>
            <article className="rounded-lg border border-black/10 bg-white shadow-sm p-5 transition hover:shadow-lg hover:border-black/20">
              <h2 className="text-lg font-semibold text-gray-900">{note.title}</h2>
              <p className="mt-2 text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{note.content}</p>
              <div className="mt-4 text-xs text-gray-400">{new Date(note.updatedAt).toLocaleString('zh-CN', { hour12: false })}</div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}