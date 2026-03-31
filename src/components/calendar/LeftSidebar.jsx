import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { parseYYYYMMDD } from '../../utils/dateUtils';
import { TIER_COLORS } from '../../data/contestData';
import MiniMonthGrid from './MiniMonthGrid';

const LeftSidebar = ({
    isOpen,
    onToggle,
    events,
    currentDate,
    selectedDate,
    onDateClick,
    onEventClick,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter events by search
    const filteredEvents = useMemo(() => {
        if (!searchQuery.trim()) return events;
        const q = searchQuery.toLowerCase();
        return events.filter(evt =>
            evt.title.toLowerCase().includes(q) ||
            evt.organizer?.toLowerCase().includes(q) ||
            evt.tags?.some(t => t.toLowerCase().includes(q))
        );
    }, [events, searchQuery]);

    // Group events by date label
    const groupedEvents = useMemo(() => {
        const sorted = [...filteredEvents]
            .filter(evt => evt.date) // skip no-date events
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const groups = {};
        sorted.forEach(evt => {
            const evtDate = parseYYYYMMDD(evt.date);
            let label;
            if (isToday(evtDate)) {
                label = `TODAY ${format(evtDate, 'dd/MM')}`;
            } else if (isTomorrow(evtDate)) {
                label = `TOMORROW ${format(evtDate, 'dd/MM')}`;
            } else {
                label = format(evtDate, 'EEE dd MMM').toUpperCase();
            }
            if (!groups[label]) groups[label] = [];
            groups[label].push(evt);
        });
        return groups;
    }, [filteredEvents]);

    return (
        <div
            data-testid="left-sidebar"
            className="h-full relative flex flex-col"
            style={{
                width: isOpen ? '280px' : '0px',
                minWidth: isOpen ? '280px' : '0px',
                transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), min-width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
            }}
        >
            {/* Inner content wrapper */}
            <div className="w-[280px] h-full flex flex-col bg-black/40 border-r border-white/5 backdrop-blur-xl">

                {/* Toggle Button */}
                <div className="flex items-center justify-between p-3 border-b border-white/5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                        Events::List
                    </span>
                    <button
                        data-testid="sidebar-toggle-close"
                        onClick={onToggle}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <PanelLeftClose size={16} />
                    </button>
                </div>

                {/* Mini Calendar */}
                <div className="p-3 border-b border-white/5">
                    <MiniMonthGrid
                        month={currentDate.getMonth()}
                        year={currentDate.getFullYear()}
                        events={events}
                        selectedDate={selectedDate}
                        onDateClick={onDateClick}
                        compact={false}
                    />
                </div>

                {/* Search */}
                <div className="p-3 border-b border-white/5">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            data-testid="sidebar-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 font-mono focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                        />
                    </div>
                </div>

                {/* Event List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-4">
                    {Object.entries(groupedEvents).length > 0 ? (
                        Object.entries(groupedEvents).map(([label, evts]) => (
                            <div key={label}>
                                {/* Date Group Header */}
                                <div className="text-[10px] font-mono text-neon-purple uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                                    <span className="w-2 h-px bg-neon-purple/50" />
                                    {label}
                                </div>

                                {/* Events in group */}
                                <div className="space-y-1.5">
                                    {evts.map(evt => {
                                        const tierColor = TIER_COLORS[evt.tier] || TIER_COLORS['C'];
                                        return (
                                            <button
                                                key={evt.id}
                                                data-testid={`sidebar-event-${evt.id}`}
                                                onClick={() => onEventClick(evt)}
                                                className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/10"
                                            >
                                                {/* Color dot */}
                                                <span
                                                    className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                                                    style={{ backgroundColor: tierColor, boxShadow: `0 0 6px ${tierColor}60` }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs text-white font-medium truncate group-hover/item:text-neon-green transition-colors">
                                                        {evt.title}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                                                        {evt.date && format(parseYYYYMMDD(evt.date), 'h:mm a')} • {evt.location}
                                                    </div>
                                                </div>
                                                {/* Tier badge */}
                                                <span
                                                    className="text-[8px] font-bold px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0"
                                                    style={{ backgroundColor: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}
                                                >
                                                    {evt.tier}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-600 text-xs font-mono">
                            NO_EVENTS_FOUND
                        </div>
                    )}
                </div>

                {/* Footer Count */}
                <div data-testid="sidebar-event-count" className="p-3 border-t border-white/5 text-[10px] font-mono text-gray-600 text-center">
                    {filteredEvents.length} events tracked
                </div>
            </div>
        </div>
    );
};

// Floating toggle button (shown when sidebar is collapsed)
export const SidebarToggleButton = ({ isOpen, onToggle }) => {
    if (isOpen) return null;
    return (
        <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={onToggle}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/60 border border-white/10 rounded-lg backdrop-blur-xl hover:bg-white/10 hover:border-neon-purple/50 text-gray-400 hover:text-neon-purple transition-all shadow-lg"
        >
            <PanelLeftOpen size={18} />
        </motion.button>
    );
};

export default LeftSidebar;
