import { Target } from 'lucide-react'
const knowledgePoints: any[] = []
import { KnowledgeCard } from '@/components/knowledge-card'
import { EmptyState } from '@/components/empty-state'

export default function Page() {
  const points = knowledgePoints
  const isEmpty = points.length === 0

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      {/* 顶部标题区 */}
      <header className="px-6 pb-4 pt-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">学习大纲</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
          基于你的错题诊断生成的个性化学习路径
        </p>
      </header>

      {/* 内容区 */}
      <main className="flex flex-1 flex-col">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3 px-4 pb-32">
            {points.map((point) => (
              <KnowledgeCard key={point.id} point={point} />
            ))}
          </div>
        )}
      </main>

      {/* 底部固定按钮 */}
      {!isEmpty && (
        <div className="fixed inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-md bg-gradient-to-t from-background via-background to-transparent px-6 pb-7 pt-6">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
            >
              <Target className="size-5" aria-hidden="true" />
              生成习题检测
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
