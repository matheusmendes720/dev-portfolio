import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Trophy, ChevronDown, ChevronUp, TrendingUp, Timer, AlertTriangle } from "lucide-react";
import { TIER_COLORS } from "../../data/contestData";

export function EventCard({ event }) {
    const [isOpen, setIsOpen] = useState(false);

    // Determine neon color based on Tier
    const tierColor = TIER_COLORS[event.tier] || TIER_COLORS['C'];
    const isTopTier = event.tier === 'S';

    // Dynamic glow styles - using the variable in the style prop to fix lint
    const glowShadow = isOpen
        ? `0 0 30px ${tierColor}40` // intense when open
        : `0 0 15px ${tierColor}20`; // subtle when closed

    // Urgency Logic
    const isUrgent = event.urgencyScore >= 75;
    const pulseAnimation = isUrgent ? { boxShadow: [`0 0 0px ${tierColor}`, `0 0 20px ${tierColor}`, `0 0 0px ${tierColor}`] } : {};
    const urgencyColor = event.urgencyScore >= 75 ? '#ff003c' : (event.urgencyScore >= 50 ? '#f9ca24' : '#00d2ff');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, ...pulseAnimation }}
            transition={{ duration: isUrgent ? 2 : 0.3, repeat: isUrgent ? Infinity : 0 }}
            whileHover={{ scale: 1.01, boxShadow: `0 0 25px ${tierColor}30` }}
            onClick={() => setIsOpen(!isOpen)}
            style={{
                borderColor: `${tierColor}50`,
                boxShadow: glowShadow
            }}
            className={`
        relative cursor-pointer rounded-xl p-5 mb-4
        bg-black/40 backdrop-blur-xl border-l-[3px] border-y border-r
        transition-all duration-300 overflow-hidden
      `}
        >
            {/* Header Section */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-70" style={{ color: tierColor }}>
                            {event.category || event.tags[0]}
                        </span>
                        {isTopTier && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded flex items-center gap-1">
                                <Trophy size={8} /> S-TIER
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg md:text-xl font-bold font-display text-white leading-tight">
                        {event.title}
                    </h3>

                    <div className="flex items-center gap-4 mt-2 text-xs md:text-sm font-mono text-gray-400">
                        <span className="flex items-center gap-1.5"><Calendar size={12} style={{ color: tierColor }} /> {event.date}</span>
                        <span className="hidden md:flex items-center gap-1.5"><MapPin size={12} /> {event.location}</span>
                        {event.roiScore > 80 && (
                            <span className="flex items-center gap-1 text-neon-green font-bold">
                                <TrendingUp size={12} /> ROI: {event.roiScore}
                            </span>
                        )}
                        {event.daysToStart > 0 && event.daysToStart <= 30 && (
                            <span className="flex items-center gap-1 font-bold animate-pulse" style={{ color: urgencyColor }}>
                                <Timer size={12} /> {event.daysToStart} DAYS LEFT
                            </span>
                        )}
                    </div>
                </div>

                {/* Action / State Indicator */}
                <div className="flex flex-col items-end gap-2">
                    <button
                        className={`
                    p-2 rounded-full border transition-colors duration-300
                    flex items-center justify-center
                `}
                        style={{
                            borderColor: isOpen ? tierColor : 'rgba(255,255,255,0.1)',
                            backgroundColor: isOpen ? `${tierColor}20` : 'transparent',
                            color: isOpen ? 'white' : 'gray'
                        }}
                    >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expandable Details Section */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pt-4 border-t border-white/10 grid md:grid-cols-3 gap-4 text-sm font-mono">

                            <div className="col-span-2 space-y-2">
                                <p className="text-gray-300 leading-relaxed font-sans">{event.description}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {event.tags?.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 uppercase tracking-wider">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 bg-black/20 p-3 rounded-lg border border-white/5">
                                <div>
                                    <span className="block text-[10px] text-gray-500 uppercase">Cost</span>
                                    <span className="text-white">{event.cost}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-gray-500 uppercase">Organizer</span>
                                    <span className="text-white">{event.organizer}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-gray-500 uppercase">Status</span>
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${event.status === 'upcoming' ? 'text-neon-green bg-neon-green/10' : 'text-gray-500 bg-gray-500/10'
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(event.link, '_blank');
                                }}
                                className="col-span-1 md:col-span-3 mt-2 w-full py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 text-neon-purple text-xs font-bold tracking-widest uppercase rounded transition-colors"
                            >
                                REGISTER_NOW :: EXTERNAL_LINK
                            </button>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
