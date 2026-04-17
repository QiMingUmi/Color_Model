import { useState } from 'react'
import {
  Search,
  Filter,
  Plus,
  Grid3X3,
  List,
  Download,
  Upload,
  SortAsc,
  Tag,
} from 'lucide-react'
import Header from '../components/Header'
import PaletteCard from '../components/PaletteCard'
import { DEMO_PALETTES, createColorInfo } from '../utils/color'
import type { Palette } from '../types'

const demoData: Palette[] = [
  {
    id: '1', name: '海洋落日', description: '温暖与冷色调的完美平衡', tags: ['自然', '温暖', '风景'],
    colors: DEMO_PALETTES[0], createdAt: '2026-04-15', updatedAt: '2026-04-15',
  },
  {
    id: '2', name: '森林大地', description: '自然沉稳的大地色系', tags: ['自然', '复古', '大地色'],
    colors: DEMO_PALETTES[1], createdAt: '2026-04-14', updatedAt: '2026-04-14',
  },
  {
    id: '3', name: '热带激情', description: '充满活力的热烈配色', tags: ['活力', '热烈', '夏天'],
    colors: DEMO_PALETTES[2], createdAt: '2026-04-13', updatedAt: '2026-04-13',
  },
  {
    id: '4', name: '极简北欧', description: '清新简约的北欧风格', tags: ['简约', '北欧', '冷色'],
    colors: [
      createColorInfo('#ECEBE4', 30), createColorInfo('#D3CEC4', 25),
      createColorInfo('#9F978E', 20), createColorInfo('#6B6560', 15), createColorInfo('#3D3835', 10),
    ],
    createdAt: '2026-04-12', updatedAt: '2026-04-12',
  },
  {
    id: '5', name: '赛博霓虹', description: '未来科技感的霓虹配色', tags: ['科技', '赛博朋克', '霓虹'],
    colors: [
      createColorInfo('#0D0221', 25), createColorInfo('#0F084B', 20),
      createColorInfo('#26408B', 20), createColorInfo('#A6CFD5', 20), createColorInfo('#C2E7D9', 15),
    ],
    createdAt: '2026-04-11', updatedAt: '2026-04-11',
  },
  {
    id: '6', name: '樱花物语', description: '柔美淡雅的日式配色', tags: ['日系', '柔和', '春天'],
    colors: [
      createColorInfo('#F7CAC9', 25), createColorInfo('#92A8D1', 20),
      createColorInfo('#955251', 20), createColorInfo('#B565A7', 20), createColorInfo('#009B77', 15),
    ],
    createdAt: '2026-04-10', updatedAt: '2026-04-10',
  },
]

export default function PalettesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = [...new Set(demoData.flatMap(p => p.tags))]

  const filtered = demoData.filter(p => {
    const matchSearch = !searchQuery ||
      p.name.includes(searchQuery) ||
      p.description.includes(searchQuery) ||
      p.tags.some(t => t.includes(searchQuery))
    const matchTag = !selectedTag || p.tags.includes(selectedTag)
    return matchSearch && matchTag
  })

  return (
    <div className="min-h-screen bg-surface-50">
      <Header title="方案管理" subtitle="管理您保存的所有色彩方案" />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="搜索方案名称、标签..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-surface-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-white rounded-xl border border-surface-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-surface-400 hover:bg-surface-50'
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-surface-400 hover:bg-surface-50'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium
                               text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors">
              <SortAsc size={14} /> 排序
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium
                               text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors">
              <Upload size={14} /> 导入
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium
                               text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors">
              <Download size={14} /> 批量导出
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium
                               text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm">
              <Plus size={14} /> 新建方案
            </button>
          </div>
        </div>

        {/* Tags Filter */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <Filter size={14} className="text-surface-400" />
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedTag
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'
            }`}
          >
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                selectedTag === tag
                  ? 'bg-primary-500 text-white'
                  : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'
              }`}
            >
              <Tag size={10} /> {tag}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-surface-500">
            共 <span className="font-semibold text-surface-700">{filtered.length}</span> 个色彩方案
          </p>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(palette => (
              <PaletteCard key={palette.id} palette={palette} />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filtered.map(palette => (
              <div
                key={palette.id}
                className="bg-white rounded-xl border border-surface-200 p-4 flex items-center gap-4
                           hover:shadow-md hover:border-primary-300 transition-all cursor-pointer"
              >
                <div className="w-32 h-12 rounded-lg overflow-hidden flex shrink-0">
                  {palette.colors.map((c, i) => (
                    <div key={i} className="h-full" style={{ backgroundColor: c.hex, flex: c.percentage || 1 }} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-surface-800">{palette.name}</h4>
                  <p className="text-xs text-surface-500 truncate">{palette.description}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {palette.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {palette.colors.slice(0, 5).map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
                <span className="text-[10px] text-surface-400 shrink-0">{palette.createdAt}</span>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
              <Search size={28} className="text-surface-300" />
            </div>
            <p className="text-sm text-surface-500">没有找到匹配的色彩方案</p>
            <p className="text-xs text-surface-400 mt-1">尝试修改搜索条件或清除筛选</p>
          </div>
        )}
      </div>
    </div>
  )
}
