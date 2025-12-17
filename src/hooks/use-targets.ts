"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const TARGETS_STORAGE_KEY = 'tradezend_targets';

type Targets = {
    profit: number;
    loss: number;
};

const DEFAULT_TARGETS: Targets = { profit: 500, loss: 200 };

const getStoredTargets = (): Targets => {
    if (typeof window === 'undefined') return DEFAULT_TARGETS;
    try {
        const stored = localStorage.getItem(TARGETS_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(DEFAULT_TARGETS));
            return DEFAULT_TARGETS;
        }
        return JSON.parse(stored);
    } catch {
        return DEFAULT_TARGETS;
    }
};

const saveStoredTargets = (targets: Targets): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(targets));
};

export function useTargets() {
    const { toast } = useToast();
    const [targets, setTargets] = useState<Targets>(DEFAULT_TARGETS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setTargets(getStoredTargets());
        setIsLoaded(true);
    }, []);

    const updateTargets = useCallback(async (newTargets: Partial<Targets>) => {
        try {
            setTargets(prev => {
                const updated = { ...prev, ...newTargets };
                saveStoredTargets(updated);
                return updated;
            });
            toast({
                title: "Targets Updated",
                description: "Your profit and loss targets have been saved.",
            });
        } catch (error) {
            console.error("Error updating targets:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not save your targets.",
            });
        }
    }, [toast]);

    return { targets, updateTargets, isLoaded };
}
