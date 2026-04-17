import { useState } from 'react'
import {
  Wand2,
  Palette,
  Download,
  RotateCcw,
  SlidersHorizontal,
  Loader2,
  ArrowLeftRight,
  ImagePlus,
  Check,
} from 'lucide-react'
import Header from '../components/Header'
import UploadZone from '../components/UploadZone'
import { DEMO_PALETTES } from '../utils/color'

const styles = [
  { id: 'anime', name: '动漫风格', desc: '适合漫画、插画线稿' },
  { id: 'realistic', name: '写实风格', desc: '适合素描、写实画稿' },
  { id: 'watercolor', name: '水彩风格', desc: '模拟水彩画效果' },
  { id: 'flat', name: '扁平风格', desc: '简洁明快的色块填充' },
]

const savedPalettes = [
  { id: '1', name: '海洋落日', colors: DEMO_PALETTES[0] },
  { id: '2', name: '森林大地', colors: DEMO_PALETTES[1] },
  { id: '3', name: '热带激情', colors: DEMO_PALETTES[2] },
]

export default function ColorizePage() {
  const [mode, setMode] = useState<'auto' | 'guided'>('auto')
  const [selectedStyle, setSelectedStyle] = useState('anime')
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [saturation, setSaturation] = useState(100)
  const [brightness, setBrightness] = useState(100)

  const handleColorize = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowResult(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <Header title="线稿上色" subtitle="智能模型自动上色 / 导入色彩方案引导上色" />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-surface-200 p-1.5 w-fit mb-6">
          <button
            onClick={() => { setMode('auto'); setShowResult(false) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'auto'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'text-surface-600 hover:bg-surface-50'
            }`}
          >
            <Wand2 size={16} /> 自动上色
          </button>
          <button
            onClick={() => { setMode('guided'); setShowResult(false) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'guided'
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/20'
                : 'text-surface-600 hover:bg-surface-50'
            }`}
          >
            <Palette size={16} /> 引导上色
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Upload Line Art */}
            <div className="bg-white rounded-2xl border border-surface-200 p-5">
              <h3 className="text-sm font-semibold text-surface-800 mb-4">上传线稿</h3>
              <UploadZone
                label="拖拽或点击上传线稿"
                description="支持黑白线稿和灰度线稿"
                onFileSelect={() => {}}
              />
            </div>

            {/* Style Selection (Auto Mode) */}
            {mode === 'auto' && (
              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-4">上色风格</h3>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedStyle === s.id
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-surface-700">{s.name}</span>
                        {selectedStyle === s.id && (
                          <Check size={14} className="text-primary-500" />
                        )}
                      </div>
                      <p className="text-[10px] text-surface-400 mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Palette Selection (Guided Mode) */}
            {mode === 'guided' && (
              <div className="bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold text-surface-800 mb-4">选择色彩方案</h3>
                <div className="space-y-3">
                  {savedPalettes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPalette(p.id)}
                      className={`w-full rounded-xl border-2 overflow-hidden text-left transition-all ${
                        selectedPalette === p.id
                          ? 'border-accent-400 shadow-md'
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <div className="h-8 flex">
                        {p.colors.map((c, i) => (
                          <div key={i} style={{ backgroundColor: c.hex, flex: c.percentage }} />
                        ))}
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-surface-700">{p.name}</span>
                        {selectedPalette === p.id && (
                          <Check size={14} className="text-accent-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-surface-100">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                                     border-2 border-dashed border-surface-300 text-xs text-surface-500
                                     hover:border-accent-400 hover:text-accent-500 transition-colors">
                    <ImagePlus size={14} /> 上传参考图片实时提取
                  </button>
                </div>
              </div>
            )}

            {/* Post-processing */}
            <div className="bg-white rounded-2xl border border-surface-200 p-5">
              <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} /> 后处理参数
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-surface-600">饱和度</label>
                    <span className="text-xs text-surface-400">{saturation}%</span>
                  </div>
                  <input type="range" min={0} max={200} value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-primary-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-surface-600">亮度</label>
                    <span className="text-xs text-surface-400">{brightness}%</span>
                  </div>
                  <input type="range" min={0} max={200} value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-primary-500" />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleColorize}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all
                         shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed
                         ${mode === 'auto'
                           ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700'
                           : 'bg-gradient-to-r from-accent-500 to-accent-600 shadow-accent-500/20 hover:from-accent-600 hover:to-accent-700'
                         }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> 上色处理中...
                </span>
              ) : (
                mode === 'auto' ? '开始自动上色' : '开始引导上色'
              )}
            </button>
          </div>

          {/* Right: Result Area */}
          <div className="lg:col-span-3 space-y-5">
            {!showResult ? (
              <div className="bg-white rounded-2xl border border-surface-200 p-16 text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-surface-100 flex items-center justify-center mb-5">
                  {mode === 'auto' ? (
                    <Wand2 size={40} className="text-surface-300" />
                  ) : (
                    <Palette size={40} className="text-surface-300" />
                  )}
                </div>
                <p className="text-sm font-medium text-surface-500">
                  {mode === 'auto' ? '上传线稿后点击"开始自动上色"' : '上传线稿并选择色彩方案后开始上色'}
                </p>
                <p className="text-xs text-surface-400 mt-1.5 max-w-xs mx-auto">
                  {mode === 'auto'
                    ? '模型将根据学习到的色彩规律自动为线稿分配合适的颜色'
                    : '使用您选择的色彩方案作为引导，模型将按照指定色彩风格上色'
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Result Toolbar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      mode === 'auto'
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-accent-50 text-accent-600'
                    }`}>
                      {mode === 'auto' ? '自动上色' : '引导上色'}
                    </span>
                    {mode === 'guided' && selectedPalette && (
                      <span className="text-xs text-surface-400">
                        使用方案：{savedPalettes.find(p => p.id === selectedPalette)?.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCompareMode(!compareMode)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        compareMode
                          ? 'bg-primary-50 text-primary-600 border border-primary-200'
                          : 'text-surface-600 bg-white border border-surface-200 hover:bg-surface-50'
                      }`}
                    >
                      <ArrowLeftRight size={14} /> 对比视图
                    </button>
                    <button
                      onClick={handleColorize}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
                                 text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors"
                    >
                      <RotateCcw size={14} /> 重新生成
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
                                       text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm">
                      <Download size={14} /> 下载结果
                    </button>
                  </div>
                </div>

                {/* Result Display */}
                <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
                  {compareMode ? (
                    <div className="grid grid-cols-2 divide-x divide-surface-200">
                      <div className="p-4">
                        <p className="text-xs font-medium text-surface-500 mb-3 text-center">原始线稿</p>
                        <div className="aspect-square bg-surface-100 rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-32 h-32 mx-auto bg-surface-200 rounded-xl mb-2" />
                            <span className="text-[10px] text-surface-400">线稿预览</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-medium text-surface-500 mb-3 text-center">上色结果</p>
                        <div className="aspect-square rounded-xl overflow-hidden flex items-center justify-center"
                             style={{
                               background: `linear-gradient(135deg, ${
                                 mode === 'guided' && selectedPalette
                                   ? savedPalettes.find(p => p.id === selectedPalette)!.colors.map(c => c.hex).join(', ')
                                   : '#e8d5b7, #b8c9a3, #f0e0c8, #d4b896'
                               })`,
                             }}>
                          <div className="text-center">
                            <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur rounded-xl mb-2" />
                            <span className="text-[10px] text-white/70">上色结果预览</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="aspect-video rounded-xl overflow-hidden flex items-center justify-center"
                           style={{
                             background: `linear-gradient(135deg, ${
                               mode === 'guided' && selectedPalette
                                 ? savedPalettes.find(p => p.id === selectedPalette)!.colors.map(c => c.hex).join(', ')
                                 : '#e8d5b7, #b8c9a3, #f0e0c8, #d4b896, #c5a882'
                             })`,
                           }}>
                        <div className="text-center p-8">
                          <div className="w-48 h-48 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl mb-4 flex items-center justify-center">
                            <Wand2 size={48} className="text-white/50" />
                          </div>
                          <p className="text-white/80 text-sm font-medium">上色结果预览区域</p>
                          <p className="text-white/50 text-xs mt-1">实际使用时将展示上色后的图片</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Used Palette Display (Guided Mode) */}
                {mode === 'guided' && selectedPalette && (
                  <div className="bg-white rounded-2xl border border-surface-200 p-5">
                    <h3 className="text-sm font-semibold text-surface-800 mb-3">使用的色彩方案</h3>
                    <div className="h-10 flex rounded-xl overflow-hidden">
                      {savedPalettes.find(p => p.id === selectedPalette)!.colors.map((c, i) => (
                        <div
                          key={i}
                          className="h-full relative group"
                          style={{ backgroundColor: c.hex, flex: c.percentage }}
                        >
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-mono bg-black/20">
                            {c.hex}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
