'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowRight, ArrowLeft, Check, Play, Lock } from 'lucide-react'
import { api } from '@/services/api'
import { Target, ScanTool } from '@/types'
import toast from 'react-hot-toast'

export default function NewScanPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [targets, setTargets] = useState<Target[]>([])
  const [selectedTarget, setSelectedTarget] = useState<string>('')
  const [profile, setProfile] = useState<'quick' | 'standard' | 'comprehensive'>('standard')
  const [tools, setTools] = useState<ScanTool[]>(['zap', 'nikto', 'sslyze'])
  const [authenticated, setAuthenticated] = useState(false)
  const [loginUrl, setLoginUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    api.getTargets().then((data) => {
      setTargets(data)
      if (data.length > 0) setSelectedTarget(data[0].id)
    })
  }, [])

  const handleToolToggle = (tool: ScanTool) => {
    if (tools.includes(tool)) {
      if (tools.length > 1) setTools(tools.filter((t) => t !== tool))
    } else {
      setTools([...tools, tool])
    }
  }

  const handleLaunch = async () => {
    setIsSubmitting(true)
    try {
      const scan = await api.createScan({
        target_id: selectedTarget,
        profile,
        tools,
        authenticated,
        login_url: loginUrl,
        username,
        password,
      })
      toast.success('Scan successfully launched!')
      router.push(`/scans/${scan.id}`)
    } catch {
      toast.error('Failed to launch scan')
      setIsSubmitting(false)
    }
  }

  const targetObj = targets.find((t) => t.id === selectedTarget)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Configure New Security Scan</h1>
        <p className="text-sm text-slate-400 mt-1">Set up automated vulnerability detection across targets and testing profiles.</p>
      </div>

      {/* Stepper Progress */}
      <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[#334155]">
        <div className={`flex items-center gap-3 ${step >= 1 ? 'text-blue-400' : 'text-slate-500'}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-[#1E293B] border border-[#334155]'}`}>
            1
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">Step 1</div>
            <div className="text-sm font-medium text-slate-200">Select Target</div>
          </div>
        </div>
        <div className={`flex items-center gap-3 ${step >= 2 ? 'text-blue-400' : 'text-slate-500'}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-[#1E293B] border border-[#334155]'}`}>
            2
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">Step 2</div>
            <div className="text-sm font-medium text-slate-200">Profile & Tools</div>
          </div>
        </div>
        <div className={`flex items-center gap-3 ${step >= 3 ? 'text-blue-400' : 'text-slate-500'}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-[#1E293B] border border-[#334155]'}`}>
            3
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">Step 3</div>
            <div className="text-sm font-medium text-slate-200">Review & Launch</div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-8 shadow-xl">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Choose Target Asset</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {targets.map((target) => (
                <div
                  key={target.id}
                  onClick={() => setSelectedTarget(target.id)}
                  className={`cursor-pointer rounded-xl border p-5 transition-all ${
                    selectedTarget === target.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                      : 'border-[#334155] bg-[#0F172A]/50 hover:bg-[#334155]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{target.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      target.criticality === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      {target.criticality}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate">{target.urls[0]}</p>
                  <p className="text-xs text-slate-500 mt-3">{target.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Select Testing Profile</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { id: 'quick', name: 'Quick Recon', time: '~5 mins', desc: 'ZAP spider and surface port scan' },
                  { id: 'standard', name: 'Standard Audit', time: '~15 mins', desc: 'ZAP + Nikto + SSLyze comprehensive check' },
                  { id: 'comprehensive', name: 'Comprehensive', time: '~45 mins', desc: 'All tools + active fuzzing & SQLi payloads' },
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setProfile(p.id as any)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      profile === p.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#334155] bg-[#0F172A]/50 hover:bg-[#334155]/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-white">{p.name}</h4>
                      <span className="text-xs font-mono text-blue-400">{p.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#334155]">
              <h3 className="text-base font-semibold text-white mb-3">Individual Security Tools</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'zap', name: 'OWASP ZAP', desc: 'DAST scanner' },
                  { id: 'nikto', name: 'Nikto', desc: 'Web server scanner' },
                  { id: 'nmap', name: 'Nmap', desc: 'Port & service audit' },
                  { id: 'sslyze', name: 'SSLyze', desc: 'SSL/TLS configuration' },
                ].map((tool) => {
                  const isChecked = tools.includes(tool.id as ScanTool)
                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleToolToggle(tool.id as ScanTool)}
                      className={`cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-colors ${
                        isChecked ? 'border-blue-500 bg-blue-500/10' : 'border-[#334155] bg-[#0F172A]/50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{tool.name}</div>
                        <div className="text-[10px] text-slate-400">{tool.desc}</div>
                      </div>
                      <div className={`h-4 w-4 rounded flex items-center justify-center border ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-[#475569]'}`}>
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#334155]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Authenticated Scan</h4>
                  <p className="text-xs text-slate-400">Provide login credentials to scan authenticated application areas.</p>
                </div>
                <input
                  type="checkbox"
                  checked={authenticated}
                  onChange={(e) => setAuthenticated(e.target.checked)}
                  className="rounded border-[#475569] bg-[#0F172A] text-blue-600 h-5 w-5"
                />
              </div>

              {authenticated && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Login URL</label>
                    <input
                      type="text"
                      value={loginUrl}
                      onChange={(e) => setLoginUrl(e.target.value)}
                      placeholder="https://app.example.com/login"
                      className="w-full rounded border border-[#475569] bg-[#1E293B] px-3 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="tester@example.com"
                      className="w-full rounded border border-[#475569] bg-[#1E293B] px-3 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded border border-[#475569] bg-[#1E293B] px-3 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Review Scan Configuration</h3>
            <div className="rounded-xl border border-[#334155] bg-[#0F172A] p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#334155]">
                <span className="text-sm text-slate-400">Target Asset</span>
                <span className="text-sm font-semibold text-white">{targetObj?.name || 'Selected Target'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#334155]">
                <span className="text-sm text-slate-400">Target URL</span>
                <span className="text-sm font-mono text-blue-400">{targetObj?.urls[0]}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#334155]">
                <span className="text-sm text-slate-400">Testing Profile</span>
                <span className="text-sm font-semibold text-white capitalize">{profile}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#334155]">
                <span className="text-sm text-slate-400">Enabled Security Tools</span>
                <div className="flex gap-1">
                  {tools.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/10 text-blue-400 uppercase">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Estimated Duration</span>
                <span className="text-sm font-semibold text-emerald-400">
                  {profile === 'quick' ? '5 minutes' : profile === 'standard' ? '15 minutes' : '45 minutes'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#334155]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 rounded-lg border border-[#475569] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-[#334155] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Launching...' : 'Launch Scan'}
              <Play className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
