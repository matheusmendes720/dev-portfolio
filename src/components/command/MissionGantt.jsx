import { useMemo } from 'react';
import { Gantt } from '@svar-ui/react-gantt';
import '@svar-ui/react-gantt/all.css';

/**
 * MissionGantt — wraps @svar-ui/react-gantt for a single competition.
 * Renders the competition's phases as summary tasks and deliverables
 * as leaf tasks. Injects CSS overrides to match the cyberpunk HUD theme.
 * 
 * FIXES:
 * - Reactive tasks (derived from props)
 * - Correct property names (start_date, end_date)
 * - Updated CSS selectors for SVAR library classes
 */

const phaseTypeToProgress = (phase) => {
    if (!phase.deliverables?.length) return 0;
    const done = phase.deliverables.filter(d => d.done).length;
    return Math.round((done / phase.deliverables.length) * 100);
};

const MissionGantt = ({ competitionData, scale = 'month' }) => {
    // DERIVED TASKS: Ensures UI updates immediately when mission or state changes
    const tasks = useMemo(() => {
        if (!competitionData) return [];
        const result = [];
        let orderCounter = 1;

        competitionData.phases.forEach((phase, pi) => {
            const phaseId = `p_${pi}`;
            
            // Standardizing on start_date/end_date for SVAR engine compatibility
            result.push({
                id: phaseId,
                text: phase.label,
                start_date: new Date(phase.start),
                end_date: new Date(phase.end),
                progress: phaseTypeToProgress(phase),
                type: 'summary',
                parent: null, // null for root tasks
                order: orderCounter++,
                open: true,
            });

            (phase.deliverables || []).forEach((del, di) => {
                result.push({
                    id: `d_${pi}_${di}`,
                    text: del.label,
                    start_date: new Date(phase.start),
                    end_date: new Date(phase.end),
                    progress: del.done ? 100 : 0,
                    type: 'task',
                    parent: phaseId,
                    order: orderCounter++,
                });
            });
        });

        return result;
    }, [competitionData]);

    if (!competitionData) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-700 font-mono text-[10px] uppercase tracking-widest border border-white/5 rounded-[2rem] bg-black/20">
                INITIATING_SYSTEM_SCAN... // NO_MISSION_DATA
            </div>
        );
    }

    return (
        <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-3xl" style={{ minHeight: 500 }}>
            <style>{`
                /* High-Fidelity Cyberpunk Overrides */
                .wx-material-theme {
                    --wx-background: transparent !important;
                    --wx-color-primary: #10b981 !important;
                    --wx-gantt-task-color: #8b5cf6 !important;
                    --wx-gantt-background: transparent !important;
                    --wx-table-header-background: rgba(10,10,25,0.95) !important;
                    --wx-table-row-selected-background: rgba(16,185,129,0.1) !important;
                    color: rgba(255,255,255,0.9) !important;
                    font-family: 'JetBrains Mono', monospace !important;
                }

                .wx-gantt-header {
                    background: rgba(15, 15, 35, 0.8) !important;
                    border-bottom: 2px solid rgba(16, 185, 129, 0.3) !important;
                    backdrop-filter: blur(10px);
                }

                .wx-gantt-row {
                    border-bottom: 1px solid rgba(255,255,255,0.03) !important;
                    height: 44px !important;
                }

                /* Targeting Task Bars correctly based on library classes */
                .wx-bar {
                    border-radius: 4px !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    box-shadow: 0 0 15px rgba(0,0,0,0.5);
                }

                .wx-task {
                    background: linear-gradient(90deg, #818cf8 0%, #6366f1 100%) !important;
                    box-shadow: 0 0 10px rgba(99,102,241,0.2);
                }

                .wx-summary {
                    background: linear-gradient(90deg, #10b981 0%, #059669 100%) !important;
                    box-shadow: 0 0 20px rgba(16,185,129,0.3);
                }

                .wx-gantt-sidebar {
                    background: rgba(0,0,0,0.2) !important;
                    border-right: 1px solid rgba(255,255,255,0.05) !important;
                }

                .wx-gantt-cell {
                    border-right: 1px solid rgba(255,255,255,0.02) !important;
                    color: #94a3b8 !important;
                    font-size: 11px !important;
                }

                .wx-gantt-column-header {
                    text-transform: uppercase;
                    font-weight: 900 !important;
                    letter-spacing: 0.2em;
                    color: #475569 !important;
                    font-size: 9px !important;
                }

                /* Retro Scanline Overlay */
                .wx-gantt-grid::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), 
                                linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
                    background-size: 100% 2px, 3px 100%;
                    pointer-events: none;
                    z-index: 5;
                }
            `}</style>

            <Gantt
                tasks={tasks}
                scales={[{ unit: scale, step: 1, format: '%M %Y' }]}
                columns={[
                    { id: 'text', header: 'Operational_Task', flexgrow: 1 },
                    { id: 'start_date', header: 'Start_Time', width: 100, format: '%d %M' },
                ]}
            />
        </div>
    );
};

export default MissionGantt;
