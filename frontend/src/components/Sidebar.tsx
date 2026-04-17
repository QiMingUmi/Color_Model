import { NavLink } from 'react-router-dom'
import {
  Home,
  Pipette,
  PaintBucket,
  Palette,
  Sparkles,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: Home, label: '首页概览' },
  { to: '/extract', icon: Pipette, label: '色彩提取' },
  { to: '/colorize', icon: PaintBucket, label: '线稿上色' },
  { to: '/recommend', icon: Sparkles, label: '色彩推荐' },
  { to: '/palettes', icon: FolderOpen, label: '方案管理' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-40 flex flex-col
        bg-surface-950 text-white transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
      `}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shrink-0">
          <Palette size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight whitespace-nowrap">
            ColorMind
          </span>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               transition-all duration-200 group
               ${isActive
                 ? 'bg-primary-600/20 text-primary-300'
                 : 'text-surface-400 hover:bg-white/5 hover:text-surface-200'
               }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1 shrink-0">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                     text-surface-400 hover:bg-white/5 hover:text-surface-200 transition-all"
        >
          <Settings size={20} className="shrink-0" />
          {!collapsed && <span>系统设置</span>}
        </NavLink>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-800 border border-surface-600
                   flex items-center justify-center text-surface-400 hover:text-white
                   hover:bg-surface-700 transition-all cursor-pointer"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}
