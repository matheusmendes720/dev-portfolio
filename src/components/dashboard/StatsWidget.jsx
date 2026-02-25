import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const StatCard = ({ label, value, subtext, icon: Icon, color, ...rest }) => (
    <div {...rest} className="flex-1 min-w-[140px] bg-black/20 p-3 rounded-xl border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-colors">
        <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={40} />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1 text-gray-500 text-[10px] font-mono uppercase tracking-widest">
                <Icon size={12} />
                {label}
            </div>
            <div className="text-2xl font-display font-bold text-white tracking-tight">
                {value}
            </div>
            {subtext && (
                <div className={`text-[10px] font-bold mt-1 ${color}`}>
                    {subtext}
                </div>
            )}
        </div>
    </div>
);

const StatsWidget = ({ events }) => {
    // Calculate simple stats
    const totalPrize = events.reduce((acc, curr) => acc + (curr.prizePool || 0), 0);
    const avgRoi = events.length ? Math.round(events.reduce((acc, curr) => acc + (curr.roiScore || 0), 0) / events.length) : 0;
    const sTierCount = events.filter(e => e.tier === 'S').length;

    // Formatting currency (simplified for k/m)
    const formatPrize = (val) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
        return `$${val}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 w-full"
            data-testid="stats-widget"
        >
            <StatCard
                data-testid="stat-prize"
                label="Total Prize Pool"
                value={formatPrize(totalPrize)}
                subtext="Visible Events"
                icon={DollarSign}
                color="text-yellow-400"
            />
            <StatCard
                data-testid="stat-roi"
                label="Average ROI"
                value={`${avgRoi}%`}
                subtext={avgRoi > 80 ? "High Return" : "Moderate Return"}
                icon={TrendingUp}
                color="text-neon-green"
            />
            <StatCard
                data-testid="stat-stier"
                label="S-Tier Events"
                value={sTierCount}
                subtext="Top Opportunities"
                icon={Trophy}
                color="text-neon-purple"
            />
            <StatCard
                data-testid="stat-total"
                label="Total Events"
                value={events.length}
                subtext="In Current View"
                icon={Calendar}
                color="text-neon-blue"
            />
        </motion.div>
    );
};

export default StatsWidget;
