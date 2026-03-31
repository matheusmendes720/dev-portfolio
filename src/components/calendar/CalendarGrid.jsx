import { motion } from 'framer-motion';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, format } from 'date-fns';
import { parseYYYYMMDD } from '../../utils/dateUtils';
import CalendarEventPill from './CalendarEventPill';

const CalendarGrid = ({ currentDate, events, onEventClick, onDateClick, selectedDate }) => {
    // 1. Calculate the grid range
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";

    // Generate all days in the view
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Weekday Headers
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="w-full" data-testid="calendar-grid">
            {/* Headers */}
            <div className="grid grid-cols-7 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center font-mono text-xs text-gray-500 uppercase tracking-widest py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                key={currentDate.toString()} // Trigger animation on month change
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-7 gap-1 md:gap-2 auto-rows-fr bg-black/20 p-2 rounded-xl border border-white/5 backdrop-blur-sm shadow-xl"
            >
                {allDays.map((day) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isDayToday = isToday(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    // Filter events for this day
                    const dayEvents = events.filter(evt => isSameDay(parseYYYYMMDD(evt.date), day));

                    return (
                        <div
                            key={day.toString()}
                            data-testid={`day-cell-${format(day, 'yyyy-MM-dd')}`}
                            onClick={() => {
                                if (isCurrentMonth && onDateClick) onDateClick(day);
                            }}
                            className={`
                                min-h-[100px] md:min-h-[140px] p-2 rounded-lg border transition-all duration-300 relative group overflow-hidden
                                ${isCurrentMonth ? 'bg-white/5 border-white/5 hover:border-white/20 cursor-pointer' : 'bg-transparent border-transparent opacity-30'}
                                ${isDayToday ? 'ring-1 ring-neon-purple shadow-[0_0_15px_rgba(109,40,217,0.2)]' : ''}
                                ${isSelected ? 'ring-2 ring-neon-green shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-neon-green/5 border-neon-green/20' : ''}
                            `}
                        >
                            {/* Date Number */}
                            <span className={`
                                text-sm font-mono block mb-2
                                ${isSelected ? 'text-neon-green font-bold' : isDayToday ? 'text-neon-purple font-bold' : 'text-gray-400'}
                            `}>
                                {format(day, dateFormat)}
                            </span>

                            {/* Events Container */}
                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                                {dayEvents.slice(0, 3).map(evt => (
                                    <CalendarEventPill key={evt.id} event={evt} onClick={onEventClick} />
                                ))}
                                {dayEvents.length > 3 && (
                                    <span className="text-[9px] text-gray-500 pl-1">
                                        + {dayEvents.length - 3} more
                                    </span>
                                )}
                            </div>

                            {/* Hover glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/0 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default CalendarGrid;
