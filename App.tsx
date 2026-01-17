import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { initializeChat, sendMessageToGemini, resetChat, hasApiKey } from './services/geminiService';
import PreviewFrame from './components/PreviewFrame';
import LibraryDrawer from './components/LibraryDrawer';
import ApiKeyModal from './components/ApiKeyModal';
import LoginModal from './components/LoginModal';
import SettingsModal from './components/SettingsModal';
import { ChatMessage } from './types';
import logoImage from './logo.jpg';

// ==========================================
// SUB-COMPONENTS
// ==========================================

const Sidebar = ({ onViewChange, currentView, onLibraryOpen, onHistoryOpen, onSettingsOpen, profile }: any) => (
  <aside className="w-64 glass-panel border-r border-teal-100/20 flex flex-col h-full z-20 transition-all duration-300">
    {/* Logo Section */}
    <div className="p-4 flex justify-center border-b border-slate-100">
      <img src={logoImage} alt="Logo Trần Thị Kim Thoa" className="w-32 h-32 rounded-xl object-cover shadow-lg" />
    </div>

    {/* App Branding */}
    <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('home')}>
      <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
        <span className="material-symbols-outlined text-2xl">science</span>
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">STEMLAB</h1>
        <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Không gian ảo</p>
      </div>
    </div>
    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
      <div onClick={() => onViewChange('home')} className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${currentView === 'home' ? 'text-primary bg-primary/10 font-bold' : 'text-slate-600 hover:bg-teal-50 hover:text-primary'}`}>
        <span className="material-symbols-outlined">grid_view</span>
        <p className="text-sm">Bảng điều khiển</p>
      </div>
      <div onClick={onLibraryOpen} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-teal-50 hover:text-primary rounded-xl transition-all cursor-pointer">
        <span className="material-symbols-outlined">library_books</span>
        <p className="text-sm font-medium">Thư viện</p>
      </div>
      <div onClick={() => onViewChange('workspace')} className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${currentView === 'workspace' ? 'text-primary bg-primary/10 font-bold' : 'text-slate-600 hover:bg-teal-50 hover:text-primary'}`}>
        <span className="material-symbols-outlined">add_box</span>
        <p className="text-sm">Mô phỏng mới</p>
      </div>
      <div onClick={onHistoryOpen} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-teal-50 hover:text-primary rounded-xl transition-all cursor-pointer">
        <span className="material-symbols-outlined">history</span>
        <p className="text-sm font-medium">Lịch sử</p>
      </div>
      <div className="pt-8 pb-2 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tài khoản</div>
      <div onClick={onSettingsOpen} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-teal-50 hover:text-primary rounded-xl transition-all cursor-pointer">
        <span className="material-symbols-outlined">settings</span>
        <p className="text-sm font-medium">Cài đặt</p>
      </div>
    </nav>
    <div className="p-4 border-t border-slate-200/50">
      <div onClick={onSettingsOpen} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
        <img src={profile?.avatar || '/teacher_avatar.jpg'} alt="Avatar" className="size-10 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{profile?.name || 'Trần Thị Kim Thoa'}</p>
          <p className="text-[10px] text-slate-500">{profile?.school || 'Trường TTHPT Hoàng Diệu'}</p>
          <p className="text-[9px] text-slate-400 truncate">{profile?.address || 'Số 1 Mạc Đĩnh Chi, P. Phú Lợi, TP. Cần Thơ'}</p>
        </div>
        <span className="material-symbols-outlined text-slate-400 text-sm">unfold_more</span>
      </div>
    </div>
  </aside>
);

const Dashboard = ({ onStartSim, onFileUpload }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div className="mb-8 animate-fade-up">
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-sm">Chào mừng trở lại, Nhà khoa học!</h2>
        <p className="text-white/90 max-w-2xl text-lg">Phòng thí nghiệm ảo của bạn đã sẵn sàng. Hãy tạo một mô phỏng mới hoặc tiếp tục công việc nghiên cứu còn dang dở.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl shadow-xl border border-white/40 mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="size-8 bg-success-lime rounded-lg flex items-center justify-center text-background-dark shadow-sm">
            <span className="material-symbols-outlined font-bold">add_circle</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Tạo mô phỏng mới</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => fileInputRef.current?.click()} className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center bg-white/50">
            <input type="file" ref={fileInputRef} className="hidden" onChange={onFileUpload} />
            <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">upload_file</span>
            <h4 className="font-bold text-slate-900 mb-1">Nhập bài thí nghiệm</h4>
            <p className="text-xs text-slate-500">File PDF, DOCX, hoặc XLSX</p>
          </div>
          <div onClick={() => onStartSim("Tôi muốn nhập hướng dẫn bài Lab...")} className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center bg-white/50">
            <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">edit_note</span>
            <h4 className="font-bold text-slate-900 mb-1">Dán hướng dẫn</h4>
            <p className="text-xs text-slate-500">Nhập hoặc dán văn bản bài Lab</p>
          </div>
          <div onClick={() => fileInputRef.current?.click()} className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center bg-white/50">
            <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">camera_enhance</span>
            <h4 className="font-bold text-slate-900 mb-1">Quét ảnh OCR</h4>
            <p className="text-xs text-slate-500">Quét ảnh từ sách hoặc sơ đồ</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-2xl font-bold text-white drop-shadow-sm">Mô phỏng nổi bật</h3>
        <div className="flex gap-2">
          {['Toán học', 'Vật lý', 'Tin học'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors border border-white/20">{tag}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
        {/* Sim Card 1 */}
        <div className="glass-panel group rounded-2xl overflow-hidden border border-white/40 shadow-lg hover:-translate-y-1 transition-all">
          <div className="h-40 relative overflow-hidden bg-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-400 via-transparent to-transparent"></div>
            <span className="material-symbols-outlined text-6xl text-white/20">functions</span>
            <div className="absolute top-3 left-3 px-2 py-1 bg-teal-600 text-white text-[10px] font-black uppercase rounded shadow-sm">Toán học</div>
          </div>
          <div className="p-5">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Trường Vector 3D</h4>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">Trực quan hóa sự phân kỳ và độ xoáy phức tạp trong hệ tọa độ ba chiều.</p>
            <button onClick={() => onStartSim("Tạo mô phỏng Trường Vector 3D")} className="w-full bg-primary text-white h-9 px-4 rounded-lg text-sm font-bold group-hover:shadow-lg group-hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 hover:bg-primary-dark">
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>Bắt đầu Lab</span>
            </button>
          </div>
        </div>
        {/* Sim Card 2 */}
        <div className="glass-panel group rounded-2xl overflow-hidden border border-white/40 shadow-lg hover:-translate-y-1 transition-all">
          <div className="h-40 relative overflow-hidden bg-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(45deg,_#14b8a6_0%,_transparent_100%)]"></div>
            <span className="material-symbols-outlined text-6xl text-white/20">architecture</span>
            <div className="absolute top-3 left-3 px-2 py-1 bg-teal-500 text-white text-[10px] font-black uppercase rounded shadow-sm">Vật lý</div>
          </div>
          <div className="p-5">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Con lắc Điều hòa</h4>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">Nghiên cứu hiện tượng cộng hưởng và giao thoa trong các hệ dao động liên kết.</p>
            <button onClick={() => onStartSim("Tạo mô phỏng Con lắc Điều hòa")} className="w-full bg-primary text-white h-9 px-4 rounded-lg text-sm font-bold group-hover:shadow-lg group-hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 hover:bg-primary-dark">
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>Bắt đầu Lab</span>
            </button>
          </div>
        </div>
        {/* Sim Card 3 */}
        <div className="glass-panel group rounded-2xl overflow-hidden border border-white/40 shadow-lg hover:-translate-y-1 transition-all">
          <div className="h-40 relative overflow-hidden bg-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,_#333_0px,_#333_1px,_transparent_1px,_transparent_20px)]"></div>
            <span className="material-symbols-outlined text-6xl text-white/20">data_object</span>
            <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase rounded shadow-sm">Tin học</div>
          </div>
          <div className="p-5">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Trực quan hóa Sắp xếp</h4>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">So sánh hiệu suất QuickSort, MergeSort và BubbleSort với các tập dữ liệu thực tế.</p>
            <button onClick={() => onStartSim("Tạo mô phỏng thuật toán Sắp xếp")} className="w-full bg-primary text-white h-9 px-4 rounded-lg text-sm font-bold group-hover:shadow-lg group-hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 hover:bg-primary-dark">
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>Bắt đầu Lab</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'workspace'>('home');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('stemlab_logged_in') === 'true';
  });

  // Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('stemlab_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Trần Thị Kim Thoa',
      avatar: '/teacher_avatar.jpg',
      school: 'Trường TTHPT Hoàng Diệu',
      address: 'Số 1 Mạc Đĩnh Chi, P. Phú Lợi, TP. Cần Thơ',
      subject: 'Vật lý',
      phone: '',
      email: ''
    };
  });

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // API Key State
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasValidApiKey, setHasValidApiKey] = useState(false);

  // Workspace State
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'Chào mừng! Tôi là STEMLAB AI. Hãy mô tả bài thí nghiệm bạn muốn tạo.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Login
  const handleLogin = (user: { name: string; avatar: string }) => {
    setIsLoggedIn(true);
    localStorage.setItem('stemlab_logged_in', 'true');
    setProfile(prev => ({ ...prev, name: user.name, avatar: user.avatar }));
    localStorage.setItem('stemlab_user_profile', JSON.stringify({ ...profile, name: user.name, avatar: user.avatar }));
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('stemlab_logged_in');
  };

  // Handle Profile Save
  const handleProfileSave = (newProfile: typeof profile) => {
    setProfile(newProfile);
    localStorage.setItem('stemlab_user_profile', JSON.stringify(newProfile));
  };

  // Check API key on mount
  useEffect(() => {
    const checkApiKey = () => {
      const valid = hasApiKey();
      setHasValidApiKey(valid);
      if (!valid) {
        setShowApiKeyModal(true);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    if (currentView === 'workspace') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, currentView]);

  const switchToWorkspace = (initialPrompt?: string) => {
    setCurrentView('workspace');
    if (initialPrompt) {
      // A bit of a hack to set state and send immediately
      setTimeout(() => {
        setInput(initialPrompt);
        // handleSendMessage would need to be called here or user clicks send
        // For better UX, we just set input.
      }, 100);
    }
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !file) || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input || (file ? `[Gửi file: ${file.name}]` : '') };
    setChatHistory(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput('');
    setCurrentView('workspace'); // Ensure we are in workspace

    try {
      let imageBase64: string | undefined = undefined;
      if (file) {
        if (file.type.startsWith('image/')) {
          imageBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              const base64Clean = result.split(',')[1];
              resolve(base64Clean);
            }
            reader.readAsDataURL(file);
          });
        }
        setFile(null);
      }

      const responseText = await sendMessageToGemini(userMsg.text, imageBase64);
      const codeBlockRegex = /```html([\s\S]*?)```/;
      const match = responseText.match(codeBlockRegex);

      let displayResponse = responseText;
      let generatedHtml = null;

      if (match) {
        generatedHtml = match[1];
        displayResponse = responseText.replace(codeBlockRegex, '\n\n**✅ Đã sinh mã mô phỏng.**');
        setCurrentCode(generatedHtml);
      }

      setChatHistory(prev => [...prev, { role: 'model', text: displayResponse }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: '⚠️ Lỗi kết nối AI.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // If uploaded from Dashboard, switch to workspace and prompt user
      if (currentView === 'home') {
        setCurrentView('workspace');
        setChatHistory(prev => [...prev, { role: 'model', text: `📂 Đã nhận file: ${e.target.files![0].name}. Hãy mô tả yêu cầu của bạn.` }]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Login Screen */}
      {!isLoggedIn && <LoginModal onLogin={handleLogin} />}

      {/* Main App - only show when logged in */}
      {isLoggedIn && (
        <div className="flex h-screen overflow-hidden gradient-bg font-display">
          <Sidebar
            onViewChange={setCurrentView}
            currentView={currentView}
            onLibraryOpen={() => setIsLibraryOpen(true)}
            onHistoryOpen={() => setIsLibraryOpen(true)}
            onSettingsOpen={() => setIsSettingsOpen(true)}
            profile={profile}
          />

          <main className="flex-1 flex flex-col overflow-hidden relative">
            {/* Header */}
            <header className="h-16 glass-panel border-b border-teal-100/20 px-8 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                  <input
                    className="w-full bg-slate-50/50 border-transparent rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all placeholder:text-slate-400"
                    placeholder="Tìm kiếm mô phỏng, hoặc nhập lệnh nhanh..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setInput(e.currentTarget.value);
                        e.currentTarget.value = '';
                        switchToWorkspace();
                        // We can trigger send message here if we pass state carefully, 
                        // but for now let's just focus the main input in workspace or use effect.
                        // Simplifying:
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className={`h-9 px-4 flex items-center gap-2 rounded-full text-sm font-bold transition-all ${hasValidApiKey
                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                    : 'bg-red-50 text-red-500 hover:bg-red-100'
                    }`}
                  title="Cài đặt API Key"
                >
                  <span className="material-symbols-outlined text-lg">key</span>
                  <span>{hasValidApiKey ? 'API Key' : 'Nhập Key'}</span>
                </button>
                <button className="size-10 flex items-center justify-center rounded-full hover:bg-teal-50 text-slate-600 relative transition-colors">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button
                  onClick={() => { resetChat(); setChatHistory([{ role: 'model', text: 'Đã reset phiên làm việc.' }]); setCurrentCode(null); }}
                  className="h-9 px-4 flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-sm font-bold transition-all"
                >
                  <span className="material-symbols-outlined text-lg">refresh</span>
                  <span>Reset</span>
                </button>
                <button className="h-10 px-4 flex items-center gap-2 bg-primary text-white rounded-full text-sm font-bold shadow-md hover:bg-primary-dark transition-all">
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  <span>Nâng cấp</span>
                </button>
              </div>
            </header>

            {/* Content Area */}
            {currentView === 'home' ? (
              <Dashboard onStartSim={(prompt: string) => { setInput(prompt); setCurrentView('workspace'); }} onFileUpload={handleFileUpload} />
            ) : (
              <div className="flex-1 flex overflow-hidden p-4 gap-4 bg-slate-50/50">
                {/* Chat Panel */}
                <div className={`flex flex-col glass-panel rounded-2xl shadow-lg border border-white/40 transition-all duration-300 ${currentCode ? 'w-1/3 min-w-[380px]' : 'w-full max-w-4xl mx-auto'}`}>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <span className="material-symbols-outlined">smart_toy</span>
                      <span>Trợ lý Lab</span>
                    </div>
                    {file && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">attach_file</span>
                        {file.name}
                        <button onClick={() => setFile(null)} className="hover:text-red-500 ml-1">×</button>
                      </span>
                    )}
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                            ? 'bg-primary text-white rounded-br-sm'
                            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
                            } ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            className="markdown-content"
                            components={{
                              a: ({ node, ...props }) => <a className="underline hover:opacity-80 font-bold" target="_blank" rel="noreferrer" {...props} />
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-100 shadow-sm">
                          <div className="flex space-x-1.5 items-center h-5">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-150"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-3 bg-white/50 border-t border-slate-100">
                    <div className="relative flex items-end gap-2 bg-white rounded-xl border border-slate-200 p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-primary transition rounded-lg hover:bg-slate-50"
                        title="Upload"
                      >
                        <span className="material-symbols-outlined">attach_file</span>
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.txt,.pdf" onChange={handleFileUpload} />

                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập yêu cầu mô phỏng..."
                        className="flex-1 max-h-32 min-h-[44px] py-2.5 px-2 bg-transparent border-none focus:ring-0 resize-none text-sm text-slate-800 placeholder:text-slate-400"
                        rows={1}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isLoading || (!input.trim() && !file)}
                        className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        <span className="material-symbols-outlined">send</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview Panel */}
                {currentCode && (
                  <div className="flex-1 flex flex-col h-full animate-fade-in gap-2 min-w-0">
                    <div className="flex justify-between items-center px-2">
                      <h3 className="font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">preview</span>
                        Màn Hình Mô Phỏng
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const name = prompt('Nhập tên mô phỏng để lưu:');
                            if (!name) return;

                            const subjectChoice = prompt(
                              'Chọn môn học (nhập số):\n1. Toán học\n2. Vật lý\n3. Tin học\n4. Khác'
                            );
                            if (!subjectChoice) return;

                            let subject = 'other';
                            switch (subjectChoice.trim()) {
                              case '1': subject = 'math'; break;
                              case '2': subject = 'physics'; break;
                              case '3': subject = 'cs'; break;
                              default: subject = 'other';
                            }

                            try {
                              const library = JSON.parse(localStorage.getItem('stemlab_library') || '{}');
                              library[name] = {
                                title: name,
                                subject: subject,
                                html: currentCode,
                                timestamp: new Date().toISOString()
                              };
                              localStorage.setItem('stemlab_library', JSON.stringify(library));
                              const subjectName = subject === 'math' ? 'Toán học' :
                                subject === 'physics' ? 'Vật lý' :
                                  subject === 'cs' ? 'Tin học' : 'Khác';
                              alert(`✅ Đã lưu "${name}" vào thư viện ${subjectName}!`);
                            } catch (e) {
                              alert('Lỗi: ' + (e as Error).message);
                            }
                          }}
                          className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-1 font-semibold shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">bookmark_add</span>
                          Lưu Thư Viện
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([currentCode], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'mo_phong_stemlab.html';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1 font-semibold shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          Tải HTML
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([currentCode], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                          }}
                          className="text-xs bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-1 font-semibold shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Mở cửa sổ mới
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <PreviewFrame htmlCode={currentCode} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* API Key Modal */}
          <ApiKeyModal
            isOpen={showApiKeyModal}
            onClose={() => setShowApiKeyModal(false)}
            onSave={() => setHasValidApiKey(true)}
            canClose={hasValidApiKey}
          />

          {/* Library Drawer */}
          <LibraryDrawer
            isOpen={isLibraryOpen}
            onClose={() => setIsLibraryOpen(false)}
            onLoad={(code) => { setCurrentCode(code); setCurrentView('workspace'); }}
          />

          {/* Settings Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            profile={profile}
            onSave={handleProfileSave}
            onLogout={handleLogout}
          />
        </div>
      )}
    </>
  );
}

export default App;