import { useMemo, useEffect, useRef } from 'react';
import { Gantt } from '@svar-ui/react-gantt';
import '@svar-ui/react-gantt/all.css';
import { format, getWeek } from 'date-fns';

/**
 * MissionGantt — Tactical Operational Timeline
 * Features:
 * - Dynamic Multi-Level Scaling (Hour -> Year)
 * - Optimized Horizontal Distribution
 * - High-Contrast Cyberpunk HUD Styling
 * - Reactive Data Bindings
 */
/**
 * D-02 Fix: SVAR Gantt uses Date and time format specification for scale formatting.
 * Format specifiers:
 *   %Y = 4-digit year (2024)
 *   %y = 2-digit year (24)
 *   %F = Full month name (January)
 *   %M = Short month name (Jan)
 *   %m = Zero-padded month number (01-12)
 *   %j = Day of month (1-31)
 *   %d = Zero-padded day of month (01-31)
 *   %W = Week number (01-53)
 * For functions: SVAR passes (startDate, endDate) not a single date.
 */
const getScaleConfig = (unit) => {
    switch (unit) {
        case 'day':
            return [
                { unit: 'month', step: 1, format: '%M %Y' },  // e.g., "JAN 2024"
                { unit: 'day',   step: 1, format: '%d' }      // e.g., "01"
            ];
        case 'week':
            return [
                { unit: 'month', step: 1, format: '%M %Y' },           // e.g., "JAN 2024"
                { unit: 'week',  step: 1, format: (d) => `WK${String(getWeek(d)).padStart(2, '0')}` }  // e.g., "WK01"
            ];
        case 'month':
            return [
                { unit: 'year',  step: 1, format: '%Y' },     // e.g., "2024"
                { unit: 'month', step: 1, format: '%M' }      // e.g., "JAN"
            ];
        case 'quarter':
            return [
                { unit: 'year',    step: 1, format: '%Y' },   // e.g., "2024"
                { unit: 'quarter', step: 1, format: (start) => `Q${Math.ceil((start.getMonth() + 1) / 3)}` }
            ];
        case 'year':
            return [
                { unit: 'year', step: 1, format: '%Y' }       // e.g., "2024"
            ];
        default:
            return [{ unit: 'month', step: 1, format: '%M %Y' }];
    }
};

const getCellWidth = (unit) => {
    switch (unit) {
        case 'day': return 60;
        case 'week': return 120;
        case 'month': return 200;
        case 'quarter': return 300;
        case 'year': return 500;
        default: return 150;
    }
};

const phaseTypeToProgress = (phase) => {
    if (!phase.deliverables?.length) return 0;
    const done = phase.deliverables.filter(d => d.done).length;
    return Math.round((done / phase.deliverables.length) * 100);
};

const MissionGantt = ({ competitionData, scale = 'week' }) => {
    // K-04: Suppress SVAR internal _rollups noise in dev console
    const originalWarnRef = useRef(console.warn);
    useEffect(() => {
        const orig = console.warn;
        originalWarnRef.current = orig;
        console.warn = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('_rollups')) return;
            orig(...args);
        };
        return () => { console.warn = originalWarnRef.current; };
    }, []);

    const tasks = useMemo(() => {
        if (!competitionData) return [];
        const result = [];
        let orderCounter = 1;

        competitionData.phases.forEach((phase, pi) => {
            const phaseId = `p_${pi}`;
            const phaseStart = new Date(phase.start);
            const phaseEnd   = new Date(phase.end);

            // Phase Summary Task — uses SVAR's required 'start'/'end' field names
            result.push({
                id:       phaseId,
                text:     phase.label,
                start:    phaseStart,
                end:      phaseEnd,
                progress: phaseTypeToProgress(phase),
                type:     'summary',
                parent:   null,
                order:    orderCounter++,
                open:     true,
            });

            const dels     = phase.deliverables || [];
            const delCount = dels.length;

            // Sequential Waterfall Distribution
            const MIN_SEGMENT_MS  = 24 * 60 * 60 * 1000; // 1-day minimum
            const totalDurationMs = phaseEnd.getTime() - phaseStart.getTime();
            const taskSegmentMs   = totalDurationMs / Math.max(delCount, 1);
            const segmentMs       = Math.max(taskSegmentMs, MIN_SEGMENT_MS);

            dels.forEach((del, di) => {
                const taskStart = new Date(phaseStart.getTime() + di * segmentMs);
                const taskEnd   = new Date(taskStart.getTime() + segmentMs);

                result.push({
                    id:       `d_${pi}_${di}`,
                    text:     del.label.toUpperCase(),
                    start:    taskStart,
                    end:      taskEnd,
                    progress: del.done ? 100 : 0,
                    type:     'task',
                    parent:   phaseId,
                    order:    orderCounter++,
                });
            });
        });

        return result;
    }, [competitionData]);

    // Compute the viewport date bounds from all tasks for proper horizontal anchoring
    const { ganttStart, ganttEnd } = useMemo(() => {
        if (!tasks.length) {
            return { ganttStart: new Date(), ganttEnd: new Date(Date.now() + 30 * 86400000) };
        }
        const dates = tasks.flatMap(t => [t.start, t.end]).filter(Boolean);
        const minMs = Math.min(...dates.map(d => d.getTime()));
        const maxMs = Math.max(...dates.map(d => d.getTime()));
        const span  = maxMs - minMs;
        const pad   = Math.max(span * 0.1, 2 * 86400000); // at least 2-day padding
        return {
            ganttStart: new Date(minMs - pad),
            ganttEnd:   new Date(maxMs + pad),
        };
    }, [tasks]);


    const markers = useMemo(() => [
        { start: new Date(), text: 'OPERATION_TODAY', css: 'today-marker' }
    ], []);

    if (!competitionData) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-700 font-mono text-[10px] uppercase tracking-widest border border-white/5 rounded-[2rem] bg-black/20">
                INITIATING_SYSTEM_SCAN... // NO_MISSION_DATA
            </div>
        );
    }

    return (
        <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl" style={{ minHeight: 600 }}>
            <div className="gantt-hud-overlay" />
            
            <div className="absolute top-4 right-8 z-[60] flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Visual_Range</span>
                    <span className="text-[10px] font-mono text-neon-green font-bold uppercase">{scale}</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Active_Mission</span>
                    <span className="text-[10px] font-mono text-white/80 font-bold uppercase truncate max-w-[150px]">
                        {competitionData.label || 'NULL_SECTOR'}
                    </span>
                </div>
            </div>

            <style>{`
                .wx-material-theme {
                    --wx-background: transparent !important;
                    --wx-color-primary: #10b981 !important;
                    --wx-gantt-task-color: #8b5cf6 !important;
                    --wx-gantt-background: transparent !important;
                    --wx-table-header-background: rgba(10,10,25,0.98) !important;
                    --wx-table-row-selected-background: rgba(16,185,129,0.1) !important;
                    --wx-border-color: rgba(255,255,255,0.05) !important;
                    color: rgba(255,255,255,0.9) !important;
                    font-family: 'JetBrains Mono', 'Inter', monospace !important;
                    font-size: 11px !important;
                }

                .wx-gantt-header {
                    background: rgba(20, 20, 45, 0.95) !important;
                    border-bottom: 2px solid rgba(16, 185, 129, 0.4) !important;
                    backdrop-filter: blur(20px);
                    height: 100px !important;
                }

                .wx-gantt-scale-row {
                    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                    height: 48px !important;
                }

                .wx-gantt-scale-cell {
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    font-weight: 800 !important;
                    color: #475569 !important;
                    font-size: 10px !important;
                    border-right: 1px solid rgba(255,255,255,0.03) !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .wx-gantt-scale-row:last-child .wx-gantt-scale-cell {
                    color: #94a3b8 !important;
                }

                .wx-gantt-row {
                    border-bottom: 1px solid rgba(255,255,255,0.02) !important;
                    height: 52px !important;
                }

                .wx-gantt-row:hover { background: rgba(255,255,255,0.03) !important; }

                .wx-bar {
                    border-radius: 4px !important;
                    height: 20px !important;
                    margin-top: 16px !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    box-shadow: 0 0 15px rgba(0,0,0,0.4);
                }

                .wx-task {
                    background: linear-gradient(90deg, #6366f1, #a855f7) !important;
                }

                .wx-summary {
                    background: linear-gradient(90deg, #10b981, #3b82f6) !important;
                    height: 24px !important;
                    margin-top: 14px !important;
                }

                .wx-gantt-grid::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(rgba(16, 185, 129, 0.03) 0, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0) 4px);
                    pointer-events: none;
                    z-index: 5;
                }

                .gantt-hud-overlay {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%);
                    background-size: 100% 4px;
                    z-index: 50;
                    opacity: 0.2;
                }

                .today-marker {
                    background-color: rgba(16, 185, 129, 0.6) !important;
                    width: 2px !important;
                    z-index: 100 !important;
                }

                .wx-gantt-sidebar {
                    background: rgba(10, 10, 25, 0.6) !important;
                    border-right: 1px solid rgba(16, 185, 129, 0.2) !important;
                }

                .wx-gantt-column-header {
                    color: #10b981 !important;
                    font-size: 9px !important;
                    letter-spacing: 2px !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                }
            `}</style>

            <Gantt
                key={`gantt-${scale}`}
                tasks={tasks}
                scales={getScaleConfig(scale)}
                cellWidth={getCellWidth(scale)}
                start={ganttStart}
                end={ganttEnd}
                autoScale={false}
                readonly={true}
                markers={markers}
                columns={[
                    { id: 'text', header: 'Operational_Task', flexgrow: 1, minWidth: 220 },
                    { id: 'start', header: 'Chron_Start', width: 140,
                      format: (d) => format(d, 'dd MMM yyyy HH:mm').toUpperCase() },
                ]}
            />
        </div>
    );
};

export default MissionGantt;
