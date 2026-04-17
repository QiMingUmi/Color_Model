import { Monitor, Moon, Sun, Globe, Database, HardDrive, Info } from 'lucide-react'
import Header from '../components/Header'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Header title="系统设置" subtitle="配置系统参数与偏好" />

      <div className="p-6 max-w-3xl mx-auto space-y-5">
        {/* Appearance */}
        <div className="bg-white rounded-2xl border border-surface-200 p-5">
          <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <Monitor size={16} /> 外观设置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-surface-600 mb-3 block">主题模式</label>
              <div className="flex gap-3">
                {[
                  { icon: Sun, label: '浅色', value: 'light' },
                  { icon: Moon, label: '深色', value: 'dark' },
                  { icon: Monitor, label: '跟随系统', value: 'system' },
                ].map(({ icon: Icon, label, value }) => (
                  <button
                    key={value}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-xs font-medium transition-all flex-1 justify-center ${
                      value === 'light'
                        ? 'border-primary-400 bg-primary-50 text-primary-600'
                        : 'border-surface-200 text-surface-600 hover:border-surface-300'
                    }`}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-surface-600 mb-3 block">
                <Globe size={12} className="inline mr-1" />
                界面语言
              </label>
              <select className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/40">
                <option>中文 (简体)</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Model Settings */}
        <div className="bg-white rounded-2xl border border-surface-200 p-5">
          <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <HardDrive size={16} /> 模型设置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-surface-600 mb-2 block">默认上色模型</label>
              <select className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/40">
                <option>Style2Paints V4</option>
                <option>PaintsChainer</option>
                <option>Anime Colorization (U-Net)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-surface-600 mb-2 block">推理设备</label>
              <select className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/40">
                <option>自动检测 (GPU 优先)</option>
                <option>仅 CPU</option>
                <option>CUDA GPU</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
              <div>
                <p className="text-xs font-medium text-surface-700">模型预加载</p>
                <p className="text-[10px] text-surface-400">启动时预加载模型以加快首次上色速度</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-primary-500 p-0.5 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-white shadow-sm translate-x-4 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="bg-white rounded-2xl border border-surface-200 p-5">
          <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <Database size={16} /> 存储设置
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
              <div>
                <p className="text-xs font-medium text-surface-700">自动保存上色历史</p>
                <p className="text-[10px] text-surface-400">自动记录每次上色的参数和结果</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-primary-500 p-0.5 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-white shadow-sm translate-x-4 transition-transform" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
              <div>
                <p className="text-xs font-medium text-surface-700">处理后清理原图</p>
                <p className="text-[10px] text-surface-400">色彩提取完成后自动删除上传的原始图片</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-surface-300 p-0.5 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium text-surface-600">存储空间使用</span>
                <span className="text-xs text-surface-400">128 MB / 2 GB</span>
              </div>
              <div className="h-2 rounded-full bg-surface-200 overflow-hidden">
                <div className="h-full w-[6%] rounded-full bg-gradient-to-r from-primary-400 to-primary-500" />
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-surface-200 p-5">
          <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <Info size={16} /> 关于
          </h3>
          <div className="space-y-2 text-xs text-surface-500">
            <p><span className="text-surface-700 font-medium">系统名称：</span>ColorMind — 智能色彩方案生成与推荐系统</p>
            <p><span className="text-surface-700 font-medium">版本：</span>v1.0.0</p>
            <p><span className="text-surface-700 font-medium">技术栈：</span>React + TypeScript + Tailwind CSS + Python + PyTorch</p>
          </div>
        </div>
      </div>
    </div>
  )
}
