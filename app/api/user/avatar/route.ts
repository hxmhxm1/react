import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import prisma from '@/lib/prisma-client'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const exts = ['png', 'jpg', 'jpeg', 'webp']

function buildDir() {
  return path.join(process.cwd(), 'public', 'uploads', 'avatars')
}

function buildPath(userId: string, ext: string) {
  return path.join(buildDir(), `${userId}.${ext}`)
}

function publicUrl(userId: string, ext: string) {
  return `/uploads/avatars/${userId}.${ext}`
}

export async function GET() {
  // 获取当前登录会话，用于识别用户身份
  const session = await getServerSession(authOptions)
  // 未登录或缺少用户名则拒绝访问
  if (!session?.user?.name) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // 通过用户名查找用户，获取用户ID以定位头像文件
  const user = await prisma.user.findFirst({ where: { username: session.user.name } })
  // 用户不存在则拒绝访问
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    // 计算并确保头像目录存在（public/uploads/avatars）
    const dir = buildDir()
    await fs.mkdir(dir, { recursive: true })
    // 遍历允许的扩展名，探测哪个文件存在
    for (const ext of exts) {
      // 拼接该扩展下的头像绝对路径
      const p = buildPath(user.id, ext)
      try {
        // 能访问说明文件存在，返回对应公开URL
        await fs.access(p)
        return NextResponse.json({ url: publicUrl(user.id, ext) })
      } catch {}
    }
    // 未找到任何头像文件则返回null
    return NextResponse.json({ url: null })
  } catch (e) {
    // 文件系统等异常，返回500
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // 校验登录会话，确保只有登录用户可上传头像
  const session = await getServerSession(authOptions)
  // 未登录则拒绝
  if (!session?.user?.name) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // 查找当前登录用户信息
  const user = await prisma.user.findFirst({ where: { username: session.user.name } })
  // 未找到用户则拒绝
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // 解析multipart/form-data，获取文件字段
  const form = await req.formData()
  const file = form.get('file') as File | null
  // 未传文件返回400
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  // 读取文件内容为ArrayBuffer并转为Buffer用于写盘
  const arrayBuffer = await file.arrayBuffer()
  const buf = Buffer.from(arrayBuffer)
  // 根据原始文件名提取扩展，默认png
  const name = file.name || `${user.id}.png`
  const ext = (name.split('.').pop() || 'png').toLowerCase()
  // 只允许白名单扩展，否则强制png
  const safeExt = exts.includes(ext) ? ext : 'png'
  try {
    // 确保头像目录存在
    const dir = buildDir()
    await fs.mkdir(dir, { recursive: true })
    // 清理所有可能残留的旧扩展文件
    for (const e of exts) {
      const oldPath = buildPath(user.id, e)
      try { await fs.unlink(oldPath) } catch {}
    }
    // 写入新头像文件
    const p = buildPath(user.id, safeExt)
    await fs.writeFile(p, buf)
    // 返回公开URL供前端展示
    return NextResponse.json({ url: publicUrl(user.id, safeExt) })
  } catch (e) {
    // 任意错误视为上传失败
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}