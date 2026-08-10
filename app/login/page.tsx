'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const phoneValid = /^1\d{10}$/.test(phone);

  const handleSendCode = () => {
    if (!phoneValid) {
      toast.error('请输入正确的手机号');
      return;
    }
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(generated);
    setStep('code');
    setCountdown(60);
    toast.success(`验证码已发送（模拟：${generated}）`, { duration: 6000 });
    setTimeout(() => codeRefs.current[0]?.focus(), 100);
  };

  const handleCodeChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const arr = code.split('');
    arr[i] = val;
    setCode(arr.join(''));
    if (val && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const handleCodeKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      setCode(pasted);
      codeRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleLogin = async () => {
    if (code.length !== 6) {
      toast.error('请输入6位验证码');
      return;
    }
    setSubmitting(true);
    try {
      const { isNew } = await login(phone);
      toast.success('登录成功');
      router.replace(isNew ? '/setup' : '/');
    } catch {
      toast.error('登录失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[hsl(175,65%,96%)] via-background to-[hsl(200,80%,94%)] px-5">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <GraduationCap className="h-9 w-9" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">武汉英语学情分析</h1>
          <p className="mt-1 text-sm text-muted-foreground">让每一次努力都被看见</p>
        </div>
      </div>

      <Card className="w-full max-w-sm border-border/60 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">
            {step === 'phone' ? '手机号登录' : '输入验证码'}
          </CardTitle>
          <CardDescription>
            {step === 'phone'
              ? '请输入手机号获取验证码'
              : `验证码已发送至 ${phone.slice(0, 3)}****${phone.slice(7)}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  inputMode="numeric"
                  placeholder="请输入11位手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                />
              </div>
              <Button className="w-full" disabled={!phoneValid} onClick={handleSendCode}>
                获取验证码
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>验证码</Label>
                <div className="flex justify-between gap-2" onPaste={handleCodePaste}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Input
                      key={i}
                      ref={(el) => {
                        codeRefs.current[i] = el;
                      }}
                      inputMode="numeric"
                      className="h-12 w-11 text-center text-lg font-semibold"
                      value={code[i] || ''}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKey(i, e)}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  模拟验证码：<span className="font-semibold text-primary">{sentCode}</span>（输入任意6位数字也可登录）
                </p>
              </div>
              <Button
                className="w-full"
                disabled={code.length !== 6 || submitting}
                onClick={handleLogin}
              >
                {submitting ? '登录中…' : '登录'}
              </Button>
              <button
                className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setStep('phone');
                  setCode('');
                }}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> 返回修改手机号
              </button>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {countdown > 0 ? `${countdown}s 后可重新获取` : '未收到验证码？'}
                </span>
                {countdown === 0 && (
                  <button className="font-medium text-primary" onClick={handleSendCode}>
                    重新获取
                  </button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        登录即表示同意《用户协议》与《隐私政策》
      </p>
    </div>
  );
}
