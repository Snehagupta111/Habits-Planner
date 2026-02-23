import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { analyzeHabits } from '../../services/aiAnalyzer';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import type { AIInsightResponse } from '../../types';
import { motion } from 'framer-motion';

export const AIAnalyzerCard: React.FC = () => {
    const { habits, completions, apiKey } = useHabits();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<AIInsightResponse | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setInsights(null);

        try {
            if (!apiKey) {
                throw new Error("Please add your Gemini API Key in Settings first.");
            }
            const result = await analyzeHabits(habits, completions, apiKey);
            setInsights(result);
            toast({
                title: "Analysis Complete! ✨",
                description: "Your weekly insights are ready.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: error.message || "Something went wrong while communicating with Gemini.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Bot className="w-6 h-6 text-emerald-400" />
                    AI Insights
                </h2>
                <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Analyzing...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Generate Insights
                        </span>
                    )}
                </Button>
            </div>

            <div className="flex-1 bg-black/20 rounded-2xl p-4 overflow-y-auto custom-scrollbar">
                {!insights && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-3">
                        <Bot className="w-12 h-12 opacity-20" />
                        <p className="text-sm">Click generate to analyze your last 7 days of habits.</p>
                    </div>
                )}

                {loading && (
                    <div className="h-full flex flex-col gap-4 animate-pulse pt-2">
                        <div className="h-16 bg-white/5 rounded-xl w-full" />
                        <div className="h-12 bg-white/5 rounded-xl w-3/4" />
                        <div className="h-12 bg-white/5 rounded-xl w-5/6" />
                    </div>
                )}

                {insights && !loading && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } },
                        }}
                        className="space-y-4"
                    >
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <p className="text-emerald-100/90 leading-relaxed italic bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                                "{insights.summary}"
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                                <h4 className="text-sm font-semibold text-neutral-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Patterns Identified
                                </h4>
                                <ul className="space-y-2">
                                    {insights.patterns.map((item, i) => (
                                        <li key={i} className="text-sm text-neutral-300 bg-white/5 p-3 rounded-xl border border-white/5">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                                <h4 className="text-sm font-semibold text-neutral-400 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-400" /> Actionable Tips
                                </h4>
                                <ul className="space-y-2">
                                    {insights.tips.map((item, i) => (
                                        <li key={i} className="text-sm text-neutral-300 bg-white/5 p-3 rounded-xl border border-white/5">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
