import { useState } from 'react';
import { HabitTracker } from '../components/tracker/HabitTracker';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Plus, X, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

// ============ Add Habit Modal ============
const HABIT_COLORS = [
    'bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-cyan-500',
    'bg-amber-500', 'bg-rose-500', 'bg-pink-500', 'bg-teal-500',
];

const AddHabitModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const { addHabit } = useHabits();
    const [name, setName] = useState('');
    const [color, setColor] = useState(HABIT_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            addHabit(name.trim(), color);
            setName('');
            setColor(HABIT_COLORS[0]);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-black uppercase">New Habit</h2>
                            <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-neutral-600 mb-2">Habit Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Morning Workout, Read 20 Mins..."
                                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all text-base"
                                    autoFocus
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-neutral-600 mb-3">Choose Color</label>
                                <div className="flex gap-3 flex-wrap">
                                    {HABIT_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setColor(c)}
                                            className={`w-10 h-10 rounded-full ${c} transition-all duration-200 ${color === c ? 'ring-4 ring-offset-2 ring-black/20 scale-110' : 'hover:scale-105'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!name.trim()}
                                className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-base hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-secondary/20"
                            >
                                Add Habit
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============ Functional Date Selector ============
const DateSelector = ({ selectedDate, onSelectDate }: { selectedDate: string; onSelectDate: (d: string) => void }) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();

    const dates: { label: string; date: string; dayNum: number; isToday: boolean }[] = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        dates.push({
            label: days[d.getDay()],
            date: dateStr,
            dayNum: d.getDate(),
            isToday: i === 0,
        });
    }

    return (
        <div className="flex gap-1.5 w-full shrink-0">
            {dates.map((d, i) => {
                const isSelected = d.date === selectedDate;
                return (
                    <button
                        key={i}
                        onClick={() => onSelectDate(d.date)}
                        className={`flex flex-col items-center justify-center flex-1 h-[58px] rounded-2xl transition-all duration-200 ${isSelected
                            ? 'bg-primary shadow-md shadow-primary/20'
                            : d.isToday
                                ? 'bg-neutral-200'
                                : 'bg-neutral-100 hover:bg-neutral-200'
                            } cursor-pointer`}
                    >
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-black/60' : 'text-neutral-500'}`}>{d.label}</span>
                        <span className="text-base font-black text-black">{d.dayNum}</span>
                    </button>
                );
            })}
        </div>
    );
};

// ============ Main Dashboard Page ============
export const DashboardPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const { habits, completions, getBestStreak, getWeeklyCompletionData } = useHabits();

    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h =>
        completions.some(c => c.habitId === h.id && c.date === today && c.completed)
    ).length;
    const totalHabits = habits.length;
    const percent = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const bestStreak = getBestStreak();
    const weekData = getWeeklyCompletionData();
    const maxTotal = habits.length || 1;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col lg:flex-row gap-4 overflow-hidden"
            >
                {/* ====== LEFT COLUMN: Overview ====== */}
                <div className="hidden lg:flex lg:w-[38%] flex-col gap-4 h-full min-h-0">

                    {/* Progress Circle Card */}
                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50 flex flex-col items-center flex-1 min-h-0 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

                        <div className="flex justify-between items-start w-full mb-3 z-10">
                            <div>
                                <h2 className="text-lg font-black uppercase text-black">OVERVIEW</h2>
                                <p className="text-xs text-neutral-500 mt-0.5">Daily habit progress</p>
                            </div>
                            <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center shadow-md">
                                <Target className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* SVG Progress Ring */}
                        <div className="flex-1 flex items-center justify-center z-10 w-full">
                            <div className="relative w-36 h-36">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e5e5" strokeWidth="10" />
                                    <circle
                                        cx="50" cy="50" r="42" fill="none" stroke="#0c4f4f" strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={`${percent * 2.64} 264`}
                                        className="transition-all duration-700 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-black">{percent}%</span>
                                    <span className="text-[10px] font-semibold text-neutral-500">Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 flex flex-col items-center justify-center h-[80px]">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span className="text-xl font-black text-black">{bestStreak}</span>
                            </div>
                            <span className="text-[10px] text-neutral-600 font-semibold">Best Streak</span>
                        </div>
                        <div className="bg-primary/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 flex flex-col items-center justify-center h-[80px]">
                            <div className="flex items-center gap-1.5 mb-1">
                                <CheckCircle2 className="w-4 h-4 text-black/70" />
                                <span className="text-xl font-black text-black">{completedToday}/{totalHabits}</span>
                            </div>
                            <span className="text-[10px] text-black/60 font-semibold">Done Today</span>
                        </div>
                    </div>

                    {/* Weekly Chart */}
                    <div className="bg-secondary/90 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0 h-[140px] flex flex-col overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-sm font-black uppercase text-white">WEEKLY</h2>
                            <div className="flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-bold text-white/70">This Week</span>
                            </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-2">
                            {weekData.map((d, i) => {
                                const heightPercent = maxTotal > 0 ? (d.completed / maxTotal) * 100 : 0;
                                const isToday = i === weekData.length - 1;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-1 h-full justify-end w-full">
                                        <span className="text-[9px] font-bold text-white/70">{d.completed}</span>
                                        <div
                                            className={`w-full rounded-full transition-all duration-500 ${isToday ? 'bg-primary' : 'bg-white/15'}`}
                                            style={{ height: `${Math.max(heightPercent, 8)}%` }}
                                        />
                                        <span className="text-[9px] font-bold text-white/50">{d.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ====== RIGHT COLUMN: Habits ====== */}
                <div className="w-full lg:w-[62%] h-full flex flex-col gap-4 min-h-0">

                    {/* Date Selector */}
                    <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                    {/* Habits Card — takes remaining space, scrolls internally */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex justify-between items-center mb-3 shrink-0">
                            <h2 className="text-lg font-black uppercase text-black">
                                YOUR HABITS
                            </h2>
                            <button
                                onClick={() => setAddModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-colors shadow-md shadow-secondary/20"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add
                            </button>
                        </div>

                        {/* Scrollable habit list — ONLY this area scrolls */}
                        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4d4d4 transparent' }}>
                            <HabitTracker selectedDate={selectedDate} />
                        </div>
                    </div>

                </div>
            </motion.div>

            <AddHabitModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
        </>
    );
};
