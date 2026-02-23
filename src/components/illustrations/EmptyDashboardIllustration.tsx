import React from 'react';
import { motion } from 'framer-motion';

export const EmptyDashboardIllustration: React.FC = () => {
    return (
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
            {/* Background glowing orb */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-primary/30 rounded-full blur-3xl"
            />

            {/* Soft backdrop circle */}
            <div className="absolute w-36 h-36 bg-[#DCECED] rounded-full shadow-inner border border-white/60" />

            {/* Floating Calendar / Document */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
            >
                <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Main card body with glass effect */}
                    <rect x="10" y="15" width="80" height="95" rx="12" fill="white" fillOpacity="0.9" stroke="#E2E8F0" strokeWidth="2" className="shadow-lg drop-shadow-md" />

                    {/* Top binding/header */}
                    <path d="M10 27C10 20.3726 15.3726 15 22 15H78C84.6274 15 90 20.3726 90 27V40H10V27Z" fill="#0c4f4f" />

                    {/* Rings */}
                    <rect x="25" y="5" width="6" height="20" rx="3" fill="#cbd5e1" stroke="#94a3b8" />
                    <rect x="47" y="5" width="6" height="20" rx="3" fill="#cbd5e1" stroke="#94a3b8" />
                    <rect x="69" y="5" width="6" height="20" rx="3" fill="#cbd5e1" stroke="#94a3b8" />

                    {/* Lines for content */}
                    <rect x="25" y="55" width="50" height="6" rx="3" fill="#f1f5f9" />
                    <rect x="25" y="70" width="30" height="6" rx="3" fill="#f1f5f9" />
                    <rect x="25" y="85" width="40" height="6" rx="3" fill="#f1f5f9" />
                </svg>

                {/* Sparkling Lime Green Checkmark (floating in front) */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
                    className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 border-4 border-white"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0c4f4f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </motion.div>

                {/* Sparkles */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-6 -right-6 w-10 h-10 text-primary opacity-80"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4-2.4 7.6-2.4-7.6-7.6-2.4 7.6-2.4C9.6 9.6 12 2 12 2z" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-10 -left-8 w-6 h-6 text-secondary opacity-40"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4-2.4 7.6-2.4-7.6-7.6-2.4 7.6-2.4C9.6 9.6 12 2 12 2z" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
};
