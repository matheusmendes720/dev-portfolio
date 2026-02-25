
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subMonths, setMonth, setYear } from 'date-fns';

import { EVENTS } from '../data/contestData';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarGrid from '../components/calendar/CalendarGrid';
import FilterWidget from '../components/calendar/FilterWidget';
import StatsWidget from '../components/dashboard/StatsWidget';
import LeftSidebar from '../components/calendar/LeftSidebar';
import RightAnnotationPanel from '../components/calendar/RightAnnotationPanel';
import YearView from '../components/calendar/YearView';

const ContestCalendar = () => {
    // ─── Core State ───
    const [currentDate, setCurrentDate] = useState(new Date());
    const [sortBy, setSortBy] = useState('date');

    // ─── New UI State ───
    const [activeView, setActiveView] = useState('year'); // 'month' | 'year'
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    // ─── Filter State ───
    const [filters, setFilters] = useState({
        tier_s: false,
        tier_a: false,
        free_entry: false,
        urgent: false,
        salvador: false,
    });

    const toggleFilter = (id) => {
        setFilters(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // ─── Navigation Handlers ───
    const onNextMonth = () => setCurrentDate(subMonths(currentDate, -1));
    const onPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // ─── Processing Logic (Filter -> Sort) ───
    const getProcessedEvents = () => {
        let processed = [...EVENTS];

        processed = processed.filter(evt => {
            const activeTiers = [];
            if (filters.tier_s) activeTiers.push('S');
            if (filters.tier_a) activeTiers.push('A');

            const matchesTier = activeTiers.length === 0 || activeTiers.includes(evt.tier);
            const matchesFree = !filters.free_entry || (String(evt.cost).toLowerCase().includes('free') || evt.numericCost === 0);
            const matchesUrgent = !filters.urgent || (evt.urgencyScore >= 75);
            const matchesSalvador = !filters.salvador || (
                evt.location && (
                    evt.location.includes('Salvador') ||
                    evt.location.includes('Praia do Forte')
                )
            );

            return matchesTier && matchesFree && matchesUrgent && matchesSalvador;
        });

        switch (sortBy) {
            case 'roi':
                return processed.sort((a, b) => (b.roiScore || 0) - (a.roiScore || 0));
            case 'prize':
                return processed.sort((a, b) => (b.prizePool || 0) - (a.prizePool || 0));
            case 'urgency':
                return processed.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
            case 'date':
            default:
                return processed.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
    };

    const displayEvents = getProcessedEvents();

    // ─── Interaction Handlers ───
    const handleDateClick = useCallback((day) => {
        setSelectedDate(day);
        setSelectedEvent(null);
        setIsRightSidebarOpen(true);
    }, []);

    const handleEventClick = useCallback((event) => {
        setSelectedEvent(event);
        setSelectedDate(event.date ? new Date(event.date) : null);
        setIsRightSidebarOpen(true);
    }, []);

    const handleCloseRightPanel = useCallback(() => {
        setIsRightSidebarOpen(false);
        setSelectedEvent(null);
        // Keep selectedDate for highlight persistence
    }, []);

    const handleMonthClick = useCallback((monthDate) => {
        setCurrentDate(monthDate);
        setActiveView('month');
    }, []);

    const handleToggleLeftSidebar = useCallback(() => {
        setIsLeftSidebarOpen(prev => !prev);
    }, []);

    return (
        <div data-testid="calendar-page" className="relative min-h-screen bg-cyber-void text-white overflow-hidden selection:bg-neon-green selection:text-black">
            {/* CLEAN VOID BACKGROUND - Removed all WebGL/Scanline/Gradient layers per user request */}

            {/* ─── 3-Column Layout Container ─── */}
            <div className="relative z-20 flex h-screen overflow-hidden">

                {/* ═══ LEFT SIDEBAR ═══ */}
                <LeftSidebar
                    isOpen={isLeftSidebarOpen}
                    onToggle={handleToggleLeftSidebar}
                    events={displayEvents}
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
                />

                {/* ═══ MAIN CONTENT (Center Column) ═══ */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* EXPANDED LAYOUT: Removed max-w-[1600px] and reduced padding for maximum screen real estate */}
                    <div className="w-full h-full p-2 md:p-4 flex flex-col">

                        {/* 1. Dashboard Stats */}
                        <div className="mb-6 flex-shrink-0">
                            <StatsWidget events={displayEvents} />
                        </div>

                        {/* 2. Header & Controls */}
                        <div className="flex-shrink-0">
                            <CalendarHeader
                                currentDate={currentDate}
                                onPrevMonth={onPrevMonth}
                                onNextMonth={onNextMonth}
                                activeView={activeView}
                                setActiveView={setActiveView}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                isLeftSidebarOpen={isLeftSidebarOpen}
                                onToggleLeftSidebar={handleToggleLeftSidebar}
                            />
                        </div>

                        {/* 3. Filter Bar */}
                        <div className="mb-4 flex-shrink-0">
                            <FilterWidget filters={filters} toggleFilter={toggleFilter} />
                        </div>

                        {/* 4. Main View Area - Flexible Grow */}
                        <div className="flex-grow min-h-0 relative">
                            <AnimatePresence mode="wait">
                                {activeView === 'month' ? (
                                    <motion.div
                                        key="month"
                                        initial={{ opacity: 0, scale: 0.99 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.99 }}
                                        className="h-full"
                                    >
                                        <CalendarGrid
                                            currentDate={currentDate}
                                            events={displayEvents}
                                            onEventClick={handleEventClick}
                                            onDateClick={handleDateClick}
                                            selectedDate={selectedDate}
                                        />
                                    </motion.div>
                                ) : (
                                    <YearView
                                        key="year"
                                        year={currentDate.getFullYear()}
                                        events={displayEvents}
                                        selectedDate={selectedDate}
                                        onMonthClick={handleMonthClick}
                                        onDateClick={handleDateClick}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ═══ RIGHT ANNOTATION PANEL ═══ */}
                <RightAnnotationPanel
                    isOpen={isRightSidebarOpen}
                    onClose={handleCloseRightPanel}
                    selectedEvent={selectedEvent}
                    selectedDate={selectedDate}
                    events={displayEvents}
                    onEventClick={handleEventClick}
                />

            </div>
        </div>
    );
};

export default ContestCalendar;
