import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { GripVertical, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

// Color utility: extract the Tailwind color name for light backgrounds
const colorToLightBg: Record<string, string> = {
    'bg-emerald-500': 'bg-emerald-50 border-emerald-200 text-emerald-700',
    'bg-blue-500': 'bg-blue-50 border-blue-200 text-blue-700',
    'bg-violet-500': 'bg-violet-50 border-violet-200 text-violet-700',
    'bg-cyan-500': 'bg-cyan-50 border-cyan-200 text-cyan-700',
    'bg-amber-500': 'bg-amber-50 border-amber-200 text-amber-700',
    'bg-rose-500': 'bg-rose-50 border-rose-200 text-rose-700',
    'bg-pink-500': 'bg-pink-50 border-pink-200 text-pink-700',
    'bg-teal-500': 'bg-teal-50 border-teal-200 text-teal-700',
};

const colorToDot: Record<string, string> = {
    'bg-emerald-500': 'bg-emerald-500',
    'bg-blue-500': 'bg-blue-500',
    'bg-violet-500': 'bg-violet-500',
    'bg-cyan-500': 'bg-cyan-500',
    'bg-amber-500': 'bg-amber-500',
    'bg-rose-500': 'bg-rose-500',
    'bg-pink-500': 'bg-pink-500',
    'bg-teal-500': 'bg-teal-500',
};

// Time slot definitions — compact set to fit viewport
const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00',
];

const formatTime = (t: string) => {
    const [h] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour} ${suffix}`;
};

// localStorage persistence for planner
const STORAGE_KEY = 'cognitrack_planner';
const loadPlanner = (): Record<string, Record<string, string | null>> => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
};
const savePlanner = (data: Record<string, Record<string, string | null>>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const PlannerPage = () => {
    const { habits } = useHabits();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [plannerData, setPlannerData] = useState<Record<string, Record<string, string | null>>>(loadPlanner);
    const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

    const dateKey = selectedDate.toISOString().split('T')[0];
    const daySlots = plannerData[dateKey] || {};

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const goDay = (offset: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + offset);
        setSelectedDate(d);
    };

    const isToday = dateKey === new Date().toISOString().split('T')[0];

    // Assign a habit to a slot
    const assignSlot = (time: string, habitId: string) => {
        const updated = {
            ...plannerData,
            [dateKey]: { ...daySlots, [time]: habitId },
        };
        setPlannerData(updated);
        savePlanner(updated);
    };

    // Remove a habit from a slot
    const removeSlot = (time: string) => {
        const updated = {
            ...plannerData,
            [dateKey]: { ...daySlots, [time]: null },
        };
        setPlannerData(updated);
        savePlanner(updated);
    };

    // Click-to-assign: cycle through habits
    const [showPickerFor, setShowPickerFor] = useState<string | null>(null);

    // Drag handlers
    const handleDragStart = (e: React.DragEvent, habitId: string) => {
        e.dataTransfer.setData('habitId', habitId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent, time: string) => {
        e.preventDefault();
        const habitId = e.dataTransfer.getData('habitId');
        if (habitId) assignSlot(time, habitId);
        setDragOverSlot(null);
    };

    // Count scheduled habits today
    const scheduledCount = Object.values(daySlots).filter(Boolean).length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col lg:flex-row gap-4 overflow-hidden"
        >
            {/* ====== LEFT: Date & Habit Chips ====== */}
            <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4 h-full min-h-0">

                {/* Date Card */}
                <div className="bg-secondary/90 backdrop-blur-md border border-white/20 shadow-sm rounded-2xl p-5 text-white shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={() => goDay(-1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold">{months[selectedDate.getMonth()]}</span>
                        </div>
                        <button onClick={() => goDay(1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center">
                        <span className="text-4xl font-black">{selectedDate.getDate()}</span>
                        <span className="text-lg font-bold ml-2 text-white/60">{days[selectedDate.getDay()]}</span>
                    </div>
                    {isToday && (
                        <div className="mt-2 text-center">
                            <span className="text-xs font-bold bg-primary text-black px-2 py-0.5 rounded-full">Today</span>
                        </div>
                    )}
                    <div className="mt-3 text-center text-xs text-white/50 font-semibold">
                        {scheduledCount} of {TIME_SLOTS.length} slots planned
                    </div>
                </div>

                {/* Habit Chips */}
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
                    <h3 className="text-sm font-black uppercase text-black mb-3 shrink-0">Drag Habits</h3>
                    <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden flex-1 min-h-0 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4d4d4 transparent' }}>
                        {habits.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-[280px] text-center px-4 mt-4 pb-4 w-full">
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, type: 'spring' }}
                                    src="/src/assets/planner-empty.png"
                                    alt="Empty Planner Book"
                                    className="w-48 h-48 object-contain mb-4 drop-shadow-xl"
                                />
                                <h3 className="text-sm font-black text-secondary tracking-tight">Your Planner is Empty</h3>
                                <p className="text-xs font-semibold text-secondary/60 mt-2 max-w-[180px] leading-relaxed">
                                    Create habits on the Dashboard to start planning your perfect day.
                                </p>
                            </div>
                        )}
                        {habits.map(habit => (
                            <div
                                key={habit.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, habit.id)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-grab active:cursor-grabbing transition-all border select-none text-sm font-semibold ${colorToLightBg[habit.color] || 'bg-neutral-50 border-neutral-200 text-neutral-700'}`}
                            >
                                <GripVertical className="w-3.5 h-3.5 opacity-40 shrink-0" />
                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorToDot[habit.color] || 'bg-neutral-500'}`} />
                                <span className="truncate">{habit.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ====== RIGHT: Time Slots Grid ====== */}
            <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
                <div className="flex justify-between items-center mb-3 shrink-0">
                    <h2 className="text-lg font-black uppercase text-black">Daily Schedule</h2>
                    <span className="text-xs font-bold text-neutral-400">{scheduledCount}/{TIME_SLOTS.length} filled</span>
                </div>

                {/* Scrollable time slots */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4d4d4 transparent' }}>
                    <div className="space-y-1.5">
                        {TIME_SLOTS.map(time => {
                            const assignedHabitId = daySlots[time];
                            const assignedHabit = assignedHabitId ? habits.find(h => h.id === assignedHabitId) : null;
                            const isDragOver = dragOverSlot === time;

                            return (
                                <div
                                    key={time}
                                    onDragOver={(e) => { e.preventDefault(); setDragOverSlot(time); }}
                                    onDragLeave={() => setDragOverSlot(null)}
                                    onDrop={(e) => handleDrop(e, time)}
                                    onClick={() => {
                                        if (!assignedHabit) setShowPickerFor(showPickerFor === time ? null : time);
                                    }}
                                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer min-h-[44px] ${isDragOver
                                        ? 'bg-primary/20 border-primary/50 scale-[1.005]'
                                        : assignedHabit
                                            ? 'bg-white/80 border-white/60 shadow-sm'
                                            : 'bg-white/30 border-white/40 hover:bg-white/50 hover:border-white/50 shadow-sm'
                                        }`}
                                >
                                    {/* Time label */}
                                    <div className="w-14 shrink-0 text-xs font-bold text-neutral-400 tabular-nums">
                                        {formatTime(time)}
                                    </div>

                                    {/* Divider */}
                                    <div className={`w-px h-6 ${isDragOver ? 'bg-primary/40' : 'bg-neutral-200'}`} />

                                    {/* Content */}
                                    <div className="flex-1 flex items-center min-w-0">
                                        <AnimatePresence mode="wait">
                                            {assignedHabit ? (
                                                <motion.div
                                                    key={assignedHabit.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${colorToLightBg[assignedHabit.color] || 'bg-neutral-50 border-neutral-200 text-neutral-700'}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${colorToDot[assignedHabit.color] || 'bg-neutral-500'}`} />
                                                    <span className="truncate">{assignedHabit.name}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeSlot(time); }}
                                                        className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors shrink-0"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <span className={`text-xs italic ${isDragOver ? 'text-secondary font-semibold' : 'text-neutral-400'}`}>
                                                    {isDragOver ? '✦ Drop here' : 'Click or drag to assign'}
                                                </span>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Click-to-assign picker */}
                                    {showPickerFor === time && !assignedHabit && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute left-20 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-neutral-200 p-2 min-w-[180px]"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {habits.map(h => (
                                                <button
                                                    key={h.id}
                                                    onClick={() => { assignSlot(time, h.id); setShowPickerFor(null); }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-black hover:bg-neutral-50 transition-colors text-left"
                                                >
                                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorToDot[h.color] || 'bg-neutral-500'}`} />
                                                    <span className="truncate">{h.name}</span>
                                                </button>
                                            ))}
                                            {habits.length === 0 && (
                                                <p className="text-xs text-neutral-400 px-3 py-2">No habits available</p>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
