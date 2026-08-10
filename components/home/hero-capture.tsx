'use client'

import { useRouter } from 'next/navigation'
import { Camera, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroCapture() {
  const router = useRouter()

  return (
    <section className="pt-2">
      <div className="mb-5">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <Sparkles className="size-3.5" />
          AI 英语学情分析
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-foreground text-balance">
          拍照识别错题
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
          AI 自动分析语法薄弱点，生成举一反三习题
        </p>
      </div>

      <button
        type="button"
        onClick={() => router.push('/upload')}
        aria-label="拍照上传错题"
        className="group flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-primary/40 bg-card px-6 py-10 text-center transition-colors hover:border-primary hover:bg-accent/50 active:scale-[0.99]"
      >
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
          <Camera className="size-8" strokeWidth={2} />
        </span>
        <span className="text-base font-bold text-foreground">
          点击拍照上传错题
        </span>
        <span className="text-xs text-muted-foreground">
          支持拍照或从相册选择图片
        </span>
      </button>

      <Button
        onClick={() => router.push('/upload')}
        size="lg"
        className="mt-4 h-12 w-full rounded-2xl text-base font-bold shadow-md shadow-primary/20"
      >
        <Camera className="size-5" />
        立即拍照
      </Button>
    </section>
  )
}
