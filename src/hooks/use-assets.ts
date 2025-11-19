"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export function useAssets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assets, setAssets] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setAssets([]);
      setIsLoaded(true);
      return;
    }

    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching assets:', error);
      }

      setAssets((data || []).map(row => row.name));
      setIsLoaded(true);
    };

    fetchAssets();
  }, [user]);

  const addAsset = useCallback(async (asset: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('assets')
        .insert({ user_id: user.id, name: asset });

      if (error) throw error;

      toast({ title: "Asset Added", description: `"${asset}" has been added.` });
      setAssets(prev => [...prev, asset]);
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast({ variant: "destructive", title: "Error", description: "Asset already exists." });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Could not add asset." });
      }
      return false;
    }
  }, [user, toast]);

  const deleteAsset = useCallback(async (asset: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('user_id', user.id)
        .eq('name', asset);

      if (error) throw error;

      toast({ title: "Asset Deleted", description: `"${asset}" has been removed.` });
      setAssets(prev => prev.filter(a => a !== asset));
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete asset." });
      return false;
    }
  }, [user, toast]);

  return { assets, addAsset, deleteAsset, isLoaded };
}
