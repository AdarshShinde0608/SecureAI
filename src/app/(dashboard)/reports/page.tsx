'use client'

import React, { useEffect, useState } from 'react'
import { FileText, Download, Plus, Shield } from 'lucide-react'
import { api } from '@/services/api'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    api.getReports().then((data) => {
      setReports(data)
      setLoading(false)
    })
  }, [])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const newRep = await api.generateReport({ target_id: 'target_1', type: 'Technical Vulnerability Audit', format: 'pdf' })
      setReports([newRep, ...reports])
      toast.success('Report successfully generated!')
    } catch {
      toast.error('Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Reports & Compliance</h1>
          <p className="text-sm text-slate-400 mt-1">Generate executive summaries, technical audit reports, and compliance exports.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors w-fit disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isGenerating ? 'Generating Report...' : 'Generate New Report'}
        </button>
      </div>

      <div className="rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="border-b border-[#334155] bg-[#0F172A]/60 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Report Name</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Generated Date</th>
                <th className="px-6 py-4">File Size</th>
                <th className="px-6 py-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading reports...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No reports generated yet.</td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#334155]/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-400" />
                      {r.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {r.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(r.generated_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">{r.size}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toast.success(`Downloading ${r.name}...`)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#475569] bg-[#0F172A] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#334155] transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
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
