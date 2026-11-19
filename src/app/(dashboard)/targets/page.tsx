'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Target as TargetIcon, Plus, ShieldCheck, Play } from 'lucide-react'
import { api } from '@/services/api'
import { Target } from '@/types'

export default function TargetsPage() {
  const [targets, setTargets] = useState<Target[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getTargets().then((data) => {
      setTargets(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Monitored Targets</h1>
          <p className="text-sm text-slate-400 mt-1">Manage network ranges, web applications, and API endpoints.</p>
        </div>
        <Link
          href="/targets/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          Add Target
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading targets...</div>
        ) : targets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No targets configured yet.</div>
        ) : (
          targets.map((target) => (
            <div key={target.id} className="rounded-xl border border-[#334155] bg-[#1E293B] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <TargetIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{target.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{target.urls[0]}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    target.criticality === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                    {target.criticality}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">{target.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#334155] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Open Findings</span>
                  <span className="text-sm font-bold text-red-400">{target.open_findings}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Total Scans</span>
                  <span className="text-sm font-bold text-white">{target.total_scans}</span>
                </div>
                <Link
                  href="/scans/new"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  Scan
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
