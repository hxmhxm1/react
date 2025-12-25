import Link from 'next/link'

import { POSTS } from './_data'

export default function Blog() {
  const notes = POSTS
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">博客</h1>
        <p className="text-sm text-gray-500">共 {notes.length} 篇</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <Link href={`/blog/${note.id}`} key={note.id} className="group">
            <article className="rounded-lg border border-black/10 bg-white shadow-sm p-5 transition hover:shadow-lg hover:border-black/20">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">{note.title}</h2>
              <p className="mt-2 text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{note.excerpt}</p>
              <div className="mt-4 text-xs text-gray-400">{new Date(note.updatedAt).toLocaleString('zh-CN', { hour12: false })}</div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}