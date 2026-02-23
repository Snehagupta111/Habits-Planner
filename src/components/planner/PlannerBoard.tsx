import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, X } from 'lucide-react';

interface PlannerSlot {
    id: string;
    time: string;
    habitId: string | null;
}

export const PlannerBoard: React.FC = () => {
    const { habits } = useHabits();
    const [slots, setSlots] = useState<PlannerSlot[]>([
        { id: 't1', time: '06:00 AM', habitId: null },
        { id: 't2', time: '07:00 AM', habitId: null },
        { id: 't3', time: '08:00 AM', habitId: null },
        { id: 't4', time: '09:00 AM', habitId: null },
        { id: 't5', time: '10:00 AM', habitId: null },
        { id: 't6', time: '11:00 AM', habitId: null },
        { id: 't7', time: '12:00 PM', habitId: null },
        { id: 't8', time: '01:00 PM', habitId: null },
        { id: 't9', time: '02:00 PM', habitId: null },
        { id: 't10', time: '03:00 PM', habitId: null },
        { id: 't11', time: '04:00 PM', habitId: null },
        { id: 't12', time: '05:00 PM', habitId: null },
        { id: 't13', time: '06:00 PM', habitId: null },
        { id: 't14', time: '07:00 PM', habitId: null },
        { id: 't15', time: '08:00 PM', habitId: null },
        { id: 't16', time: '09:00 PM', habitId: null },
    ]);

    const [dragOverSlotId, setDragOverSlotId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, habitId: string) => {
        e.dataTransfer.setData('habitId', habitId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, slotId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverSlotId(slotId);
    };

    const handleDragLeave = () => {
        setDragOverSlotId(null);
    };

    const handleDrop = (e: React.DragEvent, slotId: string) => {
        e.preventDefault();
        const habitId = e.dataTransfer.getData('habitId');
        if (habitId) {
            setSlots(prev =>
                prev.map(s => (s.id === slotId ? { ...s, habitId } : s))
            );
        }
        setDragOverSlotId(null);
    };

    const handleRemove = (slotId: string) => {
        setSlots(prev =>
            prev.map(s => (s.id === slotId ? { ...s, habitId: null } : s))
        );
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Draggable habit chips */}
            <div className="flex gap-3 flex-wrap shrink-0">
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, habit.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ${habit.color} bg-opacity-80 text-white font-medium cursor-grab active:cursor-grabbing shadow-lg hover:scale-105 transition-transform select-none border border-white/10`}
                    >
                        <GripVertical className="w-4 h-4 opacity-50" />
                        {habit.name}
                    </div>
                ))}
            </div>

            {/* Time slots grid */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {slots.map(slot => {
                        const scheduledHabit = habits.find(h => h.id === slot.habitId);
                        const isDragOver = dragOverSlotId === slot.id;

                        return (
                            <motion.div
                                key={slot.id}
                                layout
                                onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, slot.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e as unknown as React.DragEvent, slot.id)}
                                className={`relative flex items-center gap-4 p-4 rounded-2xl border min-h-[4.5rem] transition-all duration-200 ${isDragOver
                                        ? 'bg-emerald-500/10 border-emerald-500/50 scale-[1.01]'
                                        : 'bg-neutral-900/50 border-neutral-800/50 hover:border-neutral-700/50'
                                    }`}
                            >
                                {/* Time label */}
                                <div className="w-20 flex-shrink-0 text-sm font-semibold text-neutral-400 tabular-nums">
                                    {slot.time}
                                </div>

                                {/* Divider */}
                                <div className={`w-px h-10 transition-colors ${isDragOver ? 'bg-emerald-500/50' : 'bg-neutral-800'}`} />

                                {/* Content */}
                                <div className="flex-1 flex items-center">
                                    {scheduledHabit ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className={`px-4 py-2 rounded-xl text-white font-medium inline-flex items-center gap-2 ${scheduledHabit.color} bg-opacity-30 border border-white/10`}
                                        >
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
                                            {scheduledHabit.name}
                                            <button
                                                onClick={() => handleRemove(slot.id)}
                                                className="ml-2 p-0.5 rounded-full hover:bg-white/20 transition-colors"
                                                title="Remove"
                                            >
                                                <X className="w-3.5 h-3.5 text-white/60" />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <div className={`text-sm italic transition-colors ${isDragOver ? 'text-emerald-400' : 'text-neutral-600'}`}>
                                            {isDragOver ? '✦ Drop here...' : 'Drag a habit here...'}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
