import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface ProgressRingProps {
    progress: number;
    size?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ progress, size = 64 }) => {
    const data = [
        { name: 'Completed', value: progress, color: '#0c4f4f' },  // Dark teal (secondary)
        { name: 'Remaining', value: 100 - progress, color: '#e5e5e5' } // Light neutral
    ];

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <PieChart width={size} height={size}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-black text-black">{progress}%</span>
            </div>
        </div>
    );
};
