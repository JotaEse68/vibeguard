import { AuditResult, DetectedStack, ReportSummary } from '@/types'

export function generateMD(stack: DetectedStack, results: AuditResult[], summary: ReportSummary, input: string): string {
  const date = new Date().toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })
  const e: Record<string,string> = { red:'🔴', yellow:'🟡', green:'✅', skip:'⏭️' }
  let md = `# VibeguARD — Reporte\n> ${date} · by Jota!\n\n**App:** \`${input}\`\n\n`
  md += `## ${summary.launch_verdict}\n**${summary.summary}** · ${summary.overall_score}/100\n\n`
  md += `| 🔴 Crítico | 🟡 Atención | ✅ OK |\n|--|--|--|\n| ${(summary.critical_count||0)+(summary.high_count||0)} | ${summary.medium_count||0} | ${summary.green_count||0} |\n\n`
  if (summary.top_3_fixes?.length) {
    md += `## ⚡ Arregla esto primero\n`
    summary.top_3_fixes.forEach((f,i) => { md += `${i+1}. **${f.title}** — ${f.why_urgent}\n` })
    md += '\n'
  }
  for (const cat of ['base','security','quality','production']) {
    const items = results.filter(r => r.category === cat && r.status !== 'skip')
    if (!items.length) continue
    const labels: Record<string,string> = { base:'🏗️ La base', security:'🔒 Seguridad', quality:'✨ Calidad', production:'🚀 Producción' }
    md += `## ${labels[cat]}\n\n`
    for (const r of items) {
      md += `### ${e[r.status]||'❓'} ${r.title}\n**Encontrado:** ${r.found}\n**Riesgo:** ${r.risk}\n**Solución:** ${r.solution}\n`
      if (r.claudeCodePrompt) md += `\n**Prompt Claude Code:**\n\`\`\`\n${r.claudeCodePrompt}\n\`\`\`\n`
      md += '\n---\n\n'
    }
  }
  md += `*VibeguARD by Jota! — [tokenslayer.netlify.app](https://tokenslayer.netlify.app)*`
  return md
}
