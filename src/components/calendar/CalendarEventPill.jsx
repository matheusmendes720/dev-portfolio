import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TIER_COLORS } from '../../data/contestData';
import { useSubscriptions } from '../../hooks/useSubscriptions';

const CalendarEventPill = ({ event, onClick }) => {
    const { isSubscribed, toggleSubscription } = useSubscriptions();
    const subscribed = isSubscribed(event.id);
    const tierColor = TIER_COLORS[event.tier] || TIER_COLORS['C'];
    const isUrgent = event.urgencyScore >= 75;

    return (
        <motion.div
            layoutId={`event-${event.id}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 1,
                scale: 1,
                boxShadow: subscribed
                    ? `0 0 8px ${tierColor}`
                    : isUrgent ? `0 0 5px ${tierColor}` : 'none'
            }}
            className="relative w-full group/pill"
        >
            {/* Subscription ring */}
            {subscribed && (
                <motion.div
                    className="absolute inset-0 rounded pointer-events-none"
                    style={{ boxShadow: `0 0 0 1px ${tierColor}80, 0 0 8px ${tierColor}30` }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            <button
                onClick={(e) => { e.stopPropagation(); onClick(event); }}
                title={event.title}
                className="w-full text-left mb-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono truncate relative overflow-hidden"
                style={{
                    backgroundColor: `${tierColor}15`,
                    borderLeft: `2px solid ${tierColor}`,
                    color: 'rgba(255,255,255,0.8)',
                }}
            >
                {isUrgent && (
                    <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
                <span className="relative z-10 font-medium tracking-tight">{event.title}</span>
            </button>

            {/* Star subscribe button — appears on hover */}
            <motion.button
                title={subscribed ? 'Unsubscribe' : 'Subscribe to Command Center'}
                onClick={(e) => { e.stopPropagation(); toggleSubscription(event.id); }}
                className="absolute -top-1 -right-1 z-20 opacity-0 group-hover/pill:opacity-100 transition-opacity p-0.5 rounded-full bg-black/60 border border-white/10 hover:border-white/40"
                whileTap={{ scale: 0.85 }}
            >
                <Star
                    size={9}
                    className={subscribed ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
                />
            </motion.button>
        </motion.div>
    );
};

export default CalendarEventPill;
