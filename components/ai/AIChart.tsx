'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTheme } from 'next-themes';

interface AIChartProps {
    jsonStr: string;
}

// Minimal expected schema
interface ChartData {
    type: 'bar' | 'line' | 'area' | 'pie';
    title?: string;
    data: any[];
    config: Record<string, { label: string; color: string }>;
    xAxisKey?: string;
}

export default function AIChart({ jsonStr }: AIChartProps) {
    const { resolvedTheme } = useTheme();

    let parsed: ChartData | null = null;
    try {
        parsed = JSON.parse(jsonStr) as ChartData;
    } catch (e) {
        return (
            <div className="p-4 border border-rose-200 bg-rose-50 text-rose-600 rounded-xl text-sm mt-4">
                <p className="font-bold">Failed to render chart</p>
                <p className="text-xs mt-1">Invalid chart data format.</p>
            </div>
        );
    }

    if (!parsed || !parsed.data || !parsed.config || !parsed.type) {
        return (
            <div className="p-4 border border-rose-200 bg-rose-50 text-rose-600 rounded-xl text-sm mt-4">
                <p className="font-bold">Missing chart data</p>
                <p className="text-xs mt-1">The chart configuration is incomplete.</p>
            </div>
        );
    }

    const { type, title, data, config, xAxisKey = 'name' } = parsed;

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={10} fontSize={10} stroke={resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={10} stroke={resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        {Object.keys(config).map((key) => (
                            <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} maxBarSize={40} />
                        ))}
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={10} fontSize={10} stroke={resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={10} stroke={resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        {Object.keys(config).map((key) => (
                            <Line key={key} type="monotone" dataKey={key} stroke={`var(--color-${key})`} strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        ))}
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={data}>
                        <defs>
                            {Object.keys(config).map((key) => (
                                <linearGradient key={`grad-${key}`} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={10} fontSize={10} stroke={resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={10} stroke={resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        {Object.keys(config).map((key) => (
                            <Area key={key} type="monotone" dataKey={key} stroke={`var(--color-${key})`} strokeWidth={2} fillOpacity={1} fill={`url(#fill-${key})`} />
                        ))}
                    </AreaChart>
                );
            case 'pie':
                const pieDataKey = Object.keys(config)[0]; // Assuming pie chart takes the first config key as the value
                const COLORS = Object.values(config).map(c => c.color);
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey={pieDataKey}
                            nameKey={xAxisKey}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || `var(--color-${pieDataKey})`} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                );
            default:
                return <div className="p-4 text-center text-slate-500">Unsupported chart type</div>;
        }
    };

    const chartElement = renderChart();

    return (
        <div className="w-full my-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {title && (
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/20">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{title}</h4>
                </div>
            )}
            <div className="p-4 w-full" style={{ height: 250 }}>
                {type === 'bar' || type === 'line' || type === 'area' || type === 'pie' ? (
                    <ChartContainer config={config as any} className="w-full h-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height={250}>
                            {chartElement as any}
                        </ResponsiveContainer>
                    </ChartContainer>
                ) : (
                    chartElement
                )}
            </div>
        </div>
    );
}
