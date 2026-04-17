import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { getContrastColor } from '../utils/color'
import type { ColorInfo } from '../types'

interface ColorSwatchProps {
  color: ColorInfo
  size?: 'sm' | 'md' | 'lg'
  showInfo?: boolean
  showPercentage?: boolean
  onClick?: () => void
}

export default function ColorSwatch({
  color,
  size = 'md',
  showInfo = true,
  showPercentage = false,
  onClick,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)

  const sizeClasses = {
    sm: 'h-10 w-10 rounded-lg text-[10px]',
    md: 'h-16 w-16 rounded-xl text-xs',
    lg: 'h-24 w-full rounded-xl text-sm',
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(color.hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const textColor = getContrastColor(color.hex)

  return (
    <div className="flex flex-col items-center gap-1.5 group" onClick={onClick}>
      <div
        className={`${sizeClasses[size]} flex items-center justify-center cursor-pointer
                    transition-all duration-200 hover:scale-105 hover:shadow-lg relative`}
        style={{ backgroundColor: color.hex }}
      >
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
          style={{ color: textColor }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        {showPercentage && color.percentage > 0 && (
          <span
            className="absolute bottom-1 right-1 text-[10px] font-medium px-1 rounded"
            style={{ color: textColor, backgroundColor: 'rgba(0,0,0,0.15)' }}
          >
            {color.percentage}%
          </span>
        )}
      </div>
      {showInfo && (
        <div className="text-center">
          <p className="text-xs font-mono font-medium text-surface-700 uppercase">{color.hex}</p>
          {size === 'lg' && (
            <p className="text-[10px] text-surface-500 mt-0.5">
              RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
            </p>
          )}
        </div>
      )}
    </div>
  )
}
