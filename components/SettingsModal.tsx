import React, { useState, useRef } from 'react';

interface UserProfile {
    name: string;
    avatar: string;
    school: string;
    address: string;
    subject: string;
    phone: string;
    email: string;
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
    onSave: (profile: UserProfile) => void;
    onLogout: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, profile, onSave, onLogout }) => {
    const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
    const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedProfile(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(editedProfile);
        // Save to localStorage
        localStorage.setItem('stemlab_user_profile', JSON.stringify(editedProfile));
        onClose();
        alert('✅ Đã lưu thông tin thành công!');
    };

    const handleLogout = () => {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            onLogout();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined">settings</span>
                        Cài Đặt Tài Khoản
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'profile'
                                ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm align-middle mr-1">person</span>
                        Thông Tin Cá Nhân
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'account'
                                ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm align-middle mr-1">manage_accounts</span>
                        Tài Khoản
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'profile' && (
                        <div className="space-y-5">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <img
                                        src={editedProfile.avatar || '/teacher_avatar.jpg'}
                                        alt="Avatar"
                                        className="w-28 h-28 rounded-full object-cover border-4 border-teal-100 shadow-lg"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                    >
                                        <span className="material-symbols-outlined">photo_camera</span>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                                >
                                    Thay đổi ảnh đại diện
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={editedProfile.name}
                                    onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Trường
                                </label>
                                <input
                                    type="text"
                                    value={editedProfile.school}
                                    onChange={(e) => setEditedProfile(prev => ({ ...prev, school: e.target.value }))}
                                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    value={editedProfile.address}
                                    onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Môn dạy
                                    </label>
                                    <select
                                        value={editedProfile.subject}
                                        onChange={(e) => setEditedProfile(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                    >
                                        <option value="Vật lý">Vật lý</option>
                                        <option value="Toán học">Toán học</option>
                                        <option value="Hóa học">Hóa học</option>
                                        <option value="Sinh học">Sinh học</option>
                                        <option value="Tin học">Tin học</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        value={editedProfile.phone}
                                        onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editedProfile.email}
                                    onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <h3 className="font-semibold text-slate-800 mb-2">Thông tin tài khoản</h3>
                                <p className="text-sm text-slate-600">Tên đăng nhập: <strong>{profile.name}</strong></p>
                                <p className="text-sm text-slate-600 mt-1">Trạng thái: <span className="text-green-600 font-medium">Đang hoạt động</span></p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">warning</span>
                                    Đổi mật khẩu
                                </h3>
                                <p className="text-sm text-amber-700">Liên hệ quản trị viên để đổi mật khẩu.</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold border-2 border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                Đăng Xuất
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {activeTab === 'profile' && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/30 hover:shadow-xl transition-all"
                        >
                            Lưu Thay Đổi
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsModal;
