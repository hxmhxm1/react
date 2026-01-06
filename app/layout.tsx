import Navbar from "@/fragment/Navbar";
import "./globals.css";
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { Providers } from './providers'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <Navbar isLoggedIn={!!session}></Navbar>
          <main className="pt-16 h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
  