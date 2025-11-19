"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export function useStrategies() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setStrategies([]);
      setIsLoaded(true);
      return;
    }

    const fetchStrategies = async () => {
      const { data, error } = await supabase
        .from('strategies')
        .select('name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching strategies:', error);
      }

      setStrategies((data || []).map(row => row.name));
      setIsLoaded(true);
    };

    fetchStrategies();
  }, [user]);

  const addStrategy = useCallback(async (strategy: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('strategies')
        .insert({ user_id: user.id, name: strategy });

      if (error) throw error;

      toast({ title: "Strategy Added", description: `"${strategy}" has been added.` });
      setStrategies(prev => [...prev, strategy]);
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast({ variant: "destructive", title: "Error", description: "Strategy already exists." });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Could not add strategy." });
      }
      return false;
    }
  }, [user, toast]);

  const deleteStrategy = useCallback(async (strategy: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('user_id', user.id)
        .eq('name', strategy);

      if (error) throw error;

      toast({ title: "Strategy Deleted", description: `"${strategy}" has been removed.` });
      setStrategies(prev => prev.filter(s => s !== strategy));
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete strategy." });
      return false;
    }
  }, [user, toast]);

  return { strategies, addStrategy, deleteStrategy, isLoaded };
}
