'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'



export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    signIn('credentials', { username, password, redirect: false })
      .then(res => {
        if (res?.error) {
          setMessage({ type: 'error', text: '用户名或密码错误' })
        } else {
          router.push('/')
          router.refresh()
        }
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl border border-black/10 bg-white shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">登录</h1>
          <p className="mt-1 text-sm text-gray-500">使用您的账号登录系统</p>
        </div>

        {message && (
          <div className={`mb-4 rounded-lg p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">密码</label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-black"
              >
                {showPassword ? '隐藏' : '显示'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="mr-2"
              />
              记住我
            </label>
            <Link href="/auth/forgot" className="text-sm text-gray-500 hover:text-black">忘记密码？</Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black text-white py-2 text-sm hover:bg-black/90"
          >
            登录
          </button>
        </form>

        {/* <p className="mt-6 text-center text-sm text-gray-600">
          没有账号？ <Link href="/auth/register" className="text-gray-800 hover:text-black">注册</Link>
        </p> */}
      </div>
    </div>
  )
}