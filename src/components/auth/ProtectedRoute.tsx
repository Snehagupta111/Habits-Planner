import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="flex flex-col items-center gap-4">
                    {/* Animated spinner */}
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-4 border-neutral-100" />
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-neutral-400 tracking-wide">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
