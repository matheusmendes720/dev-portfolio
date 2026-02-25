import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, format, getDay } from 'date-fns';

const MiniMonthGrid = ({ month, year, events = [], selectedDate, onDateClick, onMonthClick, compact = false }) => {
    const currentMonth = new Date(year, month, 1);
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    // Count events per day for density
    const getEventCount = (day) => {
        return events.filter(evt => {
            const evtDate = new Date(evt.date);
            return isSameDay(evtDate, day);
        }).length;
    };

    const getDensityClass = (count) => {
        if (count === 0) return '';
        if (count <= 2) return 'bg-neon-purple/30';
        if (count <= 4) return 'bg-neon-purple/50 shadow-[0_0_6px_rgba(139,92,246,0.4)]';
        return 'bg-neon-green/40 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    };

    const handleClick = () => {
        if (onMonthClick) onMonthClick(currentMonth);
    };

    return (
        <div
            className={`${compact ? 'p-2' : 'p-3'} rounded-xl bg-black/30 border border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-black/40 ${onMonthClick ? 'cursor-pointer group' : ''}`}
            onClick={onMonthClick ? handleClick : undefined}
        >
            {/* Month Header */}
            <div className={`text-center font-mono uppercase tracking-widest mb-2 ${compact ? 'text-[10px]' : 'text-xs'} text-gray-400 group-hover:text-neon-purple transition-colors`}>
                {format(currentMonth, compact ? 'MMM' : 'MMMM')}
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-px mb-1">
                {weekDays.map((day, i) => (
                    <div key={i} className="text-center text-[8px] text-gray-600 font-mono">
                        {day}
                    </div>
                ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-px">
                {allDays.map((day) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isDayToday = isToday(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const eventCount = getEventCount(day);
                    const densityClass = getDensityClass(eventCount);

                    return (
                        <button
                            key={day.toString()}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onDateClick && isCurrentMonth) onDateClick(day);
                            }}
                            disabled={!isCurrentMonth}
                            className={`
                                aspect-square flex items-center justify-center rounded-sm text-[9px] font-mono transition-all relative
                                ${!isCurrentMonth ? 'opacity-15' : 'hover:bg-white/10'}
                                ${isDayToday ? 'text-neon-green font-bold ring-1 ring-neon-green/50' : 'text-gray-400'}
                                ${isSelected ? 'bg-neon-purple/30 text-white ring-1 ring-neon-purple' : ''}
                                ${densityClass}
                            `}
                        >
                            {format(day, 'd')}
                            {/* Event dots */}
                            {eventCount > 0 && !compact && (
                                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-px">
                                    {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                                        <span key={i} className="w-0.5 h-0.5 rounded-full bg-neon-purple" />
                                    ))}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MiniMonthGrid;
