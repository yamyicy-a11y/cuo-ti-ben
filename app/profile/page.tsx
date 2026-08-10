'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/lib/auth';
import { updateUserProfile } from '@/lib/user';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LogOut, Check, GraduationCap } from 'lucide-react';

const STAGES = ['初中', '高中'] as const;
const GRADES: Record<string, string[]> = {
  初中: ['初一', '初二', '初三'],
  高中: ['高一', '高二', '高三'],
};
const TEXTBOOKS = ['人教版', '外研版', '牛津版'] as const;

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [stage, setStage] = useState(user?.stage || '初中');
  const [grade, setGrade] = useState(user?.grade || '');
  const [textbook, setTextbook] = useState(user?.textbook_version || '人教版');
  const [saving, setSaving] = useState(false);

  const grades = GRADES[stage] || [];

  const handleSave = async () => {
    if (!user) return;
    if (!grade) {
      toast.error('请选择年级');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateUserProfile(user.phone, {
        stage,
        grade,
        textbook_version: textbook,
      });
      setUser(updated);
      toast.success('已保存');
    } catch {
      toast.error('保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
  };

  return (
    <AppShell>
      <header className="px-5 pt-14 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">个人中心</h1>
        <p className="mt-1 text-sm text-muted-foreground">管理你的学习信息</p>
      </header>

      <div className="px-5 pb-6">
        <Card className="mb-4 border-border/60 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-semibold">{user ? user.phone.slice(-4) : ''}</p>
              <p className="text-sm text-muted-foreground">{user?.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-base">学习信息</CardTitle>
            <CardDescription>修改后点击保存即可生效</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>学段</Label>
              <div className="grid grid-cols-2 gap-3">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStage(s);
                      setGrade('');
                    }}
                    className={cn(
                      'relative h-12 rounded-xl border text-sm font-medium transition-all',
                      stage === s
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {s}
                    {stage === s && <Check className="absolute right-2 top-2 h-4 w-4 text-primary" />}
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

        <div className="mt-4 space-y-3">
          <Button className="w-full" size="lg" disabled={saving} onClick={handleSave}>
            {saving ? '保存中…' : '保存修改'}
          </Button>
          <Button
            variant="outline"
            className="w-full text-destructive hover:bg-destructive/5 hover:text-destructive"
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> 退出登录
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
