import { motion } from 'framer-motion';
import { Filter, Star, Zap, DollarSign, Clock, MapPin } from 'lucide-react';

const FilterWidget = ({ filters, toggleFilter }) => {

    const categories = [
        { id: 'tier_s', label: 'S-Tier', icon: Star, color: 'text-yellow-400', border: 'border-yellow-400/50' },
        { id: 'tier_a', label: 'A-Tier', icon: Zap, color: 'text-cyan-400', border: 'border-cyan-400/50' },
        { id: 'free_entry', label: 'Free Entry', icon: DollarSign, color: 'text-green-400', border: 'border-green-400/50' },
        { id: 'urgent', label: 'Urgent', icon: Clock, color: 'text-red-500', border: 'border-red-500/50' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            data-testid="filter-bar"
            className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5 backdrop-blur-sm overflow-x-auto scrollbar-hide"
        >
            <div className="flex items-center gap-2 px-3 border-r border-white/10 text-gray-500">
                <Filter size={16} />
                <span className="text-xs font-mono uppercase tracking-widest hidden md:inline">FILTERS</span>
            </div>

            <div className="flex gap-2">
                {categories.map((cat) => {
                    const isActive = filters[cat.id];
                    return (
                        <button
                            key={cat.id}
                            data-testid={`filter-${cat.id}`}
                            onClick={() => toggleFilter(cat.id)}
                            className={`
                                relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300
                                ${isActive
                                    ? `bg-${cat.color.split('-')[1]}-500/10 ${cat.color} ${cat.border} shadow-[0_0_10px_rgba(255,255,255,0.1)]`
                                    : 'bg-white/5 text-gray-500 border border-transparent hover:bg-white/10 hover:text-gray-300'
                                }
                            `}
                        >
                            <cat.icon size={12} className={isActive ? 'animate-pulse' : ''} />
                            {cat.label}

                            {/* Active Indicator Dot */}
                            {isActive && (
                                <span className={`absolute -top-1 -right-1 flex h-2 w-2`}>
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${cat.color.split('-')[1]}-400 opacity-75`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-${cat.color.split('-')[1]}-500`}></span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Special Salvador Presencial Filter ── */}
            <div className="pl-2 border-l border-white/10">
                <button
                    data-testid="filter-salvador"
                    onClick={() => toggleFilter('salvador')}
                    className={`
                        relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300
                        ${filters.salvador
                            ? 'text-white shadow-[0_0_20px_rgba(34,211,238,0.4),0_0_40px_rgba(168,85,247,0.2)] scale-105'
                            : 'text-gray-400 border border-transparent hover:text-white hover:scale-105'
                        }
                    `}
                    style={filters.salvador ? {
                        background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(168,85,247,0.2), rgba(251,191,36,0.2))',
                        border: '1.5px solid transparent',
                        backgroundClip: 'padding-box',
                        boxShadow: '0 0 0 1.5px rgba(34,211,238,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                    } : {
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    <MapPin size={13} className={filters.salvador ? 'text-cyan-400 animate-bounce' : ''} />
                    <span className={filters.salvador
                        ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent font-black'
                        : ''
                    }>
                        🇧🇷 Salvador BA
                    </span>

                    {/* Glowing animated indicator */}
                    {filters.salvador && (
                        <>
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-cyan-400 to-purple-400"></span>
                            </span>
                            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-yellow-400/10 animate-pulse" />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default FilterWidget;
