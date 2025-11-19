"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export function useMistakeTags() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mistakeTags, setMistakeTags] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setMistakeTags([]);
      setIsLoaded(true);
      return;
    }

    const fetchMistakeTags = async () => {
      const { data, error } = await supabase
        .from('mistake_tags')
        .select('name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching mistake tags:', error);
      }

      setMistakeTags((data || []).map(row => row.name));
      setIsLoaded(true);
    };

    fetchMistakeTags();
  }, [user]);

  const addMistakeTag = useCallback(async (tag: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('mistake_tags')
        .insert({ user_id: user.id, name: tag });

      if (error) throw error;

      toast({ title: "Mistake Tag Added", description: `"${tag}" has been added.` });
      setMistakeTags(prev => [...prev, tag]);
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast({ variant: "destructive", title: "Error", description: "Tag already exists." });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Could not add tag." });
      }
      return false;
    }
  }, [user, toast]);

  const deleteMistakeTag = useCallback(async (tag: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('mistake_tags')
        .delete()
        .eq('user_id', user.id)
        .eq('name', tag);

      if (error) throw error;

      toast({ title: "Mistake Tag Deleted", description: `"${tag}" has been removed.` });
      setMistakeTags(prev => prev.filter(t => t !== tag));
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete tag." });
      return false;
    }
  }, [user, toast]);

  return { mistakeTags, addMistakeTag, deleteMistakeTag, isLoaded };
}
