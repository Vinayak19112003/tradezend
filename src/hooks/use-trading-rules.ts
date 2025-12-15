"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export function useTradingRules() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tradingRules, setTradingRules] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setTradingRules([]);
      setIsLoaded(true);
      return;
    }

    const fetchTradingRules = async () => {
      const { data, error } = await supabase
        .from('trading_rules')
        .select('name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching trading rules:', error);
      }

      setTradingRules((data || []).map((row: any) => row.name));
      setIsLoaded(true);
    };

    fetchTradingRules();
  }, [user]);

  const addTradingRule = useCallback(async (rule: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('trading_rules')
        .insert({ user_id: user.id, name: rule });

      if (error) throw error;

      toast({ title: "Trading Rule Added", description: `"${rule}" has been added.` });
      setTradingRules(prev => [...prev, rule]);
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast({ variant: "destructive", title: "Error", description: "Rule already exists." });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Could not add rule." });
      }
      return false;
    }
  }, [user, toast]);

  const deleteTradingRule = useCallback(async (rule: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('trading_rules')
        .delete()
        .eq('user_id', user.id)
        .eq('name', rule);

      if (error) throw error;

      toast({ title: "Trading Rule Deleted", description: `"${rule}" has been removed.` });
      setTradingRules(prev => prev.filter(r => r !== rule));
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete rule." });
      return false;
    }
  }, [user, toast]);

  return { tradingRules, addTradingRule, deleteTradingRule, isLoaded };
}
