export type AuditStatus = 'red' | 'yellow' | 'green' | 'skip'
export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type Effort = 'minutes' | 'hours' | 'days'

export interface DetectedStack {
  framework: string
  language: string
  database: string
  auth: string
  hosting: string
  payments: string
  ai_apis: string[]
  has_tests: boolean
  has_readme: boolean
  has_env_example: boolean
  has_gitignore: boolean
  confidence: string
}

export interface AuditResult {
  id: string
  status: AuditStatus
  title: string
  what?: string
  found: string
  risk: string
  solution: string
  effort: Effort
  severity: Severity
  category: 'base' | 'security' | 'quality' | 'production'
  categoryLabel: string
  claudeCodePrompt: string | null
}

export interface ReportSummary {
  overall_score: number
  overall_status: string
  summary: string
  critical_count: number
  high_count: number
  medium_count: number
  green_count: number
  top_3_fixes: Array<{ id: string; title: string; why_urgent: string }>
  launch_verdict: string
}

export interface AnalysisResponse {
  success: boolean
  app_input: string
  stack: DetectedStack
  results: AuditResult[]
  summary: ReportSummary
  is_pro: boolean
  points_analyzed: number
  error?: string
}
