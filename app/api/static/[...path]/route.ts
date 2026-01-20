import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'
const ALLOWED_EXTS = new Set(['.gltf', '.glb', '.bin', '.png', '.jpg', '.jpeg', '.webp'])
const CONTENT_TYPES: Record<string, string> = {
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary',
  '.bin': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segs } = await params
    const reqPath = Array.isArray(segs) ? segs.join('/') : ''
    const projectRoot = process.cwd()
    const assetsRoot = path.join(projectRoot, 'assets')
    const relWithinAssets = reqPath.replace(/^assets\//, '')
    const absPath = path.join(assetsRoot, relWithinAssets)

    if (!absPath.startsWith(assetsRoot)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const ext = path.extname(absPath).toLowerCase()
    if (!ALLOWED_EXTS.has(ext)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
    }

    const buf = await fs.readFile(absPath)
    const ct = CONTENT_TYPES[ext] || 'application/octet-stream'
    return new Response(buf as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=31536000, immutable',
      }
    })
  } catch (e) {
    const msg = typeof (e as { message?: string })?.message === 'string' ? (e as { message?: string }).message! : 'Not Found'
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}
