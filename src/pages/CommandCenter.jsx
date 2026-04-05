import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, BarChart2, CheckSquare, Zap, Target, Cpu, Activity } from 'lucide-react';

import { useSubscriptions } from '../hooks/useSubscriptions';
import { COMPETITIONS_DATA } from '../data/competitionsData';
import { TIER_COLORS } from '../data/contestData';
import OverviewTimeline from '../components/command/OverviewTimeline';
import MissionGantt from '../components/command/MissionGantt';
import DeliverablesPanel from '../components/command/DeliverablesPanel';
import { useEffect } from 'react';

const RANGE_OPTIONS = ['Week', 'Month', 'Quarter', 'Year'];
const GANTT_SCALES = ['day', 'week', 'month', 'quarter', 'year'];
const GANTT_SCALE_LABELS = { day: 'Daily', week: 'Weekly', month: 'Monthly', quarter: 'Quarterly', year: 'Yearly' };

/**
 * K-03: Smart default scale based on total mission duration.
 * Low Hack (~20 days) → week; Liga Jovem (~8 months) → month; etc.
 */
const getSmartDefaultScale = (phases = []) => {
    if (!phases.length) return 'month';
    const allMs = phases.flatMap(p => [new Date(p.start).getTime(), new Date(p.end).getTime()]);
    const span  = (Math.max(...allMs) - Math.min(...allMs)) / 86_400_000; // days
    if (span <= 21)  return 'day';
    if (span <= 90)  return 'week';
    if (span <= 270) return 'month';
    return 'quarter';
};

const CommandCenter = () => {
    const { subscribedEvents, deliverables, toggleDeliverable } = useSubscriptions();
    const [selectedId, setSelectedId] = useState(() => subscribedEvents[0]?.id || null);
    const [timelineRange, setTimelineRange] = useState('Month');
    // K-03: initial scale derived from first mission's phases
    const [ganttScale, setGanttScale] = useState(() => {
        const firstId   = subscribedEvents[0]?.id;
        const firstData = firstId ? COMPETITIONS_DATA[firstId] : null;
        return getSmartDefaultScale(firstData?.phases ?? []);
    });
    const [activeTab, setActiveTab] = useState('gantt'); // 'gantt' | 'deliverables'
    const [bffStatus, setBffStatus] = useState('INITIATING_SYNC...');

    // K-03: Reset scale to smart default whenever a different mission is selected
    const handleSelectMission = (id) => {
        setSelectedId(id);
        const data = COMPETITIONS_DATA[id];
        if (data?.phases) setGanttScale(getSmartDefaultScale(data.phases));
    };

    useEffect(() => {
        // BFF Intelligence Synchronizer
        const syncBFF = async () => {
            try {
                const res = await fetch('/.netlify/functions/sync-intel');
                if (res.ok) {
                    const data = await res.json();
                    setBffStatus(`SYNC_COMPLETE // NODE: ${data.intel_node}`);
                } else {
                    setBffStatus('SYNC_ERROR // OFFLINE_PROTOCOL');
                }
            } catch {
                setBffStatus('SYNC_UNREACHABLE // LOCAL_CACHED');
            }
        };
        syncBFF();
    }, []);

    // Merge static COMPETITIONS_DATA with persistent user 'done' states
    const getEnrichedData = (id) => {
        const base = COMPETITIONS_DATA[id];
        if (!base) return null;

        const userEventState = deliverables[id] || {};
        const phases = base.phases || [];

        return {
            ...base,
            eventId: id, // Ensure eventId matches the key used for storage lookup
            phases: phases.map(phase => ({
                ...phase,
                deliverables: (phase.deliverables || []).map(del => ({
                    ...del,
                    done: !!userEventState[del.id]
                }))
            }))
        };
    };

    const selectedEvent = subscribedEvents.find(e => e.id === selectedId);
    const enriched = selectedId ? getEnrichedData(selectedId) : null;

    return (
        <div className="relative min-h-screen bg-[#050510] text-white overflow-x-hidden selection:bg-neon-green selection:text-black">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 w-full px-4 md:px-8 py-8">
                
                {/* TOP NAVIGATION / STATUS BAR */}
                <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-6">
                        <Link to="/contest_calendar" className="group flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300">
                            <ArrowLeft size={14} className="text-gray-400 group-hover:text-neon-green group-hover:-translate-x-1 transition-all" />
                            <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 group-hover:text-white uppercase">Back_to_Map</span>
                        </Link>
                        <div className="hidden md:flex flex-col">
                            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em] mb-0.5">Tactical_Intelligence_Node</p>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 bg-neon-green rounded-full shadow-[0_0_8px_#10b981] animate-pulse" />
                                <span className="text-[9px] font-mono text-neon-green/80 uppercase tracking-widest">{bffStatus}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-xl group hover:border-neon-green/30 transition-colors">
                            <Activity size={14} className="text-neon-green" />
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Active_Missions: <b className="text-white">{subscribedEvents.length}</b></span>
                        </div>
                    </div>
                </div>

                {/* MAIN HUD HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-neon-green/10 border border-neon-green/20 rounded-2xl">
                                <Cpu size={24} className="text-neon-green" />
                            </div>
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                                    Command <span className="text-neon-green">Center</span>
                                </h1>
                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.5em] mt-2">Strategic_Resource_Management</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-2xl">
                        {RANGE_OPTIONS.map((r) => (
                            <button
                                key={r}
                                onClick={() => setTimelineRange(r)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
                                    timelineRange === r 
                                    ? 'bg-neon-green text-black shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-105' 
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* LEFT SIDEBAR: MISSION ROSTER */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                <Target size={12} className="text-neon-green" /> Mission_Roster
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
                        </div>
                        
                        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                            {subscribedEvents.map((mission) => (
                                <button
                                    key={mission.id}
                                    onClick={() => handleSelectMission(mission.id)}
                                    className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 text-left overflow-hidden ${
                                        selectedId === mission.id
                                        ? 'bg-white/5 border-neon-green/40 shadow-[0_0_30px_rgba(16,185,129,0.05)] scale-[1.02]'
                                        : 'bg-transparent border-white/5 hover:border-white/20 hover:bg-white/5'
                                    }`}
                                >
                                    {/* Active Glow Overlay */}
                                    {selectedId === mission.id && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />
                                    )}

                                    <div className="relative z-10 shrink-0">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                                            selectedId === mission.id
                                            ? 'bg-neon-green text-black border-neon-green shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                            : 'bg-black/40 text-gray-500 border-white/5 group-hover:bg-white/10 group-hover:border-white/10'
                                        }`}>
                                            <i className={`fas ${mission.category === 'hackathon' ? 'fa-code' : 'fa-chess-knight'} text-sm`} />
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <h4 className={`text-[11px] font-black uppercase tracking-wider truncate transition-colors duration-300 ${
                                                selectedId === mission.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-200'
                                            }`}>
                                                {mission.title}
                                            </h4>
                                            {mission.status === 'ongoing' && (
                                                <span className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_10px_#10b981] animate-pulse" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-[8px] font-mono uppercase tracking-[0.15em] text-gray-600">
                                            <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">Tier_{mission.tier || 'III'}</span>
                                            <span className="opacity-30">|</span>
                                            <span>{mission.date}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Activity Indicator */}
                                    {selectedId === mission.id && (
                                        <motion.div 
                                            layoutId="mission-indicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-neon-green shadow-[0_0_15px_#10b981]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT MAIN: TIMELINE VIEW */}
                    <div className="lg:col-span-9 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-10 rounded-[3rem] bg-[#0A0A1C]/60 backdrop-blur-[100px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative group"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
                            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-neon-purple/5 blur-[80px] rounded-full pointer-events-none opacity-30" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-0.5 w-8 bg-neon-green/40" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green/60">Intelligence_Feed</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">Global_Chronology</h2>
                                    </div>
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-neon-green/40">
                                        <Activity size={20} />
                                    </div>
                                </div>
                                <OverviewTimeline 
                                    range={timelineRange} 
                                    selectedId={selectedId} 
                                    onSelect={setSelectedId} 
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* BOTTOM SECTION: DRILL-DOWN PANEL */}
                <AnimatePresence mode="wait">
                    {selectedEvent && (
                        <motion.div 
                            key={selectedId}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1 w-full p-1.5 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-wrap gap-2">
                                    {[
                                        { id: 'gantt', label: 'Tactical_Gantt', icon: BarChart2 },
                                        { id: 'deliverables', label: 'Mission_Vault', icon: CheckSquare }
                                    ].map(tab => (
                                        <button 
                                            key={tab.id} 
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 min-w-[180px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                                                activeTab === tab.id 
                                                ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/20' 
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                            }`}
                                        >
                                            <tab.icon size={16} /> {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'gantt' && (
                                    <div className="flex bg-black/40 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5">
                                        {GANTT_SCALES.map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => setGanttScale(s)}
                                                className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                                                    ganttScale === s 
                                                    ? 'bg-white/10 text-white shadow-lg' 
                                                    : 'text-gray-500 hover:text-gray-400'
                                                }`}
                                            >
                                                {GANTT_SCALE_LABELS[s]}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-8 rounded-[3.5rem] bg-gradient-to-br from-[#0A0A1C]/80 to-black border border-white/5 shadow-3xl overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                
                                <div className="relative z-10">
                                    {activeTab === 'gantt' ? (
                                        <div className="min-h-[500px]">
                                            <MissionGantt competitionData={enriched} scale={ganttScale} />
                                        </div>
                                    ) : (
                                        <DeliverablesPanel
                                            competitionData={enriched}
                                            onDeliverableToggle={toggleDeliverable}
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CommandCenter;
