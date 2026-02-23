export interface Habit {
    id: string;
    name: string;
    color: string;
    icon: string | null;
    createdAt: string;
}

export interface HabitCompletion {
    habitId: string;
    date: string; // YYYY-MM-DD
    completed: boolean;
}

export interface TimeSlot {
    id: string;
    habitId: string | null;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    day: string; // YYYY-MM-DD
}

export interface AIInsightResponse {
    summary: string;
    patterns: string[];
    tips: string[];
}
