export type Criticality = 'critical' | 'high' | 'medium' | 'low'

export interface Target {
  id: string
  name: string
  criticality: Criticality
  urls: string[]
  ip_ranges: string[]
  owner: string
  last_scan: string | null
  created_at: string
  description: string | null
  open_findings: number
  total_scans: number
}

export interface CreateTargetRequest {
  name: string
  criticality: Criticality
  urls: string[]
  ip_ranges: string[]
  owner: string
  description?: string
}

export interface TargetListItem {
  id: string
  name: string
  criticality: Criticality
  owner: string
  last_scan: string | null
  open_findings: number
  total_scans: number
}
