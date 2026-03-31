/**
 * competitionsData.js
 * Enriched, per-competition phase + deliverable definitions.
 * Keys must match IDs in contestData.js EVENTS array.
 * Bootstrapped from SENAI Nacional & Regional planning docs.
 */

export const COMPETITIONS_DATA = {

    // ─── SENAI NACIONAL 2026 ──────────────────────────────────────────
    // Source: INDEX_GP_NACIONAL_2026.md
    // Theme: Cybersecurity & Digital Ethics
    SENAI_NAC_2026: {
        eventId: 'SENAI_NAC_2026',
        label: 'GP SENAI Nacional 2026',
        color: '#8b5cf6',
        phases: [
            {
                id: 'ph_reg',
                label: 'Registration & Team Formation',
                start: '2026-03-02',
                end: '2026-04-04',
                type: 'registration',
                deliverables: [
                    { id: 'd1', label: 'Individual inscription via Portal', done: false, critical: true, link: null },
                    { id: 'd2', label: 'Recruit 2x Superior level (CIMATEC target)', done: false, critical: true },
                    { id: 'd3', label: 'Collect Enrollment Declaration (Annex II) for all members', done: false },
                    { id: 'd4', label: 'Form Escuderia (team of 4-5) — deadline 10/04', done: false },
                ],
                notes: 'Rule 4.1.5: Max 40% Superior level. Target CIMATEC CyberSec/CompEng students via LinkedIn.',
            },
            {
                id: 'ph_train',
                label: 'Training Webinars (Capacitation)',
                start: '2026-04-06',
                end: '2026-04-10',
                type: 'training',
                deliverables: [
                    { id: 'd5', label: 'Design Thinking webinar (06/04) — note keywords', done: false },
                    { id: 'd6', label: 'Lean Startup webinar — identify AI tools cited', done: false },
                    { id: 'd7', label: 'Pitch + Tooling webinar (10/04)', done: false },
                ],
                notes: 'Semantic mirroring: the SENAI AI evaluation is trained on the same frameworks. Use identical jargon.',
            },
            {
                id: 'ph_sprint',
                label: 'Competition Sprint — The Battle',
                start: '2026-04-13',
                end: '2026-04-17',
                type: 'sprint',
                critical: true,
                deliverables: [
                    { id: 'd8', label: '[E1] Ideation + Lean Canvas — submit 13/04 by 23h59', done: false, critical: true },
                    { id: 'd9', label: '[E2] Conceptual Prototype + 2min Video — 14/04', done: false, critical: true },
                    { id: 'd10', label: '[E3] YouTube Pitch (max 3min) — 15/04 unlisted', done: false, critical: true },
                    { id: 'd11', label: 'Final consolidation & review — 16-17/04', done: false },
                ],
                notes: 'Lean Canvas focus: Ransomware cost to BA SMEs. Video: cinematic AI voiceover + Mograph. Pitch: Quantum-Safe hook.',
            },
            {
                id: 'ph_results',
                label: 'Results',
                start: '2026-05-05',
                end: '2026-05-05',
                type: 'milestone',
                deliverables: [
                    { id: 'd12', label: 'Winners announcement (05/05)', done: false },
                ],
                notes: null,
            },
        ],
    },

    // ─── META HACKER CUP 2026 ─────────────────────────────────────────
    // Derived from contestData.js CP01
    CP01: {
        eventId: 'CP01',
        label: 'Meta Hacker Cup 2026',
        color: '#3b82f6',
        phases: [
            {
                id: 'mhc_qual',
                label: 'Qualification Round',
                start: '2026-02-02',
                end: '2026-03-01',
                type: 'sprint',
                deliverables: [
                    { id: 'mhc_d1', label: 'Register on Meta CCC platform', done: false, critical: true },
                    { id: 'mhc_d2', label: 'Solve 4/5 problems in 24h window', done: false },
                ],
                notes: 'Free entry. Top 2000 get t-shirt. Multi-round elimination.',
            },
            {
                id: 'mhc_rounds',
                label: 'Progressive Rounds (R1 → Finals)',
                start: '2026-03-01',
                end: '2026-12-13',
                type: 'training',
                deliverables: [
                    { id: 'mhc_d3', label: 'Round 1: 3h sprint — schedule block', done: false },
                    { id: 'mhc_d4', label: 'Round 2: 3h sprint — schedule block', done: false },
                    { id: 'mhc_d5', label: 'Finals: top 200 qualify for onsite', done: false },
                ],
                notes: null,
            },
        ],
    },

    // ─── GP REGIONAL (INDEX BAHIA 2026) ────────────────────────────────
    // Source: INDEX_GP_REGIONAL_2026.md
    // Theme: Industrial Transformation (Bahia Focus)
    CP22: {
        eventId: 'CP22',
        label: 'GP Regional SENAI (INDEX Bahia)',
        color: '#10b981',
        phases: [
            {
                id: 'gp_reg_insc',
                label: 'Regional Inscriptions',
                start: '2026-03-02',
                end: '2026-04-06',
                type: 'registration',
                deliverables: [
                    { id: 'gr1', label: 'Submit Regional Form (DR-BA)', done: false, critical: true },
                    { id: 'gr2', label: 'Draft "One-Pager" focused on Bahia Industry', done: false },
                ],
                notes: 'Leverage: Mention Nacional Escuderia status to build authority.',
            },
            {
                id: 'gp_reg_cur',
                label: 'Curadoria (Top 20 Selection)',
                start: '2026-04-07',
                end: '2026-04-10',
                type: 'training',
                deliverables: [],
                notes: 'Internal SENAI selection process.',
            },
            {
                id: 'gp_reg_onsite',
                label: '48h Marathon (Feira INDEX)',
                start: '2026-05-06',
                end: '2026-05-08',
                type: 'sprint',
                critical: true,
                deliverables: [
                    { id: 'gr3', label: 'On-site Credentialing (Salvador)', done: false, critical: true },
                    { id: 'gr4', label: 'Network with 2+ exhibitors for validation', done: false },
                    { id: 'gr5', label: 'Final Pitch (5min) — Stage Presentation', done: false, critical: true },
                ],
                notes: 'Focus on OT/IT convergence. Target: Polo de Camaçari / Porto de Salvador dores.',
            },
        ],
    },

    // ─── DESAFIO LIGA JOVEM (SEBRAE) ──────────────────────────────────
    // Source: Liga_Jovem_Research.md
    HK_LIGA_JOVEM: {
        eventId: 'HK_LIGA_JOVEM',
        label: 'Desafio Liga Jovem (Sebrae)',
        color: '#f9ca24',
        phases: [
            {
                id: 'lj_intel',
                label: 'Fase 1: Inteligência & Sprint 0',
                start: '2026-03-27',
                end: '2026-04-15',
                type: 'research',
                deliverables: [
                    { id: 'lj1', label: 'Rodar análise de edital e brechas', done: true, critical: true },
                    { id: 'lj2', label: 'Mapear perfil de vencedores 2023-2025', done: true },
                    { id: 'lj3', label: 'Definir o "Wicked Problem" específico', done: false, critical: true },
                    { id: 'lj4', label: 'Recrutar Professor Orientador Estratégico', done: false },
                ],
                notes: 'Focus on ESG impact. Status: EM SINCRONIA COM WORKFLOW DE ELITE.',
            },
            {
                id: 'lj_proto',
                label: 'Fase 2: Prototipação Visual',
                start: '2026-06-01',
                end: '2026-06-15',
                type: 'development',
                deliverables: [
                    { id: 'lj5', label: 'Brandboard Premium (Glassmorphism)', done: false },
                    { id: 'lj6', label: 'Protótipo Navegável Figma (High-Fi)', done: false, critical: true },
                    { id: 'lj7', label: 'Validar UX com 5+ usuários da persona', done: false },
                ],
                notes: 'Score 5/5 on Prototype criteria by prioritizing UI aesthetics.',
            },
            {
                id: 'lj_national',
                label: 'Fase 3: Missão Nacional (Presencial)',
                start: '2026-11-01',
                end: '2026-11-15',
                type: 'sprint',
                critical: true,
                deliverables: [
                    { id: 'lj8', label: 'Hollywood Pitch Video (5 min)', done: false, critical: true },
                    { id: 'lj9', label: 'Submissão Nacional via Plataforma', done: false, critical: true },
                ],
                notes: 'Top 5 national selection. Prizes include international mission.',
            },
        ],
    },

    // ─── REPLY AI AGENT CHALLENGE ─────────────────────────────────────
    // Source: reply_ai_agent_2026_note.md
    HK_REPLY_AI: {
        eventId: 'HK_REPLY_AI',
        label: 'Reply AI Agent Challenge',
        color: '#ef4444',
        phases: [
            {
                id: 'rep_prep',
                label: 'Pre-Flight Preparation',
                start: '2026-03-18',
                end: '2026-04-15',
                type: 'registration',
                deliverables: [
                    { id: 'rep1', label: 'Register Team (2-4 people)', done: false, critical: true },
                    { id: 'rep2', label: 'Setup Langfuse (Tracing requirement)', done: false, critical: true },
                    { id: 'rep3', label: 'Practice with CrewAI / LangGraph', done: false },
                ],
                notes: 'Crucial: Mastery of Langfuse tracing. Required for valid submisson.',
            },
            {
                id: 'rep_battle',
                label: 'The Challenge Window (6h Sprint)',
                start: '2026-04-16',
                end: '2026-04-16',
                type: 'sprint',
                critical: true,
                deliverables: [
                    { id: 'rep4', label: 'Solve Initial Training Datasets (3)', done: false },
                    { id: 'rep5', label: 'Detect Fraud in MirrorPay 2087', done: false, critical: true },
                    { id: 'rep6', label: 'Submit Logs + Code Bundle', done: false, critical: true },
                ],
                notes: '10:30 - 16:30 BRT. Focus on core 2-3 specialist agents first.',
            },
        ],
    },

    // ─── SENAI LOW HACK 2026 ──────────────────────────────────────────
    HK_LOWHACK: {
        eventId: 'HK_LOWHACK',
        label: 'SENAI Low Hack 2026',
        color: '#f59e0b',
        phases: [
            {
                id: 'lh_intel',
                label: 'Inteligência Industrial & Market-Fit',
                start: '2026-03-30',
                end: '2026-04-05',
                type: 'research',
                deliverables: [
                    { id: 'lh1', label: 'Mapeamento Dores F&B Indústria', done: true, critical: true },
                    { id: 'lh2', label: 'Draft Business Case B2B', done: true },
                    { id: 'lh3', label: 'Compliance Edital Checklist', done: true },
                ],
                notes: 'Waste Guardian industrial thesis. Show how it saves factory costs.',
            },
            {
                id: 'lh_proto',
                label: 'Scaffolding & Prototipação',
                start: '2026-04-06',
                end: '2026-04-14',
                type: 'development',
                deliverables: [
                    { id: 'lh4', label: 'Mendix Domain Model prototype', done: false, critical: true },
                    { id: 'lh5', label: 'OpenAI REST API Integration mock', done: false },
                    { id: 'lh6', label: 'Pitch Executive Script (3 min)', done: false },
                ],
                notes: 'Using Atlas UI (Dark Mode B2B) for premium look.',
            },
            {
                id: 'lh_prep',
                label: 'Setup de Trincheira & Rehearsal',
                start: '2026-04-15',
                end: '2026-04-17',
                type: 'training',
                deliverables: [
                    { id: 'lh7', label: 'Configuração Discord Oficial', done: false },
                    { id: 'lh8', label: 'Deploy Base Mendix Cloud', done: false },
                    { id: 'lh9', label: 'Dry-Run do Pitch (Executive)', done: false },
                ],
                notes: 'Testing OpenAI system prompts for output in strict JSON.',
            },
            {
                id: 'lh_sprint',
                label: 'Maratona de Guerra (35h)',
                start: '2026-04-18',
                end: '2026-04-19',
                type: 'sprint',
                critical: true,
                deliverables: [
                    { id: 'lh10', label: 'Submissão Oficial (21:00)', done: false, critical: true },
                    { id: 'lh11', label: 'Gravação C-Level Pitch', done: false, critical: true },
                ],
                notes: 'The 35-hour sprint deadline. No over-engineering.',
            },
        ],
    },
};

/** Returns competition data for a given event ID, or null if not enriched */
export const getCompetitionData = (eventId) => COMPETITIONS_DATA[eventId] || null;

/** All enriched event IDs */
export const ENRICHED_IDS = Object.keys(COMPETITIONS_DATA);
