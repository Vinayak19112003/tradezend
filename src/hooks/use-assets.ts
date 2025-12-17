"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const ASSETS_STORAGE_KEY = 'tradezend_assets';
const DEFAULT_ASSETS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'BTC/USD', 'XAUUSD', 'SPX500'];

const getStoredAssets = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_ASSETS;
  try {
    const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(DEFAULT_ASSETS));
      return DEFAULT_ASSETS;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_ASSETS;
  }
};

const saveStoredAssets = (assets: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
};

export function useAssets() {
  const { toast } = useToast();
  const [assets, setAssets] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAssets(getStoredAssets());
    setIsLoaded(true);
  }, []);

  const addAsset = useCallback(async (asset: string) => {
    try {
      if (assets.includes(asset)) {
        toast({ variant: "destructive", title: "Error", description: "Asset already exists." });
        return false;
      }

      setAssets(prev => {
        const updated = [...prev, asset];
        saveStoredAssets(updated);
        return updated;
      });

      toast({ title: "Asset Added", description: `"${asset}" has been added.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add asset." });
      return false;
    }
  }, [assets, toast]);

  const deleteAsset = useCallback(async (asset: string) => {
    try {
      setAssets(prev => {
        const updated = prev.filter(a => a !== asset);
        saveStoredAssets(updated);
        return updated;
      });

      toast({ title: "Asset Deleted", description: `"${asset}" has been removed.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete asset." });
      return false;
    }
  }, [toast]);

  return { assets, addAsset, deleteAsset, isLoaded };
}
