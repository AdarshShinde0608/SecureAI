'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, User } from 'lucide-react'
import { api } from '@/services/api'
import { Finding, FindingStatus } from '@/types'
import toast from 'react-hot-toast'

export default function FindingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const findingId = params.id as string

  const [finding, setFinding] = useState<Finding | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<FindingStatus>('open')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!findingId) return
    api.getFinding(findingId).then((data) => {
      if (data) {
        setFinding(data)
        setStatus(data.status)
        setNotes(data.notes || '')
      }
      setLoading(false)
    })
  }, [findingId])

  const handleStatusChange = async (newStatus: FindingStatus) => {
    setStatus(newStatus)
    try {
      await api.updateFindingStatus(findingId, newStatus, notes)
      toast.success('Finding status updated successfully')
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading || !finding) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/findings"
            className="p-2 rounded-lg border border-[#334155] bg-[#1E293B] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                finding.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              }`}>
                {finding.severity}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{finding.title}</h1>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">CWE ID: {finding.cwe_id} • Discovered {new Date(finding.discovered_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 text-sm">
            Risk Score: {finding.risk_score} / 10
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Evidence & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 space-y-3 shadow-lg">
            <h3 className="text-base font-semibold text-white">Vulnerability Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{finding.description}</p>
          </div>

          {/* Evidence Payload */}
          <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 space-y-3 shadow-lg">
            <h3 className="text-base font-semibold text-white">HTTP Evidence & Request Payload</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-3">
              <div className="p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
                <span className="text-slate-400 block mb-1">Method & Endpoint</span>
                <span className="text-blue-400 font-bold">{finding.method} {finding.endpoint}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
                <span className="text-slate-400 block mb-1">Vulnerable Parameter</span>
                <span className="text-orange-400 font-bold">{finding.parameter || 'N/A'}</span>
              </div>
            </div>
            {finding.evidence && (
              <div className="rounded-lg bg-[#0F172A] border border-[#334155] p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed">{finding.evidence}</pre>
              </div>
            )}
          </div>

          {/* Tool Sources */}
          <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 space-y-3 shadow-lg">
            <h3 className="text-base font-semibold text-white">Detection Scanners</h3>
            <div className="flex gap-2">
              {finding.tool_source.map((tool) => (
                <span key={tool} className="px-3 py-1 rounded-lg text-xs font-mono bg-[#0F172A] text-slate-300 border border-[#475569]">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Security Analysis & Status Management */}
        <div className="space-y-6">
          {/* AI Security Analysis Card */}
          <div className="rounded-xl border border-blue-500/30 bg-[#1E293B] p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-24 w-24 text-blue-400" />
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Sparkles className="h-5 w-5" />
              AI Security Analysis
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1">Root Cause Explanation</h4>
                <p>{finding.ai_explanation}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1">Business Impact</h4>
                <p className="text-orange-400">{finding.ai_impact}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1">Recommended Remediation</h4>
                <p>{finding.ai_remediation}</p>
              </div>
              {finding.remediation_code && (
                <div className="rounded-lg bg-[#0F172A] border border-[#334155] p-3 overflow-x-auto">
                  <pre className="text-[11px] font-mono text-emerald-400">{finding.remediation_code}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Status Management Card */}
          <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-white">Status & Workflow</h3>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Current Status</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as FindingStatus)}
                className="w-full rounded-lg border border-[#475569] bg-[#0F172A] px-3 py-2 text-sm text-slate-200 capitalize"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="false_positive">False Positive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Internal Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for your security team..."
                className="w-full rounded-lg border border-[#475569] bg-[#0F172A] p-3 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  api.updateFindingStatus(findingId, status, notes)
                  toast.success('Notes saved successfully')
                }}
                className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
