'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldAlert, Search, Filter, CheckCircle2 } from 'lucide-react'
import { api } from '@/services/api'
import { Finding } from '@/types'
import toast from 'react-hot-toast'

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([])
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    api.getFindings().then((data) => {
      setFindings(data)
      setLoading(false)
    })
  }, [])

  const filteredFindings = findings.filter((f) => {
    const matchesSev = severityFilter === 'all' || f.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSev && matchesStatus && matchesSearch
  })

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFindings.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredFindings.map((f) => f.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleBulkAction = (action: string) => {
    toast.success(`Successfully applied "${action}" to ${selectedIds.length} findings`)
    setSelectedIds([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Vulnerability Findings</h1>
          <p className="text-sm text-slate-400 mt-1">Review, prioritize, and remediate security flaws detected across targets.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#334155] bg-[#1E293B] p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#475569] bg-[#0F172A] pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-[#475569] bg-[#0F172A] px-3 py-2 text-sm text-slate-200 capitalize"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#475569] bg-[#0F172A] px-3 py-2 text-sm text-slate-200 capitalize"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="false_positive">False Positive</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
          <span className="text-sm font-medium text-blue-400">{selectedIds.length} findings selected</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBulkAction('Mark Resolved')}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => handleBulkAction('Mark False Positive')}
              className="rounded-lg border border-[#475569] bg-[#1E293B] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#334155] transition-colors"
            >
              Mark False Positive
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="border-b border-[#334155] bg-[#0F172A]/60 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredFindings.length && filteredFindings.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[#475569] bg-[#0F172A] text-blue-600"
                  />
                </th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Endpoint</th>
                <th className="px-6 py-4">CWE</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">Loading findings...</td>
                </tr>
              ) : filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">No findings found matching criteria.</td>
                </tr>
              ) : (
                filteredFindings.map((f) => (
                  <tr key={f.id} className="hover:bg-[#334155]/30 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(f.id)}
                        onChange={() => toggleSelect(f.id)}
                        className="rounded border-[#475569] bg-[#0F172A] text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        f.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        f.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <Link href={`/findings/${f.id}`} className="hover:text-blue-400 transition-colors">
                        {f.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">{f.endpoint}</td>
                    <td className="px-6 py-4 font-mono text-xs text-blue-400">{f.cwe_id || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">
                        {f.risk_score}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-slate-800 text-slate-300 border border-[#475569]">
                        {f.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/findings/${f.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-[#475569] bg-[#0F172A] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#334155] transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
