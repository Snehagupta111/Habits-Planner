import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import type { Habit } from '../../types';

interface HabitItemProps {
    habit: Habit;
    isCompleted: boolean;
    onToggle: () => void;
    onDelete?: () => void;
}

const colorMap: Record<string, { bg: string; text: string; shadow: string; light: string }> = {
    'bg-emerald-500': { bg: 'bg-emerald-500', text: 'text-emerald-600', shadow: 'rgba(16,185,129,0.15)', light: 'bg-emerald-50' },
    'bg-blue-500': { bg: 'bg-blue-500', text: 'text-blue-600', shadow: 'rgba(59,130,246,0.15)', light: 'bg-blue-50' },
    'bg-violet-500': { bg: 'bg-violet-500', text: 'text-violet-600', shadow: 'rgba(139,92,246,0.15)', light: 'bg-violet-50' },
    'bg-cyan-500': { bg: 'bg-cyan-500', text: 'text-cyan-600', shadow: 'rgba(6,182,212,0.15)', light: 'bg-cyan-50' },
    'bg-amber-500': { bg: 'bg-amber-500', text: 'text-amber-600', shadow: 'rgba(245,158,11,0.15)', light: 'bg-amber-50' },
    'bg-rose-500': { bg: 'bg-rose-500', text: 'text-rose-600', shadow: 'rgba(244,63,94,0.15)', light: 'bg-rose-50' },
    'bg-pink-500': { bg: 'bg-pink-500', text: 'text-pink-600', shadow: 'rgba(236,72,153,0.15)', light: 'bg-pink-50' },
    'bg-teal-500': { bg: 'bg-teal-500', text: 'text-teal-600', shadow: 'rgba(20,184,166,0.15)', light: 'bg-teal-50' },
};

export const HabitItem: React.FC<HabitItemProps> = ({ habit, isCompleted, onToggle, onDelete }) => {
    const colors = colorMap[habit.color] || { bg: 'bg-neutral-500', text: 'text-neutral-600', shadow: 'rgba(0,0,0,0.1)', light: 'bg-neutral-50' };

    return (
        <motion.div
            layout
            whileTap={{ scale: 0.98 }}
            className={`
                relative overflow-hidden cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                ${isCompleted
                    ? `border-neutral-200 ${colors.light}`
                    : 'bg-white border-neutral-100 hover:border-neutral-300'
                }
            `}
            style={{
                boxShadow: isCompleted ? `0 2px 12px -2px ${colors.shadow}` : undefined,
            }}
        >
            {/* Clickable area for toggling */}
            <div className="flex items-center gap-4 flex-1 min-w-0" onClick={onToggle}>
                <div
                    className={`
                        relative z-10 flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${isCompleted ? colors.bg + ' border-transparent shadow-md' : 'border-neutral-300 hover:border-neutral-400'}
                    `}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: isCompleted ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                </div>

                <div className="flex-1 relative z-10 min-w-0">
                    <h4 className={`font-semibold transition-colors truncate ${isCompleted ? 'text-black line-through decoration-2 decoration-neutral-300' : 'text-black'}`}>
                        {habit.name}
                    </h4>
                </div>
            </div>

            {/* Delete button */}
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all z-10"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
};
