'use client'

import React from 'react'
import { Search, Bell, Shield, User as UserIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function Topbar() {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#334155] bg-[#0F172A]/90 px-6 backdrop-blur-md">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search targets, scans, or CVE vulnerabilities..."
            className="w-full rounded-lg border border-[#334155] bg-[#1E293B] pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* System Status badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Engine Operational
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-300 hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        {/* User Profile dropdown */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#334155]">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-medium text-slate-200">{user?.name || 'Admin User'}</span>
            <span className="text-xs text-slate-400 capitalize">{user?.role || 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
