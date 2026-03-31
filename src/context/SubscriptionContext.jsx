import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { EVENTS } from '../data/contestData';

const SubscriptionContext = createContext(null);

/**
 * Provides subscribed event state (persisted to localStorage) and
 * toggle actions. Consumed by both ContestCalendar and CommandCenter.
 */
export const SubscriptionProvider = ({ children }) => {
    const [subscribedIds, setSubscribedIds] = useState(() => {
        try {
            const stored = localStorage.getItem('cc_subscribed_ids');
            return new Set(stored ? JSON.parse(stored) : []);
        } catch {
            return new Set();
        }
    });

    const [deliverables, setDeliverables] = useState(() => {
        try {
            const stored = localStorage.getItem('cc_deliverables');
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem('cc_subscribed_ids', JSON.stringify([...subscribedIds]));
    }, [subscribedIds]);

    useEffect(() => {
        localStorage.setItem('cc_deliverables', JSON.stringify(deliverables));
    }, [deliverables]);

    const toggleSubscription = (id) => {
        setSubscribedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleDeliverable = (eventId, delId) => {
        setDeliverables(prev => {
            const eventData = prev[eventId] || {};
            const isDone = eventData[delId] || false;
            
            return {
                ...prev,
                [eventId]: {
                    ...eventData,
                    [delId]: !isDone
                }
            };
        });
    };

    const isSubscribed = (id) => subscribedIds.has(id);

    // Derive the full event objects from the global EVENTS array
    const subscribedEvents = useMemo(
        () => EVENTS.filter(evt => subscribedIds.has(evt.id) || evt.status === 'ongoing'),
        [subscribedIds]
    );

    return (
        <SubscriptionContext.Provider value={{
            subscribedIds,
            subscribedEvents,
            toggleSubscription,
            isSubscribed,
            deliverables,
            toggleDeliverable
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscriptions = () => {
    const ctx = useContext(SubscriptionContext);
    if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionProvider');
    return ctx;
};
