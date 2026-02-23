import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Habit, HabitCompletion, AIInsightResponse } from '../types';

const GEMINI_API_KEY = 'AIzaSyD9QTrnTn6oZPpCI0ezxDo6bf2k8D_F9eA';

export const analyzeHabits = async (
    habits: Habit[],
    completions: HabitCompletion[],
    _apiKey?: string // Optional now, since we'll use the hardcoded one
): Promise<AIInsightResponse> => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const promptData = {
        habits: habits.map(h => ({ id: h.id, name: h.name })),
        completions: completions.map(c => ({
            habitName: habits.find(h => h.id === c.habitId)?.name || 'Unknown',
            date: c.date,
            completed: c.completed,
        })),
    };

    const prompt = `You are an expert productivity coach and data analyst.
Analyze the user's habit completion data for the last 7 days and provide insights.

Here is the habit data in JSON format:
${JSON.stringify(promptData, null, 2)}

Respond ONLY with a valid JSON object (no markdown, no code fences) matching this exact structure:
{
  "summary": "A brief, encouraging 2-sentence summary of their week.",
  "patterns": ["Pattern 1", "Pattern 2"],
  "tips": ["Actionable tip 1", "Actionable tip 2"]
}

Limit patterns and tips to 2 items each. Be concise, actionable, and observant of trends.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Strip markdown code fences if present
        const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

        return JSON.parse(cleaned) as AIInsightResponse;
    } catch (error: any) {
        console.error('Gemini Analysis error:', error);
        throw new Error(error.message || 'Failed to generate insights.');
    }
};
