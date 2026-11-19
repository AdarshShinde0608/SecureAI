'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Target as TargetIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/services/api'
import toast from 'react-hot-toast'

export default function NewTargetPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [criticality, setCriticality] = useState<'critical' | 'high' | 'medium' | 'low'>('high')
  const [url, setUrl] = useState('')
  const [ipRange, setIpRange] = useState('')
  const [owner, setOwner] = useState('security@example.com')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !url) {
      toast.error('Please fill in required fields')
      return
    }

    setIsSubmitting(true)
    try {
      await api.createTarget({
        name,
        criticality,
        urls: [url],
        ip_ranges: ipRange ? [ipRange] : ['192.168.1.0/24'],
        owner,
        description,
      })
      toast.success('Target successfully created!')
      router.push('/targets')
    } catch {
      toast.error('Failed to create target')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/targets"
          className="p-2 rounded-lg border border-[#334155] bg-[#1E293B] text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Add Monitored Target</h1>
          <p className="text-sm text-slate-400 mt-1">Register a new web application, API, or network range for automated scans.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-[#334155] bg-[#1E293B] p-8 space-y-6 shadow-xl">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Target Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Customer Portal API"
            className="w-full rounded-lg border border-[#475569] bg-[#0F172A] px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Target URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com"
              className="w-full rounded-lg border border-[#475569] bg-[#0F172A] px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Criticality Level</label>
            <select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value as any)}
              className="w-full rounded-lg border border-[#475569] bg-[#0F172A] px-4 py-2.5 text-sm text-slate-200 capitalize focus:border-blue-500 focus:outline-none"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">IP Range (CIDR)</label>
            <input
              type="text"
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
              placeholder="192.168.1.0/24"
              className="w-full rounded-lg border border-[#475569] bg-[#0F172A] px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Owner Email</label>
            <input
              type="email"
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full rounded-lg border border-[#475569] bg-[#0F172A] px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the target asset and architecture..."
            className="w-full rounded-lg border border-[#475569] bg-[#0F172A] p-3 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#334155]">
          <Link
            href="/targets"
            className="rounded-lg border border-[#475569] bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-[#334155] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Target'}
          </button>
        </div>
      </form>
    </div>
  )
}
