import { MoreVertical, Download, Trash2, Edit } from 'lucide-react'
import { useState } from 'react'
import type { Palette } from '../types'

interface PaletteCardProps {
  palette: Palette
  onClick?: () => void
}

export default function PaletteCard({ palette, onClick }: PaletteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-surface-200 overflow-hidden
                 hover:shadow-lg hover:border-primary-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="h-24 flex">
        {palette.colors.map((c, i) => (
          <div
            key={i}
            className="h-full transition-all duration-300 group-hover:first:rounded-none"
            style={{
              backgroundColor: c.hex,
              flex: c.percentage || 1,
            }}
          />
        ))}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold text-surface-800 text-sm truncate">{palette.name}</h3>
            {palette.description && (
              <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">{palette.description}</p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
              className="p-1 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-xl border border-surface-200 py-1 z-10">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-surface-600 hover:bg-surface-50 transition-colors">
                  <Edit size={14} /> 编辑方案
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-surface-600 hover:bg-surface-50 transition-colors">
                  <Download size={14} /> 导出方案
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} /> 删除方案
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 mt-3 flex-wrap">
          {palette.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex -space-x-1">
            {palette.colors.slice(0, 6).map((c, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <span className="text-[10px] text-surface-400 ml-auto">
            {palette.colors.length} 色
          </span>
        </div>
      </div>
    </div>
  )
}
