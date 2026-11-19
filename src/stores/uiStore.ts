import { create } from 'zustand'

export interface UIState {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  activeScanId: string | null
  setActiveScanId: (id: string | null) => void
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
  activeScanId: null,
  setActiveScanId: (id: string | null) => set({ activeScanId: id }),
  activeFilter: 'all',
  setActiveFilter: (filter: string) => set({ activeFilter: filter }),
}))
