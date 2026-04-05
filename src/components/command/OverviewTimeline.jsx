import { motion } from 'framer-motion';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { TIER_COLORS } from '../../data/contestData';

/**
 * OverviewTimeline — Horizontal lanes showing all subscribed competitions
 * across the year. Built with a custom lightweight renderer (no additional
 * deps) using percentage-based positioning from date math.
 * Shows week / month / quarter / year range views.
 */
const RANGE_OPTIONS = ['Week', 'Month', 'Quarter', 'Year'];

const toDate = (s) => new Date(s);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const OverviewTimeline = ({ range = 'Month', selectedId, onSelect }) => {
    const { subscribedEvents } = useSubscriptions();

    const now = new Date();

    // Compute view window based on range
    const getWindow = () => {
        const start = new Date(now);
        const end = new Date(now);
        start.setHours(0, 0, 0, 0);
        switch (range) {
            case 'Week':
                start.setDate(start.getDate() - start.getDay());
                end.setDate(start.getDate() + 7);
                break;
            case 'Month':
                start.setDate(1);
                end.setMonth(start.getMonth() + 1, 0);
                break;
            case 'Quarter': {
                const q = Math.floor(start.getMonth() / 3);
                start.setMonth(q * 3, 1);
                end.setMonth(q * 3 + 3, 0);
                break;
            }
            case 'Year':
            default:
                start.setMonth(0, 1);
                end.setMonth(12, 0);
        }
        return { start, end };
    };

    const { start: winStart, end: winEnd } = getWindow();
    const winMs = winEnd.getTime() - winStart.getTime();

    const pct = (date) => clamp(
        ((toDate(date).getTime() - winStart.getTime()) / winMs) * 100,
        0, 100
    );

    const WIDTH_PCT = (s, e) => {
        const left = pct(s);
        const right = pct(e || s);
        return { left: `${left}%`, width: `${Math.max(right - left, 1)}%` };
    };

    if (subscribedEvents.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 border border-white/5 rounded-2xl bg-black/40 backdrop-blur-xl text-gray-600 font-mono text-[10px] uppercase tracking-widest italic">
                NO_MISSIONS_SYNCED → check_calendar_feed
            </div>
        );
    }

    // Grid line generation
    const gridLines = [];
    if (range === 'Month' || range === 'Week') {
        const totalDays = range === 'Month' ? 30 : 7;
        for (let i = 0; i <= totalDays; i++) {
            const d = new Date(winStart);
            d.setDate(d.getDate() + i);
            gridLines.push(pct(d));
        }
    } else if (range === 'Year') {
        for (let i = 0; i <= 12; i++) {
            const d = new Date(winStart.getFullYear(), i, 1);
            gridLines.push(pct(d));
        }
    }

    return (
        <div className="w-full">
            <div className="relative min-w-[800px] pb-4">
                
                {/* Track Area Container — contains grid lines and today marker */}
                <div className="absolute inset-0 left-44 pointer-events-none">
                    {/* Vertical Grid Lines */}
                    {gridLines.map((pos, i) => (
                        <div key={i} 
                            className="absolute top-0 bottom-0 w-px border-l border-white/5 opacity-40" 
                            style={{ left: `${pos}%` }} 
                        />
                    ))}
                    
                    {/* TODAY PULSE MARKER */}
                    <div
                        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-neon-green via-neon-green to-transparent z-20"
                        style={{ left: `${pct(now)}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neon-green rounded-full blur-[2px] shadow-[0_0_10px_#10b981]" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    </div>
                </div>

                {/* Timeline Header (Axis) */}
                <div className="relative h-10 mb-6 flex items-center border-b border-white/10 ml-44">
                    {/* Week view: MON, TUE, WED, THU, FRI, SAT, SUN */}
                    {range === 'Week' && Array.from({ length: 7 }, (_, i) => {
                        const d = new Date(winStart);
                        d.setDate(d.getDate() + i);
                        const left = pct(d);
                        return left >= 0 && left < 100 ? (
                            <span key={i}
                                className="absolute text-[8px] font-mono text-gray-600 uppercase tracking-tighter"
                                style={{ left: `${left}%` }}
                            >
                                {d.toLocaleString('en', { weekday: 'short' }).toUpperCase()}
                            </span>
                        ) : null;
                    })}

                    {/* Month view: 01, 08, 15, 22 with month abbreviation */}
                    {range === 'Month' && Array.from({ length: 4 }, (_, i) => {
                        const d = new Date(winStart);
                        d.setDate(d.getDate() + (i * 7));
                        const left = pct(d);
                        return left >= 0 && left < 100 ? (
                            <span key={i}
                                className="absolute text-[8px] font-mono text-gray-600 uppercase tracking-tighter"
                                style={{ left: `${left}%` }}
                            >
                                {d.toLocaleDateString('en', { day: '2-digit', month: 'short' }).toUpperCase()}
                            </span>
                        ) : null;
                    })}

                    {/* Quarter view: month start markers with abbreviations */}
                    {range === 'Quarter' && Array.from({ length: 3 }, (_, i) => {
                        const d = new Date(winStart);
                        d.setMonth(d.getMonth() + i, 1);
                        const left = pct(d);
                        return left >= 0 && left < 100 ? (
                            <span key={i}
                                className="absolute text-[8px] font-mono text-gray-600 uppercase tracking-tighter"
                                style={{ left: `${left}%` }}
                            >
                                {d.toLocaleString('en', { month: 'short' })}
                            </span>
                        ) : null;
                    })}

                    {/* Year view: all 12 months (already implemented) */}
                    {range === 'Year' && Array.from({ length: 12 }, (_, i) => {
                        const d = new Date(winStart.getFullYear(), i, 1);
                        const left = pct(d);
                        return left >= 0 && left < 100 ? (
                            <span key={i}
                                className="absolute text-[8px] font-mono text-gray-600 uppercase tracking-tighter"
                                style={{ left: `${left}%` }}
                            >
                                {d.toLocaleString('en', { month: 'short' })}
                            </span>
                        ) : null;
                    })}
                </div>

                {/* Event lanes */}
                <div className="space-y-3">
                    {subscribedEvents.map(evt => {
                        const color = TIER_COLORS[evt.tier] || '#6b7280';
                        const isSelected = selectedId === evt.id;
                        const barStyle = WIDTH_PCT(evt.date, evt.endDate || evt.date);

                        return (
                            <div key={evt.id} className="relative flex items-center h-12 group transition-all">
                                {/* Mission Label (Sticky Sidebar Effect) */}
                                <div className="w-40 shrink-0 pr-6 text-right truncate">
                                    <span className={`text-[10px] font-mono font-bold uppercase tracking-tight transition-all duration-300 ${isSelected ? 'text-neon-green scale-105' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                        {evt.title}
                                    </span>
                                    <div className="flex justify-end gap-1 mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: color }} />
                                    </div>
                                </div>

                                {/* Track Area */}
                                <div className="relative flex-1 h-6">
                                    <button
                                        onClick={() => onSelect(evt.id)}
                                        title={evt.title}
                                        className={`absolute h-full rounded-lg transition-all duration-500 ease-out cursor-pointer overflow-hidden border backdrop-blur-md group/bar ${
                                            isSelected ? 'z-10 scale-y-110 shadow-[0_0_25px_rgba(var(--neon-glow),0.2)]' : 'z-0 border-white/5 hover:border-white/20'
                                        }`}
                                        style={{
                                            ...barStyle,
                                            background: `linear-gradient(90deg, ${color}20 0%, ${color}40 100%)`,
                                            borderColor: isSelected ? color : `${color}15`,
                                            '--neon-glow': color.replace('#', '')
                                        }}
                                    >
                                        {/* Bar Highlight Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-30" />
                                        
                                        {/* Activity Scanline (Subtle) */}
                                        {isSelected && (
                                            <motion.div 
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"
                                            />
                                        )}
                                        
                                        {/* Start Marker */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-current" style={{ color }} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OverviewTimeline;
