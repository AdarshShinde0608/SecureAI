'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldAlert,
  ShieldCheck,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  AlertTriangle,
  Play,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { api } from '@/services/api'
import { Scan, Finding } from '@/types'

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboardSummary().then((data) => {
      setSummary(data)
      setLoading(false)
    })
  }, [])

  if (loading || !summary) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading security intelligence...</p>
        </div>
      </div>
    )
  }

  const { stats, severity_distribution, vulnerability_trend, recent_scans, top_vulnerabilities } = summary

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Operations Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time overview of active vulnerabilities, scans, and monitored targets.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/scans/new"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors"
          >
            <Play className="h-4 w-4" />
            New Scan
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Scans</span>
            <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{stats.total_scans}</span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              {stats.total_scans_trend}
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Findings</span>
            <div className="rounded-lg bg-orange-500/10 p-2.5 text-orange-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{stats.open_findings}</span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              {stats.open_findings_trend}
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical / High</span>
            <div className="rounded-lg bg-red-500/10 p-2.5 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{stats.critical_vulnerabilities}</span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              {stats.critical_vulnerabilities_trend}
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Targets Monitored</span>
            <div className="rounded-lg bg-purple-500/10 p-2.5 text-purple-400">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{stats.targets_monitored}</span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              {stats.targets_monitored_trend}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Severity Donut Chart */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Severity Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Current open findings across all targets</p>
          </div>
          <div className="h-64 my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severity_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {severity_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#F1F5F9', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#334155]/60 text-xs">
            {severity_distribution.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Line Chart */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 shadow-lg lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Vulnerability Discovery Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Discovered vulnerabilities over the last 12 weeks</p>
          </div>
          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vulnerability_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#F1F5F9', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="critical" stroke="#DC2626" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="high" stroke="#EA580C" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="medium" stroke="#CA8A04" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-end gap-6 text-xs text-slate-300 pt-2 border-t border-[#334155]/60">
            <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded bg-red-600" /> Critical</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded bg-orange-600" /> High</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded bg-yellow-600" /> Medium</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Scans */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Recent Scans</h3>
            <Link href="/scans" className="text-xs font-medium text-blue-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recent_scans.slice(0, 4).map((scan: Scan) => (
              <Link
                key={scan.id}
                href={`/scans/${scan.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-[#334155]/60 bg-[#0F172A]/50 hover:bg-[#334155]/40 transition-colors block"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    scan.status === 'completed' ? 'bg-emerald-500' :
                    scan.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{scan.target_name}</h4>
                    <p className="text-xs text-slate-400 capitalize">{scan.profile} scan • {scan.duration || 'In progress'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                    scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    scan.status === 'running' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {scan.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Vulnerabilities */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Top Risk Findings</h3>
            <Link href="/findings" className="text-xs font-medium text-blue-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {top_vulnerabilities.map((finding: Finding) => (
              <Link
                key={finding.id}
                href={`/findings/${finding.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-[#334155]/60 bg-[#0F172A]/50 hover:bg-[#334155]/40 transition-colors block"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    finding.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                    {finding.severity}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 truncate max-w-xs">{finding.title}</h4>
                    <p className="text-xs text-slate-400 font-mono">{finding.endpoint}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">
                    Score {finding.risk_score}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
