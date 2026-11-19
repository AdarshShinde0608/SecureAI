'use client'

import React, { useState, useEffect } from 'react'
import { User, Key, Users, Bell, Save } from 'lucide-react'
import { api } from '@/services/api'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'team' | 'notifications'>('profile')
  const [team, setTeam] = useState<any[]>([])
  const [apiKey, setApiKey] = useState('sec_live_9983a7bc492011efa8e8df')

  useEffect(() => {
    api.getTeam().then(setTeam)
  }, [])

  const handleSave = () => {
    toast.success('Settings successfully updated!')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage user account profile, API keys, team members, and alert preferences.</p>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-[#334155] gap-8">
        {[
          { id: 'profile', name: 'Profile', icon: User },
          { id: 'api', name: 'API Keys', icon: Key },
          { id: 'team', name: 'Team Members', icon: Users },
          { id: 'notifications', name: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                isActive ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-8 shadow-xl space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Personal Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Sarah Connor"
                  className="w-full rounded-lg border border-[#475569] bg-[#0F172A] px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="sarah@example.com"
                  className="w-full rounded-lg border border-[#475569] bg-[#0F172A] px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">API Keys & CI/CD Integration</h3>
            <p className="text-sm text-slate-400">Use API keys to trigger automated security scans directly from your GitHub Actions or GitLab CI pipelines.</p>
            <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Active Secret API Key</span>
                <span className="font-mono text-sm text-emerald-400">{apiKey}</span>
              </div>
              <button
                onClick={() => {
                  setApiKey(`sec_live_${Math.random().toString(36).substring(2, 25)}`)
                  toast.success('New API key generated!')
                }}
                className="rounded-lg border border-[#475569] bg-[#1E293B] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-[#334155]"
              >
                Regenerate Key
              </button>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Team Members</h3>
              <button
                onClick={() => toast.success('Invite modal opened')}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Invite Member
              </button>
            </div>
            <div className="space-y-3">
              {team.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{m.name}</h4>
                      <p className="text-xs text-slate-400">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {m.role}
                    </span>
                    <span className="text-xs text-slate-400">{m.last_login}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Alert Preferences</h3>
            <div className="space-y-4">
              {[
                { title: 'Scan Completion Alerts', desc: 'Receive notifications when automated scans finish.' },
                { title: 'Critical Vulnerability Alerts', desc: 'Instant push alerts when critical CVEs are detected.' },
                { title: 'Weekly Security Digest', desc: 'Summary of security posture and weekly trend reports.' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                    <p className="text-xs text-slate-400">{n.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-[#475569] bg-[#1E293B] text-blue-600 h-5 w-5" />
                </div>
              ))}
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
