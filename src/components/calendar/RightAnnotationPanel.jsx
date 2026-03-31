import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Trophy, TrendingUp, AlertCircle, DollarSign, ExternalLink, Tag, Calendar } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { parseYYYYMMDD } from '../../utils/dateUtils';
import { TIER_COLORS } from '../../data/contestData';
import ButtonGlass from '../glass/ButtonGlass';

const RightAnnotationPanel = ({
    isOpen,
    onClose,
    selectedEvent,
    selectedDate,
    events,
    onEventClick,
}) => {
    // Get events for the selected date
    const dateEvents = selectedDate
        ? events.filter(evt => evt.date && isSameDay(parseYYYYMMDD(evt.date), selectedDate))
        : [];

    // Show event detail or date overview
    const showEventDetail = !!selectedEvent;
    const showDateOverview = !selectedEvent && !!selectedDate;

    return (
        <div
            data-testid="right-panel"
            style={{
                width: isOpen ? '360px' : '0px',
                minWidth: isOpen ? '360px' : '0px',
                transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), min-width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
            }}
            className="h-full relative"
        >
            <div className="w-[360px] h-full flex flex-col bg-black/40 border-l border-white/5 backdrop-blur-xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <span data-testid="right-panel-title" className="text-[10px] font-mono text-neon-purple uppercase tracking-[0.2em]">
                            {showEventDetail ? 'Event::Details' : showDateOverview ? 'Date::Notes' : 'Annotations'}
                        </span>
                    </div>
                    <button
                        data-testid="right-panel-close"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors font-mono text-xs"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <AnimatePresence>
                        {showEventDetail && (
                            <EventDetailView key="event" event={selectedEvent} />
                        )}
                        {showDateOverview && (
                            <DateOverviewView
                                key="date"
                                date={selectedDate}
                                events={dateEvents}
                                onEventClick={onEventClick}
                            />
                        )}
                        {!showEventDetail && !showDateOverview && (
                            <EmptyState key="empty" />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// ─── Event Detail View ───
const EventDetailView = ({ event }) => {
    const tierColor = TIER_COLORS[event.tier] || TIER_COLORS['C'];


    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-5"
        >
            {/* Title & Tier */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                        style={{ backgroundColor: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}
                    >
                        TIER {event.tier}
                    </span>
                    {event.status && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${event.status === 'upcoming' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'bg-gray-500/10 text-gray-500 border border-gray-500/30'
                            }`}>
                            {event.status}
                        </span>
                    )}
                </div>
                <h3 data-testid="event-detail-title" className="text-lg font-display font-bold text-white leading-tight">
                    {event.title}
                </h3>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {event.tags.map(tag => (
                        <span key={tag} className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-sm flex items-center gap-1">
                            <Tag size={8} />#{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Info Cards */}
            <div className="space-y-2">
                <InfoRow icon={Clock} color="#3b82f6" label="DATE & TIME">
                    <span>{event.date}</span>
                    {event.endDate && <span className="text-gray-500"> → {event.endDate}</span>}
                </InfoRow>

                <InfoRow icon={MapPin} color="#10b981" label="LOCATION">
                    {event.location}
                </InfoRow>

                <InfoRow icon={Trophy} color="#f59e0b" label="TIER & COST">
                    Tier {event.tier} • {event.cost}
                </InfoRow>

                {event.organizer && (
                    <InfoRow icon={Calendar} color="#8b5cf6" label="ORGANIZER">
                        {event.organizer}
                    </InfoRow>
                )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
                {event.prizePool > 0 && (
                    <MetricCard
                        icon={DollarSign}
                        label="Prize Pool"
                        value={`$${event.prizePool.toLocaleString()}`}
                        color="text-yellow-400"
                    />
                )}
                {event.roiScore > 0 && (
                    <MetricCard
                        icon={TrendingUp}
                        label="ROI Score"
                        value={`${event.roiScore}%`}
                        color="text-neon-green"
                    />
                )}
                {event.urgencyScore > 0 && (
                    <MetricCard
                        icon={AlertCircle}
                        label="Urgency"
                        value={`${event.urgencyScore}`}
                        color={event.urgencyScore >= 75 ? 'text-red-500' : 'text-yellow-400'}
                    />
                )}
                {event.daysToStart != null && (
                    <MetricCard
                        icon={Clock}
                        label="Days to Start"
                        value={event.daysToStart > 0 ? `${event.daysToStart}d` : 'Active'}
                        color={event.daysToStart <= 7 ? 'text-red-500' : 'text-neon-blue'}
                    />
                )}
            </div>

            {/* Description / Notes */}
            {event.description && event.description !== '1' && event.description !== '3' && (
                <div className="bg-white/3 rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Notes</div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {event.description}
                    </p>
                </div>
            )}

            {/* Action Button */}
            {event.link && event.link !== '#' && (
                <button
                    data-testid="register-link"
                    onClick={() => window.open(event.link, '_blank')}
                    className="w-full py-2.5 bg-neon-purple/15 hover:bg-neon-purple/25 border border-neon-purple/40 text-neon-purple text-xs font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                >
                    <ExternalLink size={14} />
                    REGISTER_NOW
                </button>
            )}
        </motion.div>
    );
};

// ─── Date Overview View ───
const DateOverviewView = ({ date, events, onEventClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-4"
        >
            {/* Date Header */}
            <div className="bg-gradient-to-br from-neon-purple/10 to-transparent p-4 rounded-xl border border-neon-purple/20">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Selected Date</div>
                <div data-testid="date-overview-title" className="text-xl font-display font-bold text-white">
                    {format(date, 'EEEE')}
                </div>
                <div className="text-sm font-mono text-gray-400">
                    {format(date, 'dd MMMM yyyy')}
                </div>
                <div className="text-[10px] font-mono text-neon-purple mt-2">
                    {events.length} event{events.length !== 1 ? 's' : ''} on this date
                </div>
            </div>

            {/* Events List */}
            {events.length > 0 ? (
                <div className="space-y-2">
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Events</div>
                    {events.map(evt => {
                        const tierColor = TIER_COLORS[evt.tier] || TIER_COLORS['C'];
                        return (
                            <button
                                key={evt.id}
                                onClick={() => onEventClick(evt)}
                                className="w-full text-left p-3 rounded-lg bg-white/3 border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: tierColor, boxShadow: `0 0 6px ${tierColor}60` }}
                                    />
                                    <span className="text-sm font-medium text-white group-hover:text-neon-green transition-colors truncate">
                                        {evt.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono ml-4">
                                    <span>Tier {evt.tier}</span>
                                    <span>•</span>
                                    <span>{evt.location}</span>
                                </div>
                                {evt.description && evt.description !== '1' && evt.description !== '3' && (
                                    <p className="text-[11px] text-gray-400 mt-2 ml-4 line-clamp-2">
                                        {evt.description}
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-600 text-xs font-mono border border-white/5 rounded-lg bg-black/20">
                    NO_EVENTS_ON_THIS_DATE
                </div>
            )}
        </motion.div>
    );
};

// ─── Empty State ───
const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full p-8 text-center"
    >
        <Calendar size={32} className="text-gray-700 mb-4" />
        <div className="text-xs font-mono text-gray-600 uppercase tracking-widest">
            Select a date or event
        </div>
        <div className="text-[10px] font-mono text-gray-700 mt-2">
            Click any day cell or event pill to view details
        </div>
    </motion.div>
);

// ─── Reusable Sub-Components ───
const InfoRow = ({ icon: Icon, color, label, children }) => (
    <div className="flex items-start gap-3 p-2.5 bg-white/3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
        <Icon size={14} style={{ color }} className="mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
            <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">{label}</div>
            <div className="text-xs text-white">{children}</div>
        </div>
    </div>
);

const MetricCard = ({ icon: Icon, label, value, color }) => (
    <div className="p-2.5 bg-white/3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-center gap-1.5 mb-1">
            <Icon size={10} className={color} />
            <span className="text-[8px] text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
        <div className={`text-sm font-bold font-mono ${color}`}>{value}</div>
    </div>
);

export default RightAnnotationPanel;
