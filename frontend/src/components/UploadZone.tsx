import { Upload, Image as ImageIcon, X } from 'lucide-react'
import { useState, useRef, type DragEvent } from 'react'

interface UploadZoneProps {
  label: string
  description: string
  accept?: string
  onFileSelect?: (file: File) => void
}

export default function UploadZone({
  label,
  description,
  accept = 'image/*',
  onFileSelect,
}: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    onFileSelect?.(file)
  }

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const clearFile = () => {
    setPreview(null)
    setFileName('')
    if (inputRef.current) inputRef.current.value = ''
  }

  if (preview) {
    return (
      <div className="relative rounded-2xl border-2 border-surface-200 overflow-hidden bg-surface-50">
        <img src={preview} alt="预览" className="w-full max-h-80 object-contain bg-[#f5f5f5]" />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={clearFile}
            className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-3 bg-white border-t border-surface-200">
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-surface-400" />
            <span className="text-xs text-surface-600 truncate">{fileName}</span>
            <button
              onClick={() => inputRef.current?.click()}
              className="ml-auto text-xs text-primary-500 hover:text-primary-600 font-medium"
            >
              更换图片
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      </div>
    )
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer
        transition-all duration-300 group
        ${dragActive
          ? 'border-primary-400 bg-primary-50/50 scale-[1.01]'
          : 'border-surface-300 bg-surface-50 hover:border-primary-300 hover:bg-primary-50/30'
        }
      `}
    >
      <div className={`
        w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors
        ${dragActive ? 'bg-primary-100 text-primary-500' : 'bg-surface-200 text-surface-400 group-hover:bg-primary-100 group-hover:text-primary-500'}
      `}>
        <Upload size={24} />
      </div>
      <p className="text-sm font-medium text-surface-700">{label}</p>
      <p className="text-xs text-surface-400 mt-1">{description}</p>
      <p className="text-[10px] text-surface-400 mt-3">
        支持 JPEG、PNG、BMP、WebP 格式，最大 20MB
      </p>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  )
}
