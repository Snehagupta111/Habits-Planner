import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Habit, HabitCompletion, TimeSlot } from '../types';
import { MOCK_COMPLETIONS, MOCK_HABITS } from '../data/mockHabits';
import { useAuth } from './AuthContext';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    onSnapshot,
    writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface HabitContextType {
    habits: Habit[];
    completions: HabitCompletion[];
    timeSlots: TimeSlot[];
    apiKey: string | null;
    setApiKey: (key: string) => void;
    removeApiKey: () => void;
    toggleCompletion: (habitId: string, date: string) => void;
    updateTimeSlots: (slots: TimeSlot[]) => void;
    addHabit: (name: string, color: string, icon?: string) => void;
    deleteHabit: (habitId: string) => void;
    getStreak: (habitId: string) => number;
    getBestStreak: () => number;
    getWeeklyCompletionData: () => { day: string; date: string; completed: number; total: number }[];
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

// --- localStorage helpers ---
const loadFromStorage = <T,>(key: string, fallback: T): T => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
};

const saveToStorage = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const [habits, setHabits] = useState<Habit[]>(() => loadFromStorage('cognitrack_habits', MOCK_HABITS));
    const [completions, setCompletions] = useState<HabitCompletion[]>(() => loadFromStorage('cognitrack_completions', MOCK_COMPLETIONS));
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [apiKey, setApiKeyState] = useState<string | null>(() => localStorage.getItem('gemini_key'));
    const [firestoreReady, setFirestoreReady] = useState(false);

    // ─── Migrate localStorage data to Firestore on first login ─────
    useEffect(() => {
        if (!user) {
            setFirestoreReady(false);
            return;
        }

        const migrateAndSubscribe = async () => {
            const uid = user.uid;
            const habitsRef = collection(db, 'users', uid, 'habits');
            const completionsRef = collection(db, 'users', uid, 'completions');

            // Check if user already has data in Firestore
            const existingHabits = await getDocs(habitsRef);

            if (existingHabits.empty) {
                // First login — migrate localStorage data to Firestore
                const localHabits = loadFromStorage<Habit[]>('cognitrack_habits', MOCK_HABITS);
                const localCompletions = loadFromStorage<HabitCompletion[]>('cognitrack_completions', MOCK_COMPLETIONS);

                const batch = writeBatch(db);
                localHabits.forEach((h) => {
                    batch.set(doc(habitsRef, h.id), h);
                });
                localCompletions.forEach((c) => {
                    const compId = `${c.habitId}_${c.date}`;
                    batch.set(doc(completionsRef, compId), c);
                });
                await batch.commit();
            }

            setFirestoreReady(true);
        };

        migrateAndSubscribe();
    }, [user]);

    // ─── Subscribe to Firestore in real-time ────────────────────────
    useEffect(() => {
        if (!user || !firestoreReady) return;

        const uid = user.uid;
        const habitsRef = collection(db, 'users', uid, 'habits');
        const completionsRef = collection(db, 'users', uid, 'completions');

        // Subscribe to habits
        const unsubHabits = onSnapshot(habitsRef, (snapshot) => {
            const firestoreHabits: Habit[] = [];
            snapshot.forEach((docSnap) => {
                firestoreHabits.push(docSnap.data() as Habit);
            });
            setHabits(firestoreHabits);
            saveToStorage('cognitrack_habits', firestoreHabits); // Keep localStorage as fallback
        });

        // Subscribe to completions
        const unsubCompletions = onSnapshot(completionsRef, (snapshot) => {
            const firestoreCompletions: HabitCompletion[] = [];
            snapshot.forEach((docSnap) => {
                firestoreCompletions.push(docSnap.data() as HabitCompletion);
            });
            setCompletions(firestoreCompletions);
            saveToStorage('cognitrack_completions', firestoreCompletions);
        });

        return () => {
            unsubHabits();
            unsubCompletions();
        };
    }, [user, firestoreReady]);

    // Persist locally when not logged in
    useEffect(() => {
        if (!user) {
            saveToStorage('cognitrack_habits', habits);
        }
    }, [habits, user]);

    useEffect(() => {
        if (!user) {
            saveToStorage('cognitrack_completions', completions);
        }
    }, [completions, user]);

    const setApiKey = (key: string) => {
        localStorage.setItem('gemini_key', key);
        setApiKeyState(key);
    };

    const removeApiKey = () => {
        localStorage.removeItem('gemini_key');
        setApiKeyState(null);
    };

    const toggleCompletion = async (habitId: string, date: string) => {
        const existing = completions.find(c => c.habitId === habitId && c.date === date);
        const newCompleted = existing ? !existing.completed : true;
        const compId = `${habitId}_${date}`;

        // Optimistic local update
        setCompletions(prev => {
            if (existing) {
                return prev.map(c => c === existing ? { ...c, completed: newCompleted } : c);
            }
            return [...prev, { habitId, date, completed: true }];
        });

        // Sync to Firestore if logged in
        if (user) {
            try {
                await setDoc(
                    doc(db, 'users', user.uid, 'completions', compId),
                    { habitId, date, completed: newCompleted }
                );
            } catch (err) {
                console.error('Failed to sync completion to Firestore:', err);
            }
        }
    };

    const addHabit = async (name: string, color: string, icon?: string) => {
        const newHabit: Habit = {
            id: `h_${Date.now()}`,
            name,
            color,
            icon: icon || null, // Firebase doesn't accept undefined
            createdAt: new Date().toISOString().split('T')[0],
        };

        // Optimistic local update
        setHabits(prev => [...prev, newHabit]);

        // Sync to Firestore if logged in
        if (user) {
            try {
                await setDoc(
                    doc(db, 'users', user.uid, 'habits', newHabit.id),
                    newHabit
                );
            } catch (err) {
                console.error('Failed to sync new habit to Firestore:', err);
            }
        }
    };

    const deleteHabit = async (habitId: string) => {
        // Optimistic local update
        setHabits(prev => prev.filter(h => h.id !== habitId));
        setCompletions(prev => prev.filter(c => c.habitId !== habitId));

        // Sync to Firestore if logged in
        if (user) {
            try {
                await deleteDoc(doc(db, 'users', user.uid, 'habits', habitId));

                // Also delete related completions
                const completionsRef = collection(db, 'users', user.uid, 'completions');
                const snapshot = await getDocs(completionsRef);
                const batch = writeBatch(db);
                snapshot.docs
                    .filter(d => (d.data() as HabitCompletion).habitId === habitId)
                    .forEach(d => batch.delete(d.ref));
                await batch.commit();
            } catch (err) {
                console.error('Failed to delete habit from Firestore:', err);
            }
        }
    };

    // Calculate current streak for a specific habit (consecutive days ending today/yesterday)
    const getStreak = useCallback((habitId: string): number => {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const wasCompleted = completions.some(c => c.habitId === habitId && c.date === dateStr && c.completed);
            if (wasCompleted) {
                streak++;
            } else if (i > 0) {
                // Allow today to be incomplete, but any previous gap breaks the streak
                break;
            }
        }
        return streak;
    }, [completions]);

    // Get the best active streak across all habits
    const getBestStreak = useCallback((): number => {
        if (habits.length === 0) return 0;
        return Math.max(...habits.map(h => getStreak(h.id)));
    }, [habits, getStreak]);

    // Get completion data for the last 7 days
    const getWeeklyCompletionData = useCallback(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result: { day: string; date: string; completed: number; total: number }[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = days[d.getDay()];
            const dayCompletions = completions.filter(c => c.date === dateStr && c.completed);
            result.push({
                day: dayName,
                date: dateStr,
                completed: dayCompletions.length,
                total: habits.length,
            });
        }
        return result;
    }, [completions, habits]);

    const updateTimeSlots = (slots: TimeSlot[]) => {
        setTimeSlots(slots);
    };

    return (
        <HabitContext.Provider value={{
            habits, completions, timeSlots, apiKey,
            setApiKey, removeApiKey, toggleCompletion, updateTimeSlots,
            addHabit, deleteHabit, getStreak, getBestStreak, getWeeklyCompletionData
        }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (context === undefined) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
};
