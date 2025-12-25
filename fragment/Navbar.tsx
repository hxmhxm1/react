'use client'

// components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { deleteCookie } from 'cookies-next'

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter()
  function handleLogout() {
    deleteCookie('isLoggedIn', { path: '/' })
    deleteCookie('userName', { path: '/' })
    router.replace('/auth/login')
    router.refresh()
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
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300">
              </div>
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
