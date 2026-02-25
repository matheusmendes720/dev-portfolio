import { motion } from 'framer-motion';
import MiniMonthGrid from './MiniMonthGrid';

const YearView = ({ year, events, selectedDate, onMonthClick, onDateClick }) => {
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
        <motion.div
            data-testid="year-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            {/* Year Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-white to-neon-green">
                    {year}
                </h2>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-1">
                    Annual::Overview // {events.length} events tracked
                </p>
            </div>

            {/* 12-Month Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {months.map((month) => {
                    // Filter events for this specific month
                    const monthEvents = events.filter(evt => {
                        if (!evt.date) return false;
                        const d = new Date(evt.date);
                        return d.getMonth() === month && d.getFullYear() === year;
                    });

                    // Calculate density for header badge
                    const density = monthEvents.length;
                    const densityColor = density === 0
                        ? 'text-gray-700'
                        : density <= 3
                            ? 'text-neon-blue'
                            : density <= 7
                                ? 'text-neon-purple'
                                : 'text-neon-green';

                    return (
                        <motion.div
                            key={month}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: month * 0.04 }}
                            className="relative"
                        >
                            {/* Event count badge */}
                            {density > 0 && (
                                <span className={`absolute -top-1 -right-1 z-10 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-black/80 border border-white/10 ${densityColor}`}>
                                    {density}
                                </span>
                            )}
                            <MiniMonthGrid
                                month={month}
                                year={year}
                                events={monthEvents}
                                selectedDate={selectedDate}
                                onMonthClick={onMonthClick}
                                onDateClick={onDateClick}
                                compact={true}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neon-purple/30" />
                    1-2 events
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neon-purple/50 shadow-[0_0_4px_rgba(139,92,246,0.4)]" />
                    3-4 events
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neon-green/40 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                    5+ events
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full ring-1 ring-neon-green/50 bg-transparent" />
                    Today
                </div>
            </div>
        </motion.div>
    );
};

export default YearView;
