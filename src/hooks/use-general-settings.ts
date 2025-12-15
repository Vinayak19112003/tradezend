"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export type GeneralSettings = {
    currency: 'usd' | 'inr';
    streamerMode?: boolean;
};

export function useGeneralSettings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [settings, setSettings] = useState<GeneralSettings>({ currency: 'usd', streamerMode: false });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!user) {
            setSettings({ currency: 'usd', streamerMode: false });
            setIsLoaded(true);
            return;
        }

        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('user_settings')
                .select('currency, streamer_mode')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching settings:', error);
            }

            if (data) {
                const row = data as any;
                setSettings({
                    currency: row.currency as 'usd' | 'inr',
                    streamerMode: row.streamer_mode,
                });
            }

            setIsLoaded(true);
        };

        fetchSettings();
    }, [user]);

    const updateSettings = useCallback(async (newSettings: Partial<GeneralSettings>) => {
        if (!user) return false;

        try {
            const updateData: any = {};
            if (newSettings.currency !== undefined) updateData.currency = newSettings.currency;
            if (newSettings.streamerMode !== undefined) updateData.streamer_mode = newSettings.streamerMode;

            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    ...updateData,
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;

            setSettings(prev => ({ ...prev, ...newSettings }));
            toast({ title: "Settings Updated", description: "Your preferences have been saved." });
            return true;
        } catch (error) {
            console.error('Error updating settings:', error);
            toast({ variant: "destructive", title: "Error", description: "Could not update settings." });
            return false;
        }
    }, [user, toast]);

    return { settings, updateSettings, isLoaded };
}
