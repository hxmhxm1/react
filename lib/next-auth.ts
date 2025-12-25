import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma-client'

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
        if (!credentials?.username || !credentials?.password) return null
        const user = await prisma.user.findFirst({ where: { username: credentials.username } })
        if (!user) return null
        if (user.password !== credentials.password) return null
        return { id: user.id, name: user.username }
      },
    }),
  ],
  pages: { signIn: '/auth/login' },
  secret: process.env.AUTH_SECRET,
}