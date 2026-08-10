'use client'

import { ClipboardList } from 'lucide-react'

// 预留：后续对接真实数据。records 为空时展示空状态。
type AnalysisRecord = {
  id: string
  title: string
  summary: string
  date: string
}

export function RecentRecords({
  records = [],
}: {
  records?: AnalysisRecord[]
}) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">最近分析记录</h2>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="size-6" />
          </span>
          <p className="text-sm font-medium text-muted-foreground">暂无分析记录</p>
          <p className="text-xs text-muted-foreground">
            拍照上传错题后，分析结果会显示在这里
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {records.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-bold text-foreground">
                  {r.title}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {r.date}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
