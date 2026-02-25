import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutGrid, Clock, TrendingUp, AlertCircle, DollarSign, PanelLeftOpen } from 'lucide-react';
import { format } from 'date-fns';
import ButtonGlass from '../glass/ButtonGlass';

const CalendarHeader = ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    activeView,
    setActiveView,
    sortBy,
    setSortBy,
    isLeftSidebarOpen,
    onToggleLeftSidebar,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col xl:flex-row items-center justify-between gap-6 border-b border-white/5 pb-6"
        >
            {/* 1. Left: Sidebar Toggle + Month Navigation & Title */}
            <div className="flex items-center gap-4">
                {/* Sidebar Toggle */}
                {!isLeftSidebarOpen && (
                    <button
                        data-testid="btn-toggle-sidebar"
                        onClick={onToggleLeftSidebar}
                        className="p-2 rounded-lg bg-black/40 border border-white/10 hover:bg-white/10 hover:border-neon-purple/50 text-gray-400 hover:text-neon-purple transition-all"
                        title="Open sidebar"
                    >
                        <PanelLeftOpen size={18} />
                    </button>
                )}

                {/* Navigation Arrows */}
                <div className="flex bg-black/40 rounded-full p-1 border border-white/10 backdrop-blur-md">
                    <button
                        data-testid="btn-prev-month"
                        onClick={onPrevMonth}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        data-testid="btn-next-month"
                        onClick={onNextMonth}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Title */}
                <div data-testid="header-title">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                        {activeView === 'year'
                            ? format(currentDate, 'yyyy')
                            : format(currentDate, 'MMMM yyyy')
                        }
                    </h2>
                    <p className="text-xs font-mono text-neon-purple uppercase tracking-[0.2em] opacity-80">
                        System::V3.0 // {activeView === 'year' ? 'Annual_Overview' : 'Interactive_Grid'}
                    </p>
                </div>
            </div>

            {/* 2. Controls Area (View Switcher + Sort) */}
            <div className="flex flex-wrap justify-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5 backdrop-blur-sm">

                {/* View Switcher: Month / Year */}
                <div className="flex gap-2 pr-4 border-r border-white/10">
                    <ButtonGlass
                        data-testid="btn-view-month"
                        variant={activeView === 'month' ? 'active' : 'ghost'}
                        onClick={() => setActiveView('month')}
                        icon={CalendarIcon}
                        className={activeView === 'month' ? 'bg-neon-purple/20 text-neon-green border-neon-purple/50' : 'text-gray-500'}
                    >
                        MONTH
                    </ButtonGlass>
                    <ButtonGlass
                        data-testid="btn-view-year"
                        variant={activeView === 'year' ? 'active' : 'ghost'}
                        onClick={() => setActiveView('year')}
                        icon={LayoutGrid}
                        className={activeView === 'year' ? 'bg-neon-purple/20 text-neon-green border-neon-purple/50' : 'text-gray-500'}
                    >
                        YEAR
                    </ButtonGlass>
                </div>

                {/* Sorting Controls */}
                <div className="flex gap-2">
                    <button
                        data-testid="btn-sort-date"
                        onClick={() => setSortBy('date')}
                        className={`p-2 rounded-lg transition-all ${sortBy === 'date' ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-600 hover:text-gray-400'}`}
                        title="Sort by Chronological"
                    >
                        <Clock size={16} />
                    </button>
                    <button
                        data-testid="btn-sort-urgency"
                        onClick={() => setSortBy('urgency')}
                        className={`p-2 rounded-lg transition-all ${sortBy === 'urgency' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-600 hover:text-gray-400'}`}
                        title="Sort by Urgency"
                    >
                        <AlertCircle size={16} />
                    </button>
                    <button
                        data-testid="btn-sort-roi"
                        onClick={() => setSortBy('roi')}
                        className={`p-2 rounded-lg transition-all ${sortBy === 'roi' ? 'bg-neon-green/20 text-neon-green' : 'text-gray-600 hover:text-gray-400'}`}
                        title="Sort by ROI"
                    >
                        <TrendingUp size={16} />
                    </button>
                    <button
                        data-testid="btn-sort-prize"
                        onClick={() => setSortBy('prize')}
                        className={`p-2 rounded-lg transition-all ${sortBy === 'prize' ? 'bg-yellow-500/20 text-yellow-500' : 'text-gray-600 hover:text-gray-400'}`}
                        title="Sort by Prize Pool"
                    >
                        <DollarSign size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CalendarHeader;
