'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { getMistakesByUserId, type SavedMistake } from '@/lib/mistakes';
import { ChevronRight, BookX } from 'lucide-react';
import { toast } from 'sonner';

export default function MistakesListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mistakes, setMistakes] = useState<SavedMistake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getMistakesByUserId(user.phone);
        setMistakes(data);
      } catch {
        toast.error('加载错题失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return (
    <AppShell>
      <header className="px-5 pt-14 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">错题本</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? '加载中…' : `共 ${mistakes.length} 道错题`}
        </p>
      </header>

      <div className="px-5 pb-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : mistakes.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-[hsl(200,80%,92%)]">
              <BookX className="h-14 w-14 text-primary/60" />
            </div>
            <p className="text-base font-medium">错题本还是空的</p>
            <p className="mt-1 text-sm text-muted-foreground">
              去做一次试卷分析吧~
            </p>
            <Button className="mt-8" onClick={() => router.push('/upload')}>
              去上传试卷
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {mistakes.map((m) => (
              <Card
                key={m.id}
                className="cursor-pointer border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => router.push(`/mistake/${m.id}`)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {m.grammar && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          {m.grammar}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(m.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-snug line-clamp-2">
                      {m.question.slice(0, 60)}
                    </p>
                  </div>
                  <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
