import React, { useState } from 'react';
import { setApiKey, getApiKey, removeApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    canClose?: boolean; // Nếu false, user không thể đóng modal mà không nhập key
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, canClose = true }) => {
    const [apiKey, setApiKeyState] = useState(getApiKey() || '');
    const [error, setError] = useState('');
    const [showKey, setShowKey] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!apiKey.trim()) {
            setError('Vui lòng nhập API key');
            return;
        }

        setApiKey(apiKey.trim());
        setError('');
        onSave();
        onClose();
    };

    const handleRemove = () => {
        removeApiKey();
        setApiKeyState('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-teal-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">key</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Cài đặt API Key</h2>
                            <p className="text-white/80 text-sm">Kết nối với Gemini AI</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Gemini API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => {
                                    setApiKeyState(e.target.value);
                                    setError('');
                                }}
                                placeholder="AIza..."
                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-sm transition-all ${error
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-200 focus:border-primary focus:ring-primary/20'
                                    } focus:ring-4 outline-none`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {showKey ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-800 flex items-start gap-2">
                            <span className="material-symbols-outlined text-blue-500 text-lg shrink-0">info</span>
                            <span>
                                Lấy API key miễn phí tại{' '}
                                <a
                                    href="https://aistudio.google.com/apikey"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-bold underline hover:text-blue-600"
                                >
                                    Google AI Studio
                                </a>
                                . API key sẽ được lưu trên trình duyệt của bạn.
                            </span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {canClose && (
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Hủy
                            </button>
                        )}
                        {apiKey && canClose && (
                            <button
                                onClick={handleRemove}
                                className="px-4 py-3 border-2 border-red-200 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                                title="Xóa API key"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                        >
                            Lưu & Kích hoạt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
