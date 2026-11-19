export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type FindingStatus = 'open' | 'in_progress' | 'resolved' | 'false_positive'

export interface Finding {
  id: string
  scan_id: string
  target_id: string
  severity: Severity
  status: FindingStatus
  title: string
  description: string
  endpoint: string
  method: string
  parameter: string | null
  evidence: string | null
  cwe_id: string | null
  cwe_title: string | null
  risk_score: number
  discovered_at: string
  tool_source: string[]
  ai_explanation: string | null
  ai_impact: string | null
  ai_remediation: string | null
  remediation_code: string | null
  owner: string | null
  notes: string | null
  timeline: TimelineEvent[]
}

export interface TimelineEvent {
  id: string
  action: string
  actor: string
  timestamp: string
  details: string | null
}

export interface FindingListItem {
  id: string
  severity: Severity
  status: FindingStatus
  title: string
  endpoint: string
  cwe_id: string | null
  risk_score: number
  discovered_at: string
  tool_source: string[]
}