import Navbar from "@/fragment/Navbar";
import "./globals.css";
import { cookies } from 'next/headers'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  return (
    <html lang="en">
      <body>
        <Navbar isLoggedIn={cookieStore.get('isLoggedIn')?.value === '1'}></Navbar>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
  