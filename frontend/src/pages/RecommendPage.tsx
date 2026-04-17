import { useState } from 'react'
import {
  Sparkles,
  BookOpen,
  Layers,
  TrendingUp,
  BarChart3,
  Save,
  PaintBucket,
  Info,
  ShieldCheck,
  Eye,
} from 'lucide-react'
import Header from '../components/Header'
import ColorWheel from '../components/ColorWheel'
import ColorSwatch from '../components/ColorSwatch'
import { generateScheme, createColorInfo, hexToRgb, rgbToHsl, SCENE_PALETTES } from '../utils/color'

const schemeTypes = [
  { id: 'complementary', name: '互补色', desc: '色轮上对立的两种颜色', angles: [0, 180] },
  { id: 'analogous', name: '类似色', desc: '色轮上相邻的颜色', angles: [330, 0, 30] },
  { id: 'triadic', name: '三色搭配', desc: '色轮上等距的三种颜色', angles: [0, 120, 240] },
  { id: 'split-complementary', name: '分裂互补', desc: '基色与互补色两侧的颜色', angles: [0, 150, 210] },
  { id: 'tetradic', name: '四色搭配', desc: '色轮上等距的四种颜色', angles: [0, 90, 180, 270] },
  { id: 'square', name: '正方搭配', desc: '色轮上构成正方形的四种颜色', angles: [0, 90, 180, 270] },
]

const sceneCategories = [
  {
    name: '情感', items: [
      { name: '温暖', key: 'warm' },
      { name: '冷静', key: 'cool' },
      { name: '活力', key: 'vibrant' },
      { name: '优雅', key: 'elegant' },
    ]
  },
  {
    name: '风格', items: [
      { name: '自然', key: 'nature' },
      { name: '复古', key: 'retro' },
      { name: '赛博朋克', key: 'cyberpunk' },
      { name: '日系', key: 'japanese' },
      { name: '北欧', key: 'nordic' },
      { name: '科技', key: 'tech' },
    ]
  },
]

const trendColors = [
  { year: '2026', name: 'Mocha Mousse', hex: '#A47764', desc: '温润柔和的摩卡色' },
  { year: '2025', name: 'Peach Fuzz', hex: '#FFBE98', desc: '温暖包容的蜜桃色' },
  { year: '2024', name: 'Viva Magenta', hex: '#BB2649', desc: '大胆活力的洋红色' },
  { year: '2023', name: 'Very Peri', hex: '#6667AB', desc: '灵动创意的长春花蓝' },
]

type Tab = 'theory' | 'scene' | 'trend' | 'analyze'

export default function RecommendPage() {
  const [activeTab, setActiveTab] = useState<Tab>('theory')
  const [baseColor, setBaseColor] = useState('#3366ff')
  const [selectedScheme, setSelectedScheme] = useState('complementary')
  const [selectedScene, setSelectedScene] = useState<string | null>('warm')
  const [analyzeColors, setAnalyzeColors] = useState(['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'])

  const schemeColors = generateScheme(baseColor, selectedScheme)
  const currentSchemeType = schemeTypes.find(s => s.id === selectedScheme)!
  const baseHsl = rgbToHsl(...Object.values(hexToRgb(baseColor)) as [number, number, number])
  const wheelAngles = currentSchemeType.angles.map(a => (a + baseHsl.h) % 360)

  const tabs: { id: Tab; icon: typeof BookOpen; label: string }[] = [
    { id: 'theory', icon: BookOpen, label: '色彩理论' },
    { id: 'scene', icon: Layers, label: '场景推荐' },
    { id: 'trend', icon: TrendingUp, label: '流行趋势' },
    { id: 'analyze', icon: BarChart3, label: '色彩分析' },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <Header title="色彩推荐" subtitle="基于色彩理论与应用场景的专业配色推荐" />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 bg-white rounded-2xl border border-surface-200 p-1.5 mb-6 w-fit">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                  : 'text-surface-600 hover:bg-surface-50'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Theory Tab */}
        {activeTab === 'theory' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-4">选择基准色</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={e => setBaseColor(e.target.value)}
                    className="w-16 h-16 rounded-xl cursor-pointer border-2 border-surface-200"
                  />
                  <div>
                    <p className="text-sm font-mono font-semibold text-surface-800 uppercase">{baseColor}</p>
                    <p className="text-xs text-surface-400 mt-0.5">点击色块选取基准色</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-4">配色规则</h3>
                <div className="space-y-2">
                  {schemeTypes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScheme(s.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        selectedScheme === s.id
                          ? 'bg-amber-50 border-2 border-amber-400'
                          : 'border-2 border-surface-100 hover:border-surface-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-surface-700">{s.name}</span>
                        <span className="text-[10px] text-surface-400">{s.angles.length} 色</span>
                      </div>
                      <p className="text-[10px] text-surface-400 mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-5">
              <div className="bg-white rounded-2xl border border-surface-200 p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ColorWheel baseColor={baseColor} highlightAngles={wheelAngles} size={220} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-surface-800 mb-1">{currentSchemeType.name}</h3>
                    <p className="text-xs text-surface-500 mb-4">{currentSchemeType.desc}</p>
                    <div className="flex gap-3 flex-wrap">
                      {schemeColors.map((hex, i) => (
                        <ColorSwatch key={i} color={createColorInfo(hex)} size="md" />
                      ))}
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium
                                         text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-sm">
                        <Save size={14} /> 保存方案
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium
                                         text-surface-600 bg-surface-100 hover:bg-surface-200 transition-colors">
                        <PaintBucket size={14} /> 用于上色
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-3 flex items-center gap-2">
                  <Info size={14} /> 方案说明
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-50">
                    <p className="text-[10px] font-medium text-surface-600 mb-1">适用场景</p>
                    <p className="text-xs text-surface-500">
                      {selectedScheme === 'complementary' && '需要强烈视觉对比的设计，如按钮/CTA、运动品牌'}
                      {selectedScheme === 'analogous' && '希望营造和谐统一感的设计，如自然风景、舒适空间'}
                      {selectedScheme === 'triadic' && '需要丰富色彩但保持平衡的设计，如儿童产品、节日海报'}
                      {selectedScheme === 'split-complementary' && '想要对比但不那么强烈的设计，适合初学者使用'}
                      {selectedScheme === 'tetradic' && '需要多色彩的复杂设计，如信息图表、仪表盘'}
                      {selectedScheme === 'square' && '需要均衡多色的设计，如品牌色彩系统'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-50">
                    <p className="text-[10px] font-medium text-surface-600 mb-1">视觉效果</p>
                    <p className="text-xs text-surface-500">
                      {selectedScheme === 'complementary' && '高对比度、醒目、充满活力'}
                      {selectedScheme === 'analogous' && '柔和、自然、协调统一'}
                      {selectedScheme === 'triadic' && '色彩丰富、生动活泼、平衡'}
                      {selectedScheme === 'split-complementary' && '中等对比、灵活多变'}
                      {selectedScheme === 'tetradic' && '丰富多彩、复杂但有序'}
                      {selectedScheme === 'square' && '均衡、稳定、多样化'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Banner */}
              <div className="rounded-2xl overflow-hidden" style={{
                background: `linear-gradient(135deg, ${schemeColors.join(', ')})`,
              }}>
                <div className="p-8 backdrop-blur-sm bg-black/10 text-center">
                  <p className="text-white text-sm font-medium">配色方案预览效果</p>
                  <p className="text-white/60 text-xs mt-1">直观感受推荐色彩的搭配效果</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scene Tab */}
        {activeTab === 'scene' && (
          <div className="space-y-6">
            {sceneCategories.map((cat) => (
              <div key={cat.name}>
                <h3 className="text-sm font-semibold text-surface-800 mb-3">按{cat.name}推荐</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {cat.items.map((item) => {
                    const colors = SCENE_PALETTES[item.key as keyof typeof SCENE_PALETTES] || []
                    return (
                      <button
                        key={item.key}
                        onClick={() => setSelectedScene(item.key)}
                        className={`rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-lg ${
                          selectedScene === item.key
                            ? 'border-amber-400 shadow-md'
                            : 'border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <div className="h-16 flex">
                          {colors.map((c, i) => (
                            <div key={i} className="h-full flex-1" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <div className="p-3 bg-white">
                          <span className="text-xs font-medium text-surface-700">{item.name}</span>
                          <p className="text-[10px] text-surface-400 mt-0.5">{colors.length} 色方案</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {selectedScene && SCENE_PALETTES[selectedScene as keyof typeof SCENE_PALETTES] && (
              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-surface-800">
                    当前选择：{sceneCategories.flatMap(c => c.items).find(i => i.key === selectedScene)?.name}
                  </h3>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors">
                      <Save size={14} /> 保存
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-surface-600 bg-surface-100 hover:bg-surface-200 transition-colors">
                      <PaintBucket size={14} /> 用于上色
                    </button>
                  </div>
                </div>
                <div className="h-20 flex rounded-xl overflow-hidden mb-4">
                  {SCENE_PALETTES[selectedScene as keyof typeof SCENE_PALETTES].map((c, i) => (
                    <div key={i} className="h-full flex-1 relative group" style={{ backgroundColor: c }}>
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-mono bg-black/20">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  {SCENE_PALETTES[selectedScene as keyof typeof SCENE_PALETTES].map((c, i) => (
                    <ColorSwatch key={i} color={createColorInfo(c)} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trend Tab */}
        {activeTab === 'trend' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trendColors.map((t) => (
              <div key={t.year} className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-36 flex items-center justify-center relative" style={{ backgroundColor: t.hex }}>
                  <div className="text-center">
                    <p className="text-white/80 text-xs font-medium mb-1">{t.year} 年度流行色</p>
                    <p className="text-white text-xl font-bold">{t.name}</p>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/20 backdrop-blur-sm">
                    <span className="text-white text-[10px] font-mono">{t.hex}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-surface-500">{t.desc}</p>
                  <div className="mt-3 flex gap-2">
                    {generateScheme(t.hex, 'analogous').map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: c }} />
                    ))}
                    <div className="flex-1" />
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors">
                      <Save size={12} /> 保存
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-4">输入色彩方案</h3>
                <div className="space-y-3">
                  {analyzeColors.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={c}
                        onChange={e => {
                          const newColors = [...analyzeColors]
                          newColors[i] = e.target.value
                          setAnalyzeColors(newColors)
                        }}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-surface-200"
                      />
                      <span className="text-xs font-mono text-surface-600 flex-1 uppercase">{c}</span>
                      {analyzeColors.length > 2 && (
                        <button
                          onClick={() => setAnalyzeColors(analyzeColors.filter((_, j) => j !== i))}
                          className="text-surface-400 hover:text-red-500 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {analyzeColors.length < 10 && (
                    <button
                      onClick={() => setAnalyzeColors([...analyzeColors, '#888888'])}
                      className="w-full py-2 rounded-xl border-2 border-dashed border-surface-200 text-xs text-surface-400 hover:border-surface-300 hover:text-surface-500 transition-colors"
                    >
                      + 添加颜色
                    </button>
                  )}
                </div>
                <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20 cursor-pointer">
                  开始分析
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-5">
              {/* Harmony Score */}
              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
                  <Sparkles size={14} /> 和谐度评分
                </h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${8.2 * 2 * Math.PI * 40 / 10} ${2 * Math.PI * 40}`}
                      />
                      <defs>
                        <linearGradient id="scoreGrad"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-surface-800">8.2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-600">和谐度优秀</p>
                    <p className="text-xs text-surface-500 mt-1">此色彩方案整体搭配协调，颜色之间过渡自然</p>
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-surface-200 p-4">
                  <p className="text-[10px] font-medium text-surface-500 mb-2">色调倾向</p>
                  <p className="text-sm font-semibold text-surface-800">暖色调为主</p>
                  <div className="mt-2 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-orange-400 h-full" style={{ width: '65%' }} />
                    <div className="bg-blue-400 h-full" style={{ width: '20%' }} />
                    <div className="bg-gray-300 h-full" style={{ width: '15%' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-surface-400">暖色 65%</span>
                    <span className="text-[9px] text-surface-400">冷色 20%</span>
                    <span className="text-[9px] text-surface-400">中性 15%</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-surface-200 p-4">
                  <p className="text-[10px] font-medium text-surface-500 mb-2">饱和度分布</p>
                  <p className="text-sm font-semibold text-surface-800">中高饱和度</p>
                  <div className="flex items-end gap-1.5 mt-2 h-10">
                    {[30, 65, 85, 70, 90].map((v, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${v}%`, backgroundColor: analyzeColors[i] || '#ddd' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* WCAG & Accessibility */}
              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
                  <ShieldCheck size={14} /> 可访问性检测 (WCAG)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-medium text-emerald-700">AA 通过</span>
                    </div>
                    <p className="text-xs text-emerald-600">主色与背景对比度 4.8:1</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-medium text-amber-700">AAA 待优化</span>
                    </div>
                    <p className="text-xs text-amber-600">建议提高辅色明度差异</p>
                  </div>
                </div>
              </div>

              {/* Color Blind Simulation */}
              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
                  <Eye size={14} /> 色觉模拟预览
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {['正常视觉', '红色盲', '绿色盲'].map((label) => (
                    <div key={label}>
                      <p className="text-[10px] text-surface-500 mb-2 text-center">{label}</p>
                      <div className="h-8 flex rounded-lg overflow-hidden">
                        {analyzeColors.map((c, i) => (
                          <div key={i} className="h-full flex-1" style={{
                            backgroundColor: c,
                            filter: label === '红色盲' ? 'grayscale(30%) sepia(30%)' : label === '绿色盲' ? 'grayscale(20%) hue-rotate(30deg)' : 'none'
                          }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
