import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: '缺少用户名或密码' }, { status: 400 })
  }
  const exists = await prisma.user.findFirst({ where: { username } })
  if (exists) {
    return NextResponse.json({ error: '用户名已存在' }, { status: 409 })
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { username, password: hashed }
  })
  return NextResponse.json({ ok: true, id: user.id })
}