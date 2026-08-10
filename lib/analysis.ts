const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export interface AnalysisResult {
  grammar: {
    point: string;
    definition: string;
    structure: string;
    common_mistake: string;
    example: string;
  };
  longSentence: {
    original: string;
    analysis: string;
    literalTranslation: string;
    freeTranslation: string;
  } | null;
  vocabulary: {
    words: string[];
    comparison: string;
  };
}

export async function analyzeMistake(
  questionText: string,
  userAnswer: string,
  correctAnswer: string,
  grammarTag: string
): Promise<AnalysisResult> {
  const apiKey = "sk-0d3add6c6e584656b47694e6ce8f173f";
  if (!apiKey) throw new Error('Missing DEEPSEEK_API_KEY');

  const prompt = `你是一位武汉中考英语辅导专家。请分析以下错题，用纯JSON返回（不带markdown标记）：
题目：${questionText}
我的答案：${userAnswer}
正确答案：${correctAnswer}
关联语法点：${grammarTag}

输出JSON格式（严格按此结构）：
{
  "grammar": {
    "point": "语法点名称",
    "definition": "一句话定义",
    "structure": "语法公式",
    "common_mistake": "典型错误提醒",
    "example": "一个正确例句"
  },
  "longSentence": {
    "original": "长难句原文（没有就填null）",
    "analysis": "成分划分",
    "literalTranslation": "直译",
    "freeTranslation": "意译"
  },
  "vocabulary": {
    "words": ["词1","词2"],
    "comparison": "辨析说明"
  }
}
如果没有长难句，longSentence字段整个设为null。`;

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
    throw new Error('API返回异常: ' + JSON.stringify(data));
  }
  const content = data.choices[0].message.content.trim();
  const jsonStr = content.replace(/^```json\n?/i, '').replace(/\n?```$/i, '');
  return JSON.parse(jsonStr) as AnalysisResult;
}