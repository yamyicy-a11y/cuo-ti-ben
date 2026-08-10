'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen } from 'lucide-react';
import {
  getMistakeById,
  updateMistakeAnalysisCache,
  type SavedMistake,
} from '@/lib/mistakes';
import { analyzeMistake, type AnalysisResult } from '@/lib/analysis';

export default function MistakeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const [mistake, setMistake] = useState<SavedMistake | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMistakeById(id);
        setMistake(data);
        if (data?.analysis_cache) {
          setAnalysis(data.analysis_cache as AnalysisResult);
        } else if (data) {
          setAnalyzing(true);
          try {
            const result = await analyzeMistake(
              data.question,
              data.user_answer || '',
              data.correct_answer || '',
              data.grammar || ''
            );
            setAnalysis(result);
            await updateMistakeAnalysisCache(id, result);
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setAnalysisError(msg);
          } finally {
            setAnalyzing(false);
          }
        }
      } catch {
        toast.error('加载错题失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (!mistake) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
          <p className="text-base font-medium">未找到该错题</p>
          <Button className="mt-4" variant="outline" onClick={() => router.push('/mistakes-list')}>
            返回错题本
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="flex items-center gap-3 px-5 pt-14 pb-2">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">错题详情</h1>
          <p className="text-sm text-muted-foreground">{formatDate(mistake.created_at)}</p>
        </div>
      </header>

      <div className="px-5 pb-6">
        <Card className="mb-4 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">题目</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{mistake.question}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-xs text-muted-foreground">你的答案</p>
                <p className="mt-1 text-lg font-semibold text-destructive">
                  {mistake.user_answer || '—'}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-3">
                <p className="text-xs text-muted-foreground">正确答案</p>
                <p className="mt-1 text-lg font-semibold text-emerald-600">
                  {mistake.correct_answer || '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {mistake.grammar && (
          <Card className="mb-4 border-border/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">{mistake.grammar}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        )}

        {analyzing && (
          <Card className="mb-4 border-primary/30 bg-primary/5">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm font-medium text-primary">
                🤖 AI 分析中...
              </p>
            </CardContent>
          </Card>
        )}

        {analysisError && !analyzing && !analysis && (
          <Card className="mb-4 border-destructive/40 bg-destructive/5">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-destructive">
                {analysisError}
              </p>
            </CardContent>
          </Card>
        )}

        {analysis && !analyzing && (
          <>
            <Card className="mb-4 border-border/60">
              <CardHeader>
                <CardTitle className="text-base">📘 语法讲解</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">语法点：</span>
                  <span>{analysis.grammar.point}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">定义：</span>
                  <span>{analysis.grammar.definition}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">结构：</span>
                  <span>{analysis.grammar.structure}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">易错点：</span>
                  <span>{analysis.grammar.common_mistake}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">例句：</span>
                  <span>{analysis.grammar.example}</span>
                </div>
              </CardContent>
            </Card>

            {analysis.longSentence && (
              <Card className="mb-4 border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">🧩 长难句分析</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">原文：</span>
                    <span>{analysis.longSentence.original}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">成分划分：</span>
                    <span>{analysis.longSentence.analysis}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">直译：</span>
                    <span>{analysis.longSentence.literalTranslation}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">意译：</span>
                    <span>{analysis.longSentence.freeTranslation}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-4 border-border/60">
              <CardHeader>
                <CardTitle className="text-base">📚 词汇辨析</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">相关词汇：</span>
                  <span>{analysis.vocabulary.words.join('、')}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">辨析：</span>
                  <span>{analysis.vocabulary.comparison}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push('/mistakes-list')}
        >
          返回错题本
        </Button>
      </div>
    </AppShell>
  );
}
