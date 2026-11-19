'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Square,
  FileText,
  ShieldAlert,
} from 'lucide-react'
import { api } from '@/services/api'
import { Scan, Finding } from '@/types'
import toast from 'react-hot-toast'

export default function ScanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const scanId = params.id as string

  const [scan, setScan] = useState<Scan | null>(null)
  const [findings, setFindings] = useState<Finding[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!scanId) return
    Promise.all([api.getScan(scanId), api.getFindings()]).then(([scanData, findingsData]) => {
      if (scanData) setScan(scanData)
      setFindings(findingsData.filter((f) => f.scan_id === scanId))
      setLoading(false)
    })
  }, [scanId])

  // Simulate live progress if running
  useEffect(() => {
    if (!scan || scan.status !== 'running') return
    const interval = setInterval(() => {
      setScan((prev) => {
        if (!prev) return null
        const nextProgress = Math.min(prev.progress + 5, 100)
        if (nextProgress === 100) {
          return { ...prev, progress: 100, status: 'completed', duration: '12m' }
        }
        return { ...prev, progress: nextProgress }
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [scan?.status])

  const handleStop = async () => {
    try {
      const updated = await api.stopScan(scanId)
      setScan(updated)
      toast.success('Scan stopped')
    } catch {
      toast.error('Failed to stop scan')
    }
  }

  if (loading || !scan) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/scans"
            className="p-2 rounded-lg border border-[#334155] bg-[#1E293B] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">{scan.target_name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                scan.status === 'running' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' :
                scan.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}>
                {scan.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Scan ID: {scan.id} • Started {new Date(scan.started_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {scan.status === 'running' && (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 rounded-lg bg-red-600/20 border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Square className="h-4 w-4 fill-current" />
              Stop Scan
            </button>
          )}
          <button
            onClick={() => toast.success('Exporting PDF report...')}
            className="flex items-center gap-2 rounded-lg border border-[#475569] bg-[#1E293B] px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-[#334155] transition-colors"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Live Progress Card (if running) */}
      {scan.status === 'running' && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-blue-400">Scan in Progress ({scan.progress}%)</span>
            <span className="text-xs font-mono text-slate-400">Est. remaining: {scan.estimated_duration}</span>
          </div>
          <div className="w-full bg-[#1E293B] rounded-full h-2.5 overflow-hidden border border-[#334155]">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${scan.progress}%` }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {Object.entries(scan.tool_status).map(([tool, info]: [string, any]) => (
              <div key={tool} className="rounded-lg border border-[#334155] bg-[#1E293B] p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-white uppercase">{tool}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                    info.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10' :
                    info.status === 'running' ? 'text-blue-400 bg-blue-500/10 animate-pulse' : 'text-slate-400 bg-slate-800'
                  }`}>
                    {info.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">{info.findings} findings</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Findings Results Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 lg:col-span-1 space-y-4">
          <h3 className="text-base font-semibold text-white">Severity Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Critical', count: scan.critical_findings, color: 'bg-red-500' },
              { label: 'High', count: scan.high_findings, color: 'bg-orange-500' },
              { label: 'Medium', count: scan.medium_findings, color: 'bg-yellow-500' },
              { label: 'Low', count: scan.low_findings, color: 'bg-blue-500' },
              { label: 'Info', count: scan.info_findings, color: 'bg-slate-500' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A]/50 border border-[#334155]/60">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <span className={`h-3 w-3 rounded ${s.color}`} />
                  {s.label}
                </span>
                <span className="font-bold text-white font-mono">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Findings Table */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-white">Discovered Findings ({findings.length})</h3>
          <div className="space-y-3">
            {findings.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">No findings discovered in this scan yet.</div>
            ) : (
              findings.map((f) => (
                <Link
                  key={f.id}
                  href={`/findings/${f.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#334155]/60 bg-[#0F172A]/50 hover:bg-[#334155]/40 transition-colors block"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      f.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      {f.severity}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">{f.title}</h4>
                      <p className="text-xs text-slate-400 font-mono">{f.endpoint}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded font-mono">
                    Score {f.risk_score}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
