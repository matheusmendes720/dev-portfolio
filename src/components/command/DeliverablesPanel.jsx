import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Activity, Target, Zap, ChevronDown } from 'lucide-react';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';

/**
 * DeliverablesPanel — Tactical mission checklist with:
 *  - Glassmorphic phase cards
 *  - Premium checkbox visuals
 *  - Progress synchronization
 *  - Operational urgency indicators
 * 
 * FIXES:
 * - High-contrast text colors for better readability (white/80)
 * - Improved card background depth
 * - Subtle "ghost" checkmarks for uncompleted tasks
 */

const CountdownBadge = ({ dateStr }) => {
    const date = parseISO(dateStr);
    const overdue = isPast(date);
    const label = formatDistanceToNow(date, { addSuffix: true });

    return (
        <span className={`text-[10px] font-black font-mono px-3 py-1 rounded-lg border transition-all duration-500 ${
            overdue
                ? 'border-red-500/50 text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
                : 'border-white/10 text-gray-400 bg-white/5 group-hover:border-neon-purple/30 group-hover:text-neon-purple'
        }`}>
            {overdue ? '⚠ CRITICAL_EXPIRY' : `⏱ ${label.toUpperCase()}`}
        </span>
    );
};

const PhaseCard = ({ phase, index, onToggle }) => {
    const [open, setOpen] = useState(true);
    const deliverables = phase.deliverables || [];
    const doneCount = deliverables.filter(d => d.done).length;
    const totalCount = deliverables.length;
    const allDone = doneCount === totalCount && totalCount > 0;
    
    return (
        <motion.div
            layout
            className={`group relative rounded-[2.5rem] border transition-all duration-700 overflow-hidden ${
                allDone ? 'bg-neon-green/5 border-neon-green/30 shadow-[0_0_40px_rgba(16,185,129,0.05)]'
                : 'bg-[#050515]/60 backdrop-blur-3xl border-white/10 hover:border-white/20 shadow-2xl'
            }`}
        >
            {/* Header / Accordion Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-8 text-left transition-all group/btn"
            >
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-700 ${
                        allDone ? 'bg-neon-green border-neon-green text-black scale-110 shadow-[0_0_20px_#10b981]' 
                        : 'bg-white/5 border-white/10 text-gray-400 group-hover/btn:border-neon-purple group-hover/btn:text-neon-purple'
                    }`}>
                        {allDone ? <CheckCircle2 size={24} /> : <Activity size={24} />}
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Phase_0{index + 1}</span>
                            {phase.critical && (
                                <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[8px] font-black text-red-500 tracking-tighter uppercase shrink-0">
                                    Priority_Alpha
                                </span>
                            )}
                        </div>
                        <h4 className={`text-xl font-black italic tracking-tight uppercase transition-colors duration-500 ${allDone ? 'text-neon-green opacity-80' : 'text-white'}`}>
                            {phase.title || phase.label}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Progress</span>
                                <span className={`text-[10px] font-black font-mono ${allDone ? 'text-neon-green' : 'text-neon-purple'}`}>
                                    {totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
                                    className={`h-full rounded-full ${allDone ? 'bg-neon-green shadow-[0_0_10px_#10b981]' : 'bg-neon-purple shadow-[0_0_10px_#8b5cf6]'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <CountdownBadge dateStr={phase.end} />
                    <div className={`transition-transform duration-500 ${open ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-gray-500 group-hover/btn:text-white" />
                    </div>
                </div>
            </button>

            {/* Deliverables List */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="px-8 pb-8 space-y-4">
                            <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-6" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {deliverables.map(del => (
                                    <label 
                                        key={del.id} 
                                        className={`group/item flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                            del.done 
                                            ? 'bg-neon-green/5 border-neon-green/20' 
                                            : 'bg-black/60 border-white/5 hover:border-white/20 hover:bg-[#101025]'
                                        }`}
                                    >
                                        <div className="relative shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={del.done}
                                                onChange={() => onToggle(phase.id, del.id)}
                                                className="sr-only"
                                            />
                                            <div className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${
                                                del.done 
                                                ? 'bg-neon-green border-neon-green text-black scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                                                : 'bg-black border-white/10 group-hover/item:border-white/40 text-white/5'
                                            }`}>
                                                <CheckCircle2 size={18} />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[12px] font-black uppercase tracking-widest transition-all duration-500 ${
                                                del.done ? 'text-neon-green/50 line-through' : 'text-white/80 group-hover/item:text-white'
                                            }`}>
                                                {del.title || del.label}
                                            </p>
                                            {del.points && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Efficiency_Value</span>
                                                    <span className="text-[8px] font-black font-mono text-neon-green">+{del.points}PTS</span>
                                                </div>
                                            )}
                                        </div>
                                        {del.critical && !del.done && (
                                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                                <Zap size={14} className="animate-pulse" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const DeliverablesPanel = ({ competitionData, onDeliverableToggle }) => {
    if (!competitionData) return null;

    // Ensure we have a valid eventId for state persistence
    const eventId = competitionData.eventId || competitionData.id;

    const totalDeliverables = (competitionData.phases || []).reduce((sum, p) => sum + (p.deliverables?.length || 0), 0);
    const completedDeliverables = (competitionData.phases || []).reduce((sum, p) => sum + (p.deliverables?.filter(d => d.done).length || 0), 0);
    const overallPct = totalDeliverables ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

    return (
        <div className="space-y-12">
            {/* Mission Intel Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-3 p-8 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                     {/* Progress Fill Background Overlay */}
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${overallPct}%` }}
                        className="absolute bottom-0 left-0 top-0 bg-neon-green/[0.03] pointer-events-none transition-all duration-1000"
                     />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                                    <Target size={24} className="text-neon-green" />
                                </div>
                                <div>
                                    <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1.5">Operational_Progress</h3>
                                    <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest italic">{competitionData.label} // SYNC_ACTIVE</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-5xl font-black text-neon-green italic leading-none drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{overallPct}%</span>
                            </div>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-6 border border-white/5 shadow-inner">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-green to-neon-green shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${overallPct}%` }}
                                transition={{ duration: 1.5, ease: 'circOut' }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.25em]">
                            <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-neon-green" /> {completedDeliverables} COMPLETED</span>
                            <span className="flex items-center gap-2"><Activity size={12} className="text-neon-purple" /> {totalDeliverables - completedDeliverables} PENDING_TASKS</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-3xl flex flex-col justify-center items-center text-center shadow-2xl">
                    <div className="space-y-3">
                        <div className="inline-flex p-5 bg-white/5 rounded-[2rem] border border-white/10 mb-4 shadow-xl">
                           <Activity size={36} className="text-neon-purple animate-pulse" />
                        </div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Live_Status</h4>
                        <p className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight">
                            {overallPct === 100 ? 'Mission_Complete' : 'Execution_Phase'}
                        </p>
                    </div>
                </div>
            </div>

            {/* List of Phase Cards */}
            <div className="space-y-8 pb-12">
                {(competitionData.phases || []).map((phase, idx) => (
                    <PhaseCard
                        key={phase.id}
                        phase={phase}
                        index={idx}
                        onToggle={(phaseId, delId) => onDeliverableToggle(eventId, phaseId, delId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DeliverablesPanel;
