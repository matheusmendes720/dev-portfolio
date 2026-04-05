import { useContext } from 'react';
import { SubscriptionContext } from '../context/SubscriptionContextInternal';

export const useSubscriptions = () => {
    const ctx = useContext(SubscriptionContext);
    if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionProvider');
    return ctx;
};
