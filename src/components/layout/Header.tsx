import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
    const { user } = useAuth();

    // Get initials for fallback avatar
    const getInitials = (name: string | null) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="flex items-center justify-between w-full py-3 z-20">
            <div className="flex items-center gap-4 relative z-20">
                {/* 3D Decorative Image */}
                <div className="w-14 h-14 bg-[#DCECED]/50 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-white/60 shrink-0">
                    <img
                        src="/src/assets/hero-decoration.png"
                        alt="3D Theme Decoration"
                        className="w-[120%] h-[120%] object-cover scale-110 drop-shadow-sm mix-blend-multiply"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black tracking-tight text-black uppercase m-0">
                        Track Your
                    </h2>
                    <div className="relative inline-block w-fit">
                        <div className="absolute inset-0 bg-primary translate-x-1 translate-y-0.5 rounded-sm -z-10" />
                        <h2 className="text-2xl font-black tracking-tight text-black uppercase relative z-10 m-0 px-1.5 py-0.5">
                            HABITS!
                        </h2>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 z-20">
                <div className="flex items-center gap-2.5">
                    {/* Profile avatar — Google photo or initials */}
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName || 'Profile'}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span className="text-xs font-bold text-white">
                                {getInitials(user?.displayName || null)}
                            </span>
                        )}
                    </div>
                    <div className="hidden sm:block">
                        <h3 className="text-sm font-bold text-black leading-tight">
                            {user?.displayName || 'User'}
                        </h3>
                        <p className="text-[10px] font-semibold text-secondary flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                            Premium
                        </p>
                    </div>
                </div>

                <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-black hover:bg-neutral-200 transition-colors">
                    <Bell className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
};
