import React, { useState, useEffect } from 'react';
import { AVAILABLE_MODELS } from '../services/geminiService';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
    onSave: (key: string, model: string) => void;
    currentModel: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, onSave, currentModel }) => {
    const [localKey, setLocalKey] = useState(apiKey);
    const [localModel, setLocalModel] = useState(currentModel);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setLocalKey(apiKey);
        setLocalModel(currentModel);
    }, [apiKey, currentModel, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (localKey.trim()) {
            onSave(localKey, localModel);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-up">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">settings</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cấu hình AI</h2>
                            <p className="text-xs text-slate-500">Thiết lập Model và API Key</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* API Key Section */}
                    <section>
                        <div className="flex justify-between items-baseline mb-3">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                API Key Gemini <span className="text-red-500">*</span>
                            </label>
                            <a
                                href="https://aistudio.google.com/api-keys"
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                            >
                                Lấy API Key tại đây
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                        </div>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={localKey}
                                onChange={(e) => setLocalKey(e.target.value)}
                                placeholder="Nhập API key của bạn (bắt đầu bằng AIza...)"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-sm"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-yellow-500">lightbulb</span>
                            <span>Không biết cách lấy Key? </span>
                            <a href="https://tinyurl.com/hdsdpmTHT" target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">Xem hướng dẫn chi tiết</a>
                        </p>
                    </section>

                    {/* Model Selection */}
                    <section>
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 block">
                            Chọn Model AI Mặc Định
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {AVAILABLE_MODELS.map((model) => (
                                <div
                                    key={model.id}
                                    onClick={() => setLocalModel(model.id)}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${localModel === model.id
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-slate-100 hover:border-primary/30 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`material-symbols-outlined ${localModel === model.id ? 'text-primary' : 'text-slate-400'}`}>
                                            {model.id.includes('flash') ? 'bolt' : 'psychology'}
                                        </span>
                                        <h4 className={`font-bold text-sm ${localModel === model.id ? 'text-primary' : 'text-slate-700'}`}>
                                            {model.name}
                                        </h4>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1  text-[10px] text-slate-500">
                                            <span className="material-symbols-outlined text-[10px]">speed</span>
                                            <span>Tốc độ: {model.id.includes('flash') ? "Rất nhanh" : "Trung bình"}</span>
                                        </div>
                                        <div className="flex items-center gap-1  text-[10px] text-slate-500">
                                            <span className="material-symbols-outlined text-[10px]">memory</span>
                                            <span>Logic: {model.id.includes('pro') ? "Cao" : "Khá"}</span>
                                        </div>
                                    </div>
                                    {localModel === model.id && (
                                        <div className="absolute top-2 right-2 text-primary">
                                            <span className="material-symbols-outlined">check_circle</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined">autorenew</span>
                            Cơ chế Fallback (Tự động)
                        </h4>
                        <p className="text-xs text-blue-600 leading-relaxed">
                            Hệ thống sẽ tự động chuyển đổi sang các model dự phòng
                            ({AVAILABLE_MODELS.map(m => m.name).join(' → ')})
                            nếu model chính gặp sự cố hoặc hết hạn ngạch.
                        </p>
                    </section>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-bold transition-all">
                        Đóng
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!localKey.trim()}
                        className="px-6 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-bold shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">save</span>
                        Lưu cấu hình
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
