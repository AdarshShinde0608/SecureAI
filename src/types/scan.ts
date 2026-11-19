export type ScanStatus = 'queued' | 'running' | 'completed' | 'failed' | 'stopped'
export type ScanTool = 'zap' | 'nmap' | 'nikto' | 'sslyze'

export interface Scan {
  id: string
  target_id: string
  target_name: string
  status: ScanStatus
  profile: 'quick' | 'standard' | 'comprehensive'
  tools: ScanTool[]
  total_findings: number
  critical_findings: number
  high_findings: number
  medium_findings: number
  low_findings: number
  info_findings: number
  started_at: string
  completed_at: string | null
  duration: string | null
  progress: number
  estimated_duration: string
  tool_status: Record<ScanTool, {
    status: 'queued' | 'running' | 'completed' | 'failed'
    progress: number
    findings: number
  }>
}

export interface CreateScanRequest {
  target_id: string
  profile: 'quick' | 'standard' | 'comprehensive'
  tools: ScanTool[]
  authenticated?: boolean
  login_url?: string
  username?: string
  password?: string
}

export interface ScanListItem {
  id: string
  target_name: string
  target_url: string
  status: ScanStatus
  tools: ScanTool[]
  total_findings: number
  critical_findings: number
  high_findings: number
  started_at: string
  duration: string | null
}