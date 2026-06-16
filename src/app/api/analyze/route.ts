import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { AUDIT_POINTS, FREE_POINTS } from '@/lib/audit-points'
import { DETECT_STACK, buildAuditPrompt, buildSummaryPrompt } from '@/lib/prompts'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const rl = new Map<string, { n: number; t: number }>()

function limit(ip: string, pro: boolean): boolean {
  if (pro) return true
  const now = Date.now(), k = `f:${ip}`, r = rl.get(k)
  if (!r || now > r.t) { rl.set(k, { n: 1, t: now + 86400000 }); return true }
  if (r.n >= 1) return false
  r.n++; return true
}

async function fetchRepo(url: string): Promise<string> {
  const m = url.match(/github\.com\/([^/]+)\/([^/\s#?]+)/)
  if (!m) throw new Error('URL de GitHub no válida')
  const [, owner, repo] = m
  const clean = repo.replace(/\.git$/, '')
  const h: Record<string,string> = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'VibeguARD/1.0' }
  if (process.env.GITHUB_TOKEN) h['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
  const parts: string[] = []
  try {
    const tr = await fetch(`https://api.github.com/repos/${owner}/${clean}/git/trees/HEAD?recursive=1`, { headers: h })
    if (tr.status === 404) throw new Error('Repositorio no encontrado o privado')
    if (tr.ok) {
      const t = await tr.json()
      const list = t.tree?.filter((f: {type:string}) => f.type==='blob').map((f: {path:string}) => f.path).join('\n') || ''
      parts.push(`## Árbol\n\`\`\`\n${list}\n\`\`\`\n`)
    }
  } catch(e) { if (e instanceof Error && e.message.includes('privado')) throw e }
  const files = ['package.json','.env.example','.gitignore','README.md','next.config.js','next.config.ts','vite.config.ts','vercel.json','netlify.toml','src/middleware.ts','middleware.ts','src/app/layout.tsx','app/layout.tsx','src/lib/supabase.ts','lib/supabase.ts','prisma/schema.prisma','auth.ts']
  for (const f of files) {
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${clean}/contents/${f}`, { headers: h })
      if (r.ok) { const d = await r.json(); if (d.content) parts.push(`## ${f}\n\`\`\`\n${Buffer.from(d.content,'base64').toString('utf-8').slice(0,3000)}\n\`\`\`\n`) }
    } catch { /* no existe */ }
  }
  if (!parts.length) throw new Error('No se pudo leer el repositorio')
  return parts.join('\n').slice(0, 80000)
}

async function ai(prompt: string, ctx: string): Promise<string> {
  const r = await anthropic.messages.create({
    model: 'claude-sonnet-4-6', max_tokens: 4096,
    messages: [{ role: 'user', content: ctx ? `${prompt}\n\n---\n\n${ctx}` : prompt }]
  })
  return r.content.find(b => b.type==='text')?.text || ''
}

function parse<T>(raw: string, fb: T): T {
  try { return JSON.parse(raw.replace(/```json|```/g,'').trim()) } catch { return fb }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const { input_type, github_url, markdown_content, is_pro } = await req.json()
    if (!limit(ip, !!is_pro)) return NextResponse.json({ error: 'Límite diario alcanzado. Actualiza a PRO para auditorías ilimitadas.' }, { status: 429 })
    let ctx = '', appInput = ''
    if (input_type === 'github') {
      if (!github_url) return NextResponse.json({ error: 'Proporciona la URL del repo' }, { status: 400 })
      appInput = github_url; ctx = await fetchRepo(github_url)
    } else {
      if (!markdown_content) return NextResponse.json({ error: 'Proporciona el Markdown' }, { status: 400 })
      appInput = 'Archivo MD'; ctx = String(markdown_content).slice(0, 80000)
    }
    const stack = parse<Record<string,unknown>>(await ai(DETECT_STACK, ctx), { confidence: 'low' })
    const points = is_pro ? AUDIT_POINTS : FREE_POINTS
    const raw = parse<Record<string,unknown>[]>(await ai(buildAuditPrompt(stack, points.map(p=>p.id)), ctx), [])
    if (!raw.length) return NextResponse.json({ error: 'Error procesando el análisis' }, { status: 500 })
    const summary = parse<Record<string,unknown>>(await ai(buildSummaryPrompt(raw), ''), {})
    const results = raw.map(r => {
      const p = AUDIT_POINTS.find(x => x.id === r.id)
      return { ...r, what: p?.what||'', category: p?.category||'base', categoryLabel: p?.categoryLabel||'', claudeCodePrompt: is_pro ? (p?.claudeCodePrompt||null) : null }
    })
    return NextResponse.json({ success: true, app_input: appInput, stack, results, summary, is_pro: !!is_pro, points_analyzed: points.length })
  } catch(e) {
    const msg = e instanceof Error ? e.message : 'Error inesperado'
    console.error('[VibeguARD]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
