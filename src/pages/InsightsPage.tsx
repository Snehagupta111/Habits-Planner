import { AIAnalyzerCard } from '../components/analyzer/AIAnalyzerCard';
import { motion } from 'framer-motion';

export const InsightsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full bg-emerald-950/20 rounded-3xl border border-emerald-500/10 p-6 flex flex-col overflow-hidden"
        >
            <AIAnalyzerCard />
        </motion.div>
    );
};
