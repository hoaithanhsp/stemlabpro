import React, { useEffect, useState } from 'react';
import { Simulation, SubjectType } from '../types';

interface LibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (code: string) => void;
}

const LibraryDrawer: React.FC<LibraryDrawerProps> = ({ isOpen, onClose, onLoad }) => {
  const [items, setItems] = useState<Simulation[]>([]);
  const [activeTab, setActiveTab] = useState<SubjectType | 'all'>('all');
  const [previewItem, setPreviewItem] = useState<Simulation | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadLibrary();
    }
  }, [isOpen]);

  const loadLibrary = () => {
    try {
      const stored = localStorage.getItem('stemlab_library');
      if (stored) {
        const libraryObj = JSON.parse(stored);
        const list: Simulation[] = Object.keys(libraryObj).map(key => ({
          id: key,
          name: libraryObj[key].title || key,
          subject: libraryObj[key].subject || 'other',
          code: libraryObj[key].html,
          timestamp: libraryObj[key].timestamp
        }));
        setItems(list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }
    } catch (e) {
      console.error("Error loading library", e);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa mô phỏng này?')) {
      const stored = localStorage.getItem('stemlab_library');
      if (stored) {
        const lib = JSON.parse(stored);
        delete lib[id];
        localStorage.setItem('stemlab_library', JSON.stringify(lib));
        loadLibrary();
      }
    }
  };

  // Mở mô phỏng trong tab mới
  const handleOpenInNewTab = (item: Simulation, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([item.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Tải xuống file HTML
  const handleDownload = (item: Simulation, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([item.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.name.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredItems = items.filter(item => activeTab === 'all' || item.subject === activeTab);

  const tabs: { id: SubjectType | 'all', label: string, icon: string }[] = [
    { id: 'all', label: 'Tất cả', icon: '📂' },
    { id: 'math', label: 'Toán', icon: '📐' },
    { id: 'physics', label: 'Vật Lý', icon: '⚛️' },
    { id: 'cs', label: 'Tin Học', icon: '💻' },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl ml-auto h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col animate-slide-in-right border-l border-white/20">
        <div className="p-6 gradient-bg text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">library_books</span>
            <h2 className="text-xl font-bold">Thư Viện STEM</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-1 hover:bg-white/20">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${activeTab === tab.id
                  ? 'bg-white text-primary border-b-2 border-primary'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-background-light custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-2 opacity-50">folder_off</span>
              <p>Chưa có mô phỏng nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                  {/* Preview Thumbnail */}
                  <div className="relative h-40 bg-slate-100 overflow-hidden">
                    <iframe
                      srcDoc={item.code}
                      title={item.name}
                      className="w-full h-full pointer-events-none transform scale-50 origin-top-left"
                      style={{ width: '200%', height: '200%' }}
                      sandbox="allow-scripts"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
                      <button
                        onClick={(e) => handleOpenInNewTab(item, e)}
                        className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                        Xem
                      </button>
                      <button
                        onClick={(e) => handleDownload(item, e)}
                        className="bg-white/90 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Tải
                      </button>
                    </div>
                    {/* Subject Badge */}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-black uppercase ${item.subject === 'math' ? 'bg-teal-500 text-white' :
                        item.subject === 'physics' ? 'bg-blue-500 text-white' :
                          item.subject === 'cs' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                      }`}>
                      {item.subject === 'math' ? 'Toán' :
                        item.subject === 'physics' ? 'Vật Lý' :
                          item.subject === 'cs' ? 'Tin Học' : 'Khác'}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{item.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          {new Date(item.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { onLoad(item.code); onClose(); }}
                          className="text-slate-400 hover:text-primary p-2 rounded-full hover:bg-primary/10 transition-all"
                          title="Mở trong Workspace"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryDrawer;
