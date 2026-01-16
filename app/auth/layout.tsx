import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { Providers } from '../providers'

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}