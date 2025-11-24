import React, { useState } from 'react';
import { LayoutGrid, UploadCloud, MessageCircleHeart, Archive, Menu, X } from 'lucide-react';
import ChatInput from './components/ChatInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import Consultant from './components/Consultant';
import { AppView, AnalysisResult } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.UPLOAD);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [archivedItems, setArchivedItems] = useState<AnalysisResult[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentAnalysis(result);
    setArchivedItems(prev => [result, ...prev]);
    setCurrentView(AppView.DASHBOARD);
  };

  const NavButton = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
        ${currentView === view 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 p-6 flex flex-col shadow-xl lg:shadow-none transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">SoulSync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">菜单</div>
          <NavButton view={AppView.UPLOAD} icon={UploadCloud} label="新建分析" />
          <NavButton view={AppView.DASHBOARD} icon={LayoutGrid} label="仪表盘" />
          <NavButton view={AppView.CONSULTANT} icon={MessageCircleHeart} label="AI 顾问" />
          <NavButton view={AppView.ARCHIVE} icon={Archive} label="历史归档" />
        </nav>

        <div className="p-4 bg-indigo-50 rounded-2xl mt-6">
          <p className="text-xs text-indigo-600 font-medium mb-1">高级会员</p>
          <p className="text-[10px] text-indigo-400 mb-3">解锁更深层的情感模式。</p>
          <button className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">
            升级计划
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Mobile Bar */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center px-4 justify-between shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-800">SoulSync</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentView === AppView.UPLOAD && (
            <div className="h-full flex flex-col justify-center">
              <ChatInput onAnalysisComplete={handleAnalysisComplete} />
            </div>
          )}

          {currentView === AppView.DASHBOARD && (
            currentAnalysis ? <AnalysisDashboard data={currentAnalysis} /> : (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4 text-slate-400">
                  <LayoutGrid size={32} />
                </div>
                <h3 className="text-xl font-medium text-slate-700 mb-2">暂无分析</h3>
                <p className="text-slate-500 mb-6">上传聊天记录以查看情感仪表盘。</p>
                <button 
                  onClick={() => setCurrentView(AppView.UPLOAD)}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  去上传
                </button>
              </div>
            )
          )}

          {currentView === AppView.CONSULTANT && <Consultant />}

          {currentView === AppView.ARCHIVE && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">分析归档</h2>
              <div className="grid gap-4">
                {archivedItems.length > 0 ? archivedItems.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex justify-between items-center group cursor-pointer" onClick={() => {
                    setCurrentAnalysis(item);
                    setCurrentView(AppView.DASHBOARD);
                  }}>
                    <div>
                      <h4 className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.summary}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{item.date}</span>
                        <span className="text-xs bg-pink-50 text-pink-500 px-2 py-0.5 rounded-md">亲密指数: {item.currentIntimacy}%</span>
                      </div>
                    </div>
                    <div className="text-slate-300 group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                    暂无归档，开始第一次分析吧！
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;