'use client'

// components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { data: session } = useSession()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  function handleLogout() {
    signOut({ callbackUrl: '/auth/login' })
  }
  async function fetchAvatar() {
    if (!isLoggedIn) return
    const res = await fetch('/api/user/avatar', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setAvatarUrl(data.url || null)
    }
  }
  useEffect(() => {
    fetchAvatar()
  }, [isLoggedIn, session?.user?.name])
  async function handleUpload(file: File) {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/user/avatar', { method: 'POST', body: fd })
    if (res.ok) {
      const data = await res.json()
      setAvatarUrl(data.url)
    }
  }
  function onClickAvatar() {
    fileRef.current?.click()
  }
  function onChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleUpload(f)
    e.target.value = ''
  }
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-200 bg-red backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左侧：Logo */}
        <div className="font-bold text-xl tracking-tighter">
          MyPortfolio
        </div>

        {/* 中间：Tab 导航 */}
        <div className="flex gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">首页</Link>
          <Link href="/blog" className="hover:text-black transition-colors">博客</Link>
          <Link href="/admin/blog" className="hover:text-black transition-colors">我的博客</Link>
          <Link href="/demo" className="hover:text-black transition-colors">demo</Link>
        </div>

        {/* 右侧：登录状态判断 */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/admin/write">
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800">
                  写文章
                </button>
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-black">
                退出登录
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChangeFile} />
              {avatarUrl ? (
                <button onClick={onClickAvatar} className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                  <Image src={avatarUrl} alt="avatar" width={32} height={32} className="object-cover w-8 h-8" />
                </button>
              ) : (
                <button onClick={onClickAvatar} className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300" />
              )}
            </>
          ) : (
            <Link href="/auth/login" className="text-sm font-medium hover:underline">
              登录
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
