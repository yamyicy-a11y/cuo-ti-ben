import { ClipboardList } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary text-primary">
        <ClipboardList className="size-9" aria-hidden="true" />
      </div>
      <p className="mt-5 text-base font-semibold text-card-foreground">还没有学习大纲</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-balance">
        完成试卷分析后自动生成
      </p>
    </div>
  )
}
