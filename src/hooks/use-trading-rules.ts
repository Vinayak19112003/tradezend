"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const TRADING_RULES_STORAGE_KEY = 'tradezend_trading_rules';
const DEFAULT_TRADING_RULES = ['Follow the plan', 'Wait for confirmation', 'Check higher timeframe', 'Risk max 2% per trade', 'No trading during news'];

const getStoredTradingRules = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_TRADING_RULES;
  try {
    const stored = localStorage.getItem(TRADING_RULES_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(TRADING_RULES_STORAGE_KEY, JSON.stringify(DEFAULT_TRADING_RULES));
      return DEFAULT_TRADING_RULES;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_TRADING_RULES;
  }
};

const saveStoredTradingRules = (rules: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRADING_RULES_STORAGE_KEY, JSON.stringify(rules));
};

export function useTradingRules() {
  const { toast } = useToast();
  const [tradingRules, setTradingRules] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTradingRules(getStoredTradingRules());
    setIsLoaded(true);
  }, []);

  const addTradingRule = useCallback(async (rule: string) => {
    try {
      if (tradingRules.includes(rule)) {
        toast({ variant: "destructive", title: "Error", description: "Rule already exists." });
        return false;
      }

      setTradingRules(prev => {
        const updated = [...prev, rule];
        saveStoredTradingRules(updated);
        return updated;
      });

      toast({ title: "Trading Rule Added", description: `"${rule}" has been added.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add rule." });
      return false;
    }
  }, [tradingRules, toast]);

  const deleteTradingRule = useCallback(async (rule: string) => {
    try {
      setTradingRules(prev => {
        const updated = prev.filter(r => r !== rule);
        saveStoredTradingRules(updated);
        return updated;
      });

      toast({ title: "Trading Rule Deleted", description: `"${rule}" has been removed.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete rule." });
      return false;
    }
  }, [toast]);

  return { tradingRules, addTradingRule, deleteTradingRule, isLoaded };
}
