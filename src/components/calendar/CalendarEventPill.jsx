import { motion } from 'framer-motion';
import { TIER_COLORS } from '../../data/contestData';

const CalendarEventPill = ({ event, onClick }) => {

    const tierColor = TIER_COLORS[event.tier] || TIER_COLORS['C'];
    const isUrgent = event.urgencyScore >= 75;

    return (
        <motion.button
            layoutId={`event-${event.id}`}
            data-testid={`event-pill-${event.id}`}
            title={event.title}
            onClick={(e) => {
                e.stopPropagation();
                onClick(event);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 1,
                scale: 1,
                boxShadow: isUrgent ? `0 0 5px ${tierColor}` : 'none'
            }}
            whileHover={{
                scale: 1.05,
                backgroundColor: tierColor,
                color: '#000',
                zIndex: 10
            }}
            className="w-full text-left mb-1 px-1.5 py-0.5 rounded text-[9px] font-mono truncate transition-colors relative overflow-hidden group"
            style={{
                backgroundColor: `${tierColor}15`, // Very subtle background
                borderLeft: `2px solid ${tierColor}`,
                color: 'rgba(255,255,255,0.8)'
            }}
        >
            {/* Optional: Tiny dot for urgency */}
            {isUrgent && (
                <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            )}

            <span className="relative z-10 font-medium tracking-tight group-hover:font-bold">
                {event.title}
            </span>
        </motion.button>
    );
};

export default CalendarEventPill;
