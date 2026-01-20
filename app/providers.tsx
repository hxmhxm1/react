'use client'

import { ReactNode, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

interface ProvidersProps {
  children: ReactNode
  session: Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  useEffect(() => {
    const orig: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = window.fetch.bind(window)
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const res = await orig(input, init)
      if (res.status === 401) {
        const href = typeof window.location?.href === 'string' ? window.location.href : ''
        if (!href.includes('/auth/login')) {
          window.location.href = '/auth/login'
        }
      }
      return res
    }
  }, [])
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
