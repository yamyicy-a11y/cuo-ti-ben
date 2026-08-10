'use client';

import { useState } from 'react';
import { analyzeMistake, type AnalysisResult } from '@/lib/analysis';

export default function TestAIPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeMistake(
        'He _____ to school yesterday. A. go B. went C. gone D. goes',
        'A',
        'B',
        '一般过去时'
      );
      setResult(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="mb-6 text-2xl font-bold">AI 分析测试</h1>

      <button
        onClick={handleTest}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        测试 AI 分析
      </button>

      {loading && (
        <div className="mt-6 flex items-center gap-2 text-blue-600">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span>🤖 分析中...</span>
        </div>
      )}

      {error && (
        <div className="mt-6 w-full max-w-2xl rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="font-medium text-red-600">错误信息</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-3 font-medium text-gray-800">分析结果</p>
          <pre className="overflow-auto rounded bg-gray-50 p-3 text-sm text-gray-700">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
