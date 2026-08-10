'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { updateUserProfile } from '@/lib/user';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { GraduationCap, Check } from 'lucide-react';

const STAGES = ['初中', '高中'] as const;
const GRADES: Record<string, string[]> = {
  初中: ['初一', '初二', '初三'],
  高中: ['高一', '高二', '高三'],
};
const TEXTBOOKS = ['人教版', '外研版', '牛津版'] as const;

export default function SetupPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [stage, setStage] = useState<string>(user?.stage || '初中');
  const [grade, setGrade] = useState<string>('');
  const [textbook, setTextbook] = useState<string>(user?.textbook_version || '人教版');
  const [submitting, setSubmitting] = useState(false);

  const grades = GRADES[stage] || [];

  const handleStageChange = (s: string) => {
    setStage(s);
    setGrade('');
  };

  const handleSubmit = async () => {
    if (!grade) {
      toast.error('请选择年级');
      return;
    }
    if (!user) return;
    setSubmitting(true);
    try {
      const updated = await updateUserProfile(user.phone, {
        stage,
        grade,
        textbook_version: textbook,
      });
      setUser(updated);
      toast.success('设置完成');
      router.replace('/');
    } catch {
      toast.error('保存失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[hsl(175,65%,96%)] to-background">
      <header className="px-5 pt-14 pb-4">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">学段设置</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          完善你的学习信息，我们将为你定制专属学情分析
        </p>
      </header>

      <div className="flex-1 px-5 pb-32">
        <Card className="border-border/60 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
            <CardDescription>选择你当前的学段、年级和教材版本</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>学段</Label>
              <div className="grid grid-cols-2 gap-3">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStageChange(s)}
                    className={cn(
                      'relative h-12 rounded-xl border text-sm font-medium transition-all',
                      stage === s
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {s}
                    {stage === s && (
                      <Check className="absolute right-2 top-2 h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>年级</Label>
              <div className="grid grid-cols-3 gap-3">
                {grades.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={cn(
                      'relative h-12 rounded-xl border text-sm font-medium transition-all',
                      grade === g
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {g}
                    {grade === g && <Check className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>教材版本</Label>
              <div className="grid grid-cols-3 gap-3">
                {TEXTBOOKS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTextbook(t)}
                    className={cn(
                      'relative h-12 rounded-xl border text-sm font-medium transition-all',
                      textbook === t
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {t}
                    {textbook === t && <Check className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent px-5 pb-8 pt-4">
        <div className="mx-auto max-w-md">
          <Button className="w-full" size="lg" disabled={submitting} onClick={handleSubmit}>
            {submitting ? '保存中…' : '完成设置'}
          </Button>
        </div>
      </div>
    </div>
  );
}
