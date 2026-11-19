export type UserRole = 'admin' | 'analyst' | 'developer' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url: string | null
  last_login: string | null
  api_keys: string[]
  team: string[]
  notifications: NotificationSetting
  created_at: string
}

export interface NotificationSetting {
  scan_completion: boolean
  critical_findings: boolean
  false_positive: boolean
  new_team_member: boolean
}

export interface CreateUserRequest {
  name: string
  email: string
  role: UserRole
  password: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  avatar_url?: string
  api_keys?: string[]
  notifications?: NotificationSetting
}