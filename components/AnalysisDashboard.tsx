import React from 'react';
import { AnalysisResult } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Heart, Brain, Lightbulb, TrendingUp, User, Users } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-fade-in">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-medium text-sm mb-2">
            <span className="bg-indigo-50 px-2 py-1 rounded-md">{data.date}</span>
            <span className="bg-purple-50 px-2 py-1 rounded-md text-purple-600">深度分析</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.title}</h1>
          <p className="text-slate-500 max-w-2xl">{data.summary}</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-pink-50 rounded-2xl p-6 min-w-[150px]">
          <Heart className="text-pink-500 mb-2 fill-pink-500" size={32} />
          <span className="text-3xl font-bold text-slate-800">{data.currentIntimacy}%</span>
          <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">亲密指数</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotional Trends */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-500" />
              情感轨迹
            </h3>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-slate-600"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 我</span>
              <span className="flex items-center gap-1 text-slate-600"><span className="w-2 h-2 rounded-full bg-pink-500"></span> 对方</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis domain={[-10, 10]} hide />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Line type="monotone" name="我" dataKey="userScore" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" name="对方" dataKey="partnerScore" stroke="#ec4899" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intimacy Flow */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Users size={20} className="text-purple-500" />
              亲密流动
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sentimentTrend}>
                <defs>
                  <linearGradient id="colorIntimacy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" name="亲密度" dataKey="intimacyScore" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorIntimacy)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Psychological Analysis Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Brain size={120} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User size={24} className="text-blue-500" />
            我的心理状态
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {data.myPsychology}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Brain size={120} className="text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User size={24} className="text-pink-500" />
            对方的内心世界
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {data.partnerPsychology}
          </p>
        </div>
      </div>

      {/* Advice Section */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb size={28} className="text-yellow-300" />
          <h3 className="text-2xl font-bold">成长与建议</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.relationshipAdvice.map((advice, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-colors">
              <span className="block text-2xl font-bold text-white/30 mb-2">0{idx + 1}</span>
              <p className="font-medium leading-relaxed">{advice}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalysisDashboard;