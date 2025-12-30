import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma-client'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' },
      },
      authorize: async (credentials) => {
        const username = credentials?.username?.trim()
        const password = credentials?.password
        if (!username || !password) return null
        const user = await prisma.user.findFirst({ where: { username } })
        if (!user) return null
        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null
        return { id: user.id, name: user.username }
      },
    }),
  ],
  pages: { signIn: '/auth/login' },
  secret: process.env.AUTH_SECRET,
}