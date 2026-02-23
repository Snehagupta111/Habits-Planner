import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <aside className="h-full flex flex-col justify-between items-center w-full">
            {/* Navigation Icons go to top now that logo is removed */}
            <nav className="flex-1 flex flex-col items-center gap-6 mt-6">
                <SidebarIcon to="/" icon={<LayoutDashboard />} active={location.pathname === '/'} />
                <SidebarIcon to="/planner" icon={<CalendarDays />} active={location.pathname === '/planner'} />
            </nav>

            {/* Bottom Actions */}
            <div className="pb-6 flex flex-col gap-6">
                <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>
        </aside>
    );
};

const SidebarIcon = ({ to, icon, active }: { to: string; icon: React.ReactNode; active: boolean }) => (
    <NavLink
        to={to}
        className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 [&>svg]:w-5 [&>svg]:h-5 ${active
            ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
            : 'text-neutral-400 hover:bg-neutral-100 hover:text-black'
            }`}
    >
        {icon}
    </NavLink>
);
