import { useNavigate } from 'react-router-dom'
import { Pipette, PaintBucket, Sparkles, FolderOpen, ArrowRight, Palette, Zap, Eye } from 'lucide-react'
import Header from '../components/Header'
import { DEMO_PALETTES } from '../utils/color'

const features = [
  {
    icon: Pipette,
    title: '色彩提取',
    desc: '从任意图片中智能提取主要构成色彩，生成专业调色板',
    path: '/extract',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
  },
  {
    icon: PaintBucket,
    title: '线稿上色',
    desc: '基于深度学习模型自动上色，或导入色彩方案引导上色',
    path: '/colorize',
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
  },
  {
    icon: Sparkles,
    title: '色彩推荐',
    desc: '基于色彩理论和应用场景，为您推荐专业配色方案',
    path: '/recommend',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
  },
  {
    icon: FolderOpen,
    title: '方案管理',
    desc: '管理您保存的所有色彩方案，支持搜索、编辑与导出',
    path: '/palettes',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
  },
]

const stats = [
  { icon: Palette, value: '12', label: '已保存方案', color: 'text-primary-500' },
  { icon: Zap, value: '8', label: '上色任务', color: 'text-accent-500' },
  { icon: Eye, value: '156', label: '色彩分析', color: 'text-emerald-500' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-50">
      <Header title="首页概览" subtitle="智能色彩方案生成与推荐系统" />

      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 p-8 md:p-12 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-400 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Palette size={20} />
              </div>
              <span className="text-sm font-medium text-white/70">ColorMind AI</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              智能色彩方案<br />
              <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
                生成与推荐系统
              </span>
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed max-w-lg">
              利用计算机视觉与深度学习技术，从参考图片中提取色彩、为线稿智能上色、
              获取专业配色推荐——让色彩创作更高效、更专业。
            </p>
            <button
              onClick={() => navigate('/extract')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl
                         bg-white text-surface-900 font-semibold text-sm
                         hover:bg-white/90 transition-all hover:gap-3"
            >
              开始使用 <ArrowRight size={16} />
            </button>
          </div>

          {/* Decorative palette preview */}
          <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 gap-3">
            {DEMO_PALETTES[0].map((c, i) => (
              <div
                key={i}
                className="rounded-2xl shadow-2xl"
                style={{
                  backgroundColor: c.hex,
                  width: 48,
                  height: 80 + i * 20,
                  opacity: 0.9,
                  transform: `rotate(${(i - 2) * 5}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-surface-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-surface-50 flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-800">{value}</p>
                <p className="text-xs text-surface-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div>
          <h3 className="text-lg font-semibold text-surface-800 mb-4">核心功能</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc, path, gradient, bg }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`${bg} rounded-2xl p-6 text-left group hover:shadow-lg
                           transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-surface-200`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient}
                                flex items-center justify-center text-white mb-4 shadow-lg
                                group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <h4 className="font-semibold text-surface-800 text-sm">{title}</h4>
                <p className="text-xs text-surface-500 mt-1.5 leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary-500 group-hover:gap-2 transition-all">
                  进入模块 <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Palettes */}
        <div>
          <h3 className="text-lg font-semibold text-surface-800 mb-4">示例调色板</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_PALETTES.map((palette, pi) => (
              <div
                key={pi}
                className="bg-white rounded-2xl border border-surface-200 overflow-hidden
                           hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="h-20 flex">
                  {palette.map((c, ci) => (
                    <div
                      key={ci}
                      className="h-full"
                      style={{ backgroundColor: c.hex, flex: c.percentage }}
                    />
                  ))}
                </div>
                <div className="p-4">
                  <div className="flex gap-2">
                    {palette.map((c, ci) => (
                      <div key={ci} className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: c.hex }} />
                        <span className="text-[10px] font-mono text-surface-500">{c.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
