'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Camera, ImageIcon, X, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'wec_upload_record_1';

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.onerror = () => toast.error('图片读取失败');
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImage(null);
    if (fileRef.current) fileRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
  };

  const handleAnalyze = () => {
    if (!image) {
      toast.error('请先上传试卷图片');
      return;
    }
    setAnalyzing(true);
    try {
      localStorage.setItem(STORAGE_KEY, image);
      toast.success('已上传，正在分析…');
      router.push('/analysis?recordId=1');
    } catch {
      toast.error('存储失败，请稍后重试');
      setAnalyzing(false);
    }
  };

  return (
    <AppShell>
      <header className="px-5 pt-14 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">上传试卷</h1>
        <p className="mt-1 text-sm text-muted-foreground">拍照或选择图片，开始学情分析</p>
      </header>

      <div className="px-5 pb-6">
        {!image ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 transition-colors hover:border-primary hover:bg-primary/10"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImageIcon className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">点击上传试卷图片</p>
              <p className="mt-1 text-xs text-muted-foreground">支持 JPG / PNG，可拍照或从相册选择</p>
            </div>
          </div>
        ) : (
          <Card className="overflow-hidden border-border/60">
            <div className="relative">
              <img src={image} alt="试卷预览" className="w-full object-contain" />
              <button
                onClick={handleRemove}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <CardContent className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
              <ScanLine className="h-4 w-4 text-primary" />
              <span>试卷图片已就绪，点击下方按钮开始分析</span>
            </CardContent>
          </Card>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-11" onClick={() => cameraRef.current?.click()}>
            <Camera className="mr-2 h-4 w-4" /> 拍照
          </Button>
          <Button variant="outline" className="h-11" onClick={() => fileRef.current?.click()}>
            <ImageIcon className="mr-2 h-4 w-4" /> 从相册选择
          </Button>
        </div>

        <div className="mt-6">
          <Button
            size="lg"
            className="w-full"
            disabled={!image || analyzing}
            onClick={handleAnalyze}
          >
            {analyzing ? '分析中…' : '开始分析'}
          </Button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </AppShell>
  );
}
