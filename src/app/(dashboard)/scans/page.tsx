'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, ShieldAlert, Clock, CheckCircle2, XCircle, Search, Filter } from 'lucide-react'
import { api } from '@/services/api'
import { Scan } from '@/types'

export default function ScansPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    api.getScans().then((data) => {
      setScans(data)
      setLoading(false)
    })
  }, [])

  const filteredScans = scans.filter((scan) => {
    const matchesStatus = statusFilter === 'all' || scan.status === statusFilter
    const matchesSearch = scan.target_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Scans</h1>
          <p className="text-sm text-slate-400 mt-1">Manage vulnerability scans, monitor active tests, and inspect scan results.</p>
        </div>
        <Link
          href="/scans/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors w-fit"
        >
          <Play className="h-4 w-4" />
          New Scan
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#334155] bg-[#1E293B] p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by target name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#475569] bg-[#0F172A] pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-[#475569] bg-[#0F172A] px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none capitalize"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
      </div>

      {/* Scans Table */}
      <div className="rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="border-b border-[#334155] bg-[#0F172A]/60 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Target</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Profile & Tools</th>
                <th className="px-6 py-4">Findings</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading scans...
                  </td>
                </tr>
              ) : filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No scans found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-[#334155]/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <Link href={`/scans/${scan.id}`} className="hover:text-blue-400 transition-colors">
                        {scan.target_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        scan.status === 'running' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' :
                        scan.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {scan.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {scan.status === 'running' && <Clock className="h-3.5 w-3.5 animate-spin" />}
                        {scan.status === 'failed' && <XCircle className="h-3.5 w-3.5" />}
                        {scan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="capitalize font-medium text-slate-300">{scan.profile}</div>
                      <div className="flex gap-1 mt-1">
                        {scan.tools.map((tool) => (
                          <span key={tool} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#0F172A] text-slate-400 border border-[#475569]/50 uppercase">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded" title="Critical">C: {scan.critical_findings}</span>
                        <span className="text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded" title="High">H: {scan.high_findings}</span>
                        <span className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded" title="Total">Total: {scan.total_findings}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {scan.duration || `${scan.progress}% complete`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/scans/${scan.id}`}
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
