"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const SETTINGS_STORAGE_KEY = 'tradezend_general_settings';

export type GeneralSettings = {
    currency: 'usd' | 'inr';
    streamerMode?: boolean;
};

const DEFAULT_SETTINGS: GeneralSettings = { currency: 'usd', streamerMode: false };

const getStoredSettings = (): GeneralSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
            return DEFAULT_SETTINGS;
        }
        return JSON.parse(stored);
    } catch {
        return DEFAULT_SETTINGS;
    }
};

const saveStoredSettings = (settings: GeneralSettings): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export function useGeneralSettings() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setSettings(getStoredSettings());
        setIsLoaded(true);
    }, []);

    const updateSettings = useCallback(async (newSettings: Partial<GeneralSettings>) => {
        try {
            setSettings(prev => {
                const updated = { ...prev, ...newSettings };
                saveStoredSettings(updated);
                return updated;
            });
            toast({ title: "Settings Updated", description: "Your preferences have been saved." });
            return true;
        } catch (error) {
            console.error('Error updating settings:', error);
            toast({ variant: "destructive", title: "Error", description: "Could not update settings." });
            return false;
        }
    }, [toast]);

    return { settings, updateSettings, isLoaded };
}
