"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const MISTAKE_TAGS_STORAGE_KEY = 'tradezend_mistake_tags';
const DEFAULT_MISTAKE_TAGS = ['FOMO', 'Overtrading', 'Early Exit', 'Revenge Trade', 'No Stop Loss', 'Wrong Position Size'];

const getStoredMistakeTags = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_MISTAKE_TAGS;
  try {
    const stored = localStorage.getItem(MISTAKE_TAGS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(MISTAKE_TAGS_STORAGE_KEY, JSON.stringify(DEFAULT_MISTAKE_TAGS));
      return DEFAULT_MISTAKE_TAGS;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_MISTAKE_TAGS;
  }
};

const saveStoredMistakeTags = (tags: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MISTAKE_TAGS_STORAGE_KEY, JSON.stringify(tags));
};

export function useMistakeTags() {
  const { toast } = useToast();
  const [mistakeTags, setMistakeTags] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMistakeTags(getStoredMistakeTags());
    setIsLoaded(true);
  }, []);

  const addMistakeTag = useCallback(async (tag: string) => {
    try {
      if (mistakeTags.includes(tag)) {
        toast({ variant: "destructive", title: "Error", description: "Tag already exists." });
        return false;
      }

      setMistakeTags(prev => {
        const updated = [...prev, tag];
        saveStoredMistakeTags(updated);
        return updated;
      });

      toast({ title: "Mistake Tag Added", description: `"${tag}" has been added.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add tag." });
      return false;
    }
  }, [mistakeTags, toast]);

  const deleteMistakeTag = useCallback(async (tag: string) => {
    try {
      setMistakeTags(prev => {
        const updated = prev.filter(t => t !== tag);
        saveStoredMistakeTags(updated);
        return updated;
      });

      toast({ title: "Mistake Tag Deleted", description: `"${tag}" has been removed.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete tag." });
      return false;
    }
  }, [toast]);

  return { mistakeTags, addMistakeTag, deleteMistakeTag, isLoaded };
}
