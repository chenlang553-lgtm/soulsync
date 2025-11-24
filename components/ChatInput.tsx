import React, { useState } from 'react';
import { Upload, FileText, Sparkles, Loader2, PlayCircle } from 'lucide-react';
import { analyzeChatText } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface ChatInputProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

const DEMO_RESULT: AnalysisResult = {
  id: 'demo-sample-001',
  date: new Date().toLocaleDateString('zh-CN'),
  title: '演示：周末旅行计划',
  summary: '一段关于规划周末度假的对话。起初因为预算分歧略显紧张，但通过双方的妥协和对目的地的共同期待，最终达成了共识并拉近了关系。',
  currentIntimacy: 82,
  sentimentTrend: [
    { index: 0, label: '开场', userScore: 6, partnerScore: 5, intimacyScore: 70 },
    { index: 1, label: '预算分歧', userScore: -2, partnerScore: -4, intimacyScore: 60 },
    { index: 2, label: '讨论与争执', userScore: 1, partnerScore: -1, intimacyScore: 65 },
    { index: 3, label: '寻找妥协', userScore: 4, partnerScore: 5, intimacyScore: 75 },
    { index: 4, label: '达成一致', userScore: 8, partnerScore: 7, intimacyScore: 85 },
    { index: 5, label: '甜蜜收尾', userScore: 9, partnerScore: 9, intimacyScore: 90 },
  ],
  partnerPsychology: '对方最初表现出对财务状况的焦虑，这掩盖了通过控制预算来寻求安全感的深层需求。然而，在解决阶段他们表现出的高参与度，表明了他们非常渴望与你共同创造美好的回忆。',
  myPsychology: '你展现了韧性和以解决问题为导向的心态。虽然在遇到预算阻力时曾感到短暂的沮丧（预算分歧阶段），但你迅速转向了情感确认，这有助于缓解紧张局势。',
  relationshipAdvice: [
    '尽早承认并讨论财务焦虑，以防止对方产生防御性反应。',
    '在解决问题时继续使用“我们”这样的语言，这能增强团队归属感。',
    '庆祝每一个小的妥协，以强化积极的冲突解决模式。'
  ],
  keyTopics: ['旅行计划', '预算管理', '高质量时间', '冲突解决']
};

const ChatInput: React.FC<ChatInputProps> = ({ onAnalysisComplete }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeChatText(text);
      onAnalysisComplete(result);
    } catch (err) {
      setError("分析失败。请重试或检查您的 API Key。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDemoData = () => {
    onAnalysisComplete(DEMO_RESULT);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light text-slate-800 mb-2">分析你们的亲密关系</h2>
        <p className="text-slate-500">粘贴聊天记录或上传导出的文本，揭示隐藏的情感洞察。</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-1 bg-slate-50 border-b border-slate-100 flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText size={16} />
            <span>文本输入</span>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={handleDemoData}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <PlayCircle size={14} />
              <span>试用演示数据</span>
            </button>
            <label className="cursor-pointer flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
              <Upload size={16} />
              <span>上传 .txt</span>
              <input type="file" accept=".txt" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
        
        <textarea
          className="w-full h-64 p-4 focus:outline-none text-slate-700 font-mono text-sm resize-none"
          placeholder="在此粘贴聊天记录...
示例:
[2023-10-01] 我: 嘿，今天怎么样？
[2023-10-01] 伴侣: 还好，就是有点累。
..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="p-4 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {text.length} 字符
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium transition-all shadow-md
              ${isAnalyzing || !text.trim() 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg active:scale-95'
              }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>正在分析...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>生成深度洞察</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ChatInput;