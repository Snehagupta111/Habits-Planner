import type { Habit, HabitCompletion } from '../types';

export const MOCK_HABITS: Habit[] = [
    { id: 'h1', name: 'Morning Workout', color: 'bg-emerald-500', icon: null, createdAt: '2026-02-01' },
    { id: 'h2', name: 'Read 20 Mins', color: 'bg-blue-500', icon: null, createdAt: '2026-02-01' },
    { id: 'h3', name: 'Meditate', color: 'bg-violet-500', icon: null, createdAt: '2026-02-01' },
    { id: 'h4', name: 'Drink 2L Water', color: 'bg-cyan-500', icon: null, createdAt: '2026-02-01' },
    { id: 'h5', name: 'Code for 1 Hour', color: 'bg-amber-500', icon: null, createdAt: '2026-02-01' }
];

// Helper to get dates for the past 7 days
const getPastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

export const MOCK_COMPLETIONS: HabitCompletion[] = [
    // Day 6 (Oldest)
    { habitId: 'h1', date: getPastDate(6), completed: true },
    { habitId: 'h2', date: getPastDate(6), completed: true },
    { habitId: 'h3', date: getPastDate(6), completed: true },
    { habitId: 'h4', date: getPastDate(6), completed: true },
    { habitId: 'h5', date: getPastDate(6), completed: true },
    // Day 5
    { habitId: 'h1', date: getPastDate(5), completed: true },
    { habitId: 'h2', date: getPastDate(5), completed: false },
    { habitId: 'h3', date: getPastDate(5), completed: true },
    { habitId: 'h4', date: getPastDate(5), completed: true },
    { habitId: 'h5', date: getPastDate(5), completed: true },
    // Day 4
    { habitId: 'h1', date: getPastDate(4), completed: false },
    { habitId: 'h2', date: getPastDate(4), completed: false },
    { habitId: 'h3', date: getPastDate(4), completed: false },
    { habitId: 'h4', date: getPastDate(4), completed: true },
    { habitId: 'h5', date: getPastDate(4), completed: true },
    // Day 3
    { habitId: 'h1', date: getPastDate(3), completed: true },
    { habitId: 'h2', date: getPastDate(3), completed: true },
    { habitId: 'h3', date: getPastDate(3), completed: false },
    { habitId: 'h4', date: getPastDate(3), completed: true },
    { habitId: 'h5', date: getPastDate(3), completed: true },
    // Day 2
    { habitId: 'h1', date: getPastDate(2), completed: true },
    { habitId: 'h2', date: getPastDate(2), completed: true },
    { habitId: 'h3', date: getPastDate(2), completed: true },
    { habitId: 'h4', date: getPastDate(2), completed: false },
    { habitId: 'h5', date: getPastDate(2), completed: false },
    // Day 1
    { habitId: 'h1', date: getPastDate(1), completed: false },
    { habitId: 'h2', date: getPastDate(1), completed: true },
    { habitId: 'h3', date: getPastDate(1), completed: false },
    { habitId: 'h4', date: getPastDate(1), completed: true },
    { habitId: 'h5', date: getPastDate(1), completed: true },
    // Today (Day 0)
    { habitId: 'h1', date: getPastDate(0), completed: true },
    { habitId: 'h2', date: getPastDate(0), completed: false },
    { habitId: 'h3', date: getPastDate(0), completed: true },
    { habitId: 'h4', date: getPastDate(0), completed: true },
    { habitId: 'h5', date: getPastDate(0), completed: false },
];
