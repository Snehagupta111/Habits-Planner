import React from 'react';
import { motion } from 'framer-motion';

export const EmptyPlannerIllustration: React.FC = () => {
    return (
        <div className="relative w-56 h-48 mx-auto mb-8 flex items-center justify-center mt-12">
            {/* Background glowing orb */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl"
            />

            <div className="absolute w-40 h-40 bg-[#DCECED]/80 rounded-[40px] shadow-inner border border-white/60 rotate-12" />
            <div className="absolute w-40 h-40 bg-white/60 rounded-[40px] shadow-sm border border-white/80 -rotate-3" />

            {/* Glowing Clock */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-32 h-32 bg-secondary rounded-full border-4 border-white shadow-2xl flex items-center justify-center"
            >
                {/* Clock Face Details */}
                <div className="absolute inset-2 rounded-full border border-white/10" />

                {/* Markers */}
                {[0, 90, 180, 270].map((deg) => (
                    <div
                        key={deg}
                        className="absolute w-1 h-3 bg-primary/80 rounded-full"
                        style={{ transform: `rotate(${deg}deg) translateY(-12px)` }}
                    />
                ))}

                {/* Clock Hands */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-1.5 h-10 origin-bottom bg-white rounded-t-full bottom-1/2 left-[calc(50%-3px)]"
                />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-1 h-14 origin-bottom bg-primary rounded-t-full bottom-1/2 left-[calc(50%-2px)] shadow-[0_0_10px_#ddfb40]"
                />

                {/* Center dot */}
                <div className="w-4 h-4 rounded-full bg-white z-20 shadow-sm border-2 border-secondary" />

            </motion.div>

            {/* Floating blocks (tasks) */}
            <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-4 -right-4 w-16 h-8 bg-white rounded-xl shadow-lg border border-neutral-100 flex items-center px-2"
            >
                <div className="w-3 h-3 bg-primary rounded-full mr-2" />
                <div className="w-6 h-2 bg-neutral-200 rounded-full" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute bottom-4 -left-6 w-20 h-8 bg-white rounded-xl shadow-lg border border-neutral-100 flex items-center px-2 z-20"
            >
                <div className="w-3 h-3 bg-amber-400 rounded-full mr-2" />
                <div className="w-10 h-2 bg-neutral-200 rounded-full" />
            </motion.div>
        </div>
    );
};
