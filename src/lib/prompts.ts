export const DETECT_STACK = `Eres el motor de VibeguARD. Detecta el stack del código que te muestro.
Responde SOLO con este JSON exacto, sin texto ni backticks:
{"framework":"next.js|react|vue|svelte|vanilla|other","language":"typescript|javascript|python|other","database":"supabase|firebase|postgresql|mongodb|sqlite|none|unknown","auth":"supabase-auth|firebase-auth|next-auth|clerk|auth0|custom|none|unknown","hosting":"vercel|netlify|railway|render|aws|unknown","payments":"stripe|lemonsqueezy|paddle|none|unknown","ai_apis":[],"has_tests":false,"has_readme":false,"has_env_example":false,"has_gitignore":false,"confidence":"high|medium|low"}`

export function buildAuditPrompt(stack: Record<string, unknown>, ids: string[]): string {
  return `Eres el motor de VibeguARD, auditor de seguridad para apps hechas con IA.
Stack: ${JSON.stringify(stack)}
Audita estos puntos adaptado al stack real: ${ids.join(', ')}
Responde SOLO con el array JSON, sin texto ni backticks:
[{"id":"","status":"red|yellow|green|skip","title":"","found":"qué encontraste específico del código real","risk":"riesgo concreto en dinero datos o reputación","solution":"cómo arreglarlo en 2-3 pasos para este stack","effort":"minutes|hours|days","severity":"critical|high|medium|low"}]
red=problema real, yellow=mejorable, green=ok, skip=no aplica`
}

export function buildSummaryPrompt(results: unknown[]): string {
  return `Eres el motor de VibeguARD. Genera el resumen ejecutivo. SOLO el JSON, sin texto ni backticks:
{"overall_score":0,"overall_status":"not-ready|needs-work|almost-ready|ready","summary":"estado en máximo 12 palabras","critical_count":0,"high_count":0,"medium_count":0,"green_count":0,"top_3_fixes":[{"id":"","title":"","why_urgent":""}],"launch_verdict":"lanza ya|arregla estos 3 primero|no lances todavía|necesita trabajo serio"}
Resultados: ${JSON.stringify(results)}`
}
