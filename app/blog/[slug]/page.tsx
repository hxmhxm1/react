import Link from 'next/link'

import { POSTS } from '../_data'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const urlParams = await params
  const note = POSTS.find(p => p.id.toLowerCase() === urlParams.slug?.toLowerCase())
  return { title: note ? note.title : '未找到博客' }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const urlParams = await params
  const note = POSTS.find(p => p.id.toLowerCase() === urlParams.slug?.toLowerCase())
  if (!note) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-black">&larr; 返回博客列表</Link>
        <div className="mt-6 rounded-lg border border-black/10 bg-white p-6 text-gray-600">未找到博客</div>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-black">&larr; 返回博客列表</Link>
      </div>
      <h1 className="text-3xl font-bold">{note.title}</h1>
      <div className="mt-2 text-sm text-gray-500">
        {new Date(note.updatedAt).toLocaleString('zh-CN', { hour12: false })}
      </div>
      <article className="mt-6 leading-7 text-gray-800 whitespace-pre-wrap">
        {note.content}
      </article>
    </div>
  )
}