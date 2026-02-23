import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { HabitItem } from './HabitItem';

interface HabitTrackerProps {
    selectedDate?: string;
}
import { motion } from 'framer-motion';

export const HabitTracker: React.FC<HabitTrackerProps> = ({ selectedDate }) => {
    const { habits, completions, toggleCompletion, deleteHabit } = useHabits();
    const date = selectedDate || new Date().toISOString().split('T')[0];

    return (
        <div className="flex flex-col gap-2 h-full">
            {habits.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-4 w-full">
                    <motion.img
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        src="/src/assets/dashboard-empty.png"
                        alt="Empty Dashboard Calendar"
                        className="w-48 h-48 object-contain mb-6 drop-shadow-xl"
                    />
                    <h3 className="text-lg font-black text-secondary tracking-tight">Your Canvas is Empty</h3>
                    <p className="text-sm font-semibold text-secondary/60 mt-2 max-w-[220px]">
                        Start your journey by adding your very first habit above.
                    </p>
                </div>
            )}
            {habits.map((habit) => {
                const isCompleted = completions.some(c => c.habitId === habit.id && c.date === date && c.completed);
                return (
                    <HabitItem
                        key={habit.id}
                        habit={habit}
                        isCompleted={isCompleted}
                        onToggle={() => toggleCompletion(habit.id, date)}
                        onDelete={() => deleteHabit(habit.id)}
                    />
                );
            })}
        </div>
    );
};
