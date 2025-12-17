"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const STRATEGIES_STORAGE_KEY = 'tradezend_strategies';
const DEFAULT_STRATEGIES = ['Breakout', 'Trend Following', 'Mean Reversion', 'Scalping'];

const getStoredStrategies = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_STRATEGIES;
  try {
    const stored = localStorage.getItem(STRATEGIES_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STRATEGIES_STORAGE_KEY, JSON.stringify(DEFAULT_STRATEGIES));
      return DEFAULT_STRATEGIES;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_STRATEGIES;
  }
};

const saveStoredStrategies = (strategies: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STRATEGIES_STORAGE_KEY, JSON.stringify(strategies));
};

export function useStrategies() {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setStrategies(getStoredStrategies());
    setIsLoaded(true);
  }, []);

  const addStrategy = useCallback(async (strategy: string) => {
    try {
      if (strategies.includes(strategy)) {
        toast({ variant: "destructive", title: "Error", description: "Strategy already exists." });
        return false;
      }

      setStrategies(prev => {
        const updated = [...prev, strategy];
        saveStoredStrategies(updated);
        return updated;
      });

      toast({ title: "Strategy Added", description: `"${strategy}" has been added.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add strategy." });
      return false;
    }
  }, [strategies, toast]);

  const deleteStrategy = useCallback(async (strategy: string) => {
    try {
      setStrategies(prev => {
        const updated = prev.filter(s => s !== strategy);
        saveStoredStrategies(updated);
        return updated;
      });

      toast({ title: "Strategy Deleted", description: `"${strategy}" has been removed.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete strategy." });
      return false;
    }
  }, [toast]);

  return { strategies, addStrategy, deleteStrategy, isLoaded };
}
