import React, { useState } from 'react';

interface LoginModalProps {
    onLogin: (user: { name: string; avatar: string }) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulated login delay
        setTimeout(() => {
            if (username === 'Trần Thị Kim Thoa' && password === '12345') {
                onLogin({
                    name: 'Trần Thị Kim Thoa',
                    avatar: '/teacher_avatar.jpg'
                });
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không đúng!');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Login Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header with Wave */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 pt-8 pb-16 px-8 text-center relative">
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" className="w-full h-12">
                            <path fill="white" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                        </svg>
                    </div>

                    {/* Logo */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-white text-5xl">science</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">STEMLAB</h1>
                    <p className="text-white/80 text-sm mt-1">Phòng thí nghiệm ảo STEM</p>
                </div>

                {/* Form */}
                <div className="px-8 py-6">
                    <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Đăng Nhập</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                <span className="material-symbols-outlined text-sm align-middle mr-1">person</span>
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nhập tên đăng nhập..."
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                <span className="material-symbols-outlined text-sm align-middle mr-1">lock</span>
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu..."
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !username || !password}
                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">login</span>
                                    Đăng Nhập
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        <p>© 2025 STEMLAB - Phòng thí nghiệm ảo</p>
                        <p className="mt-1">Được phát triển bởi Cô Trần Thị Kim Thoa</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
