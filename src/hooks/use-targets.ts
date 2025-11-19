"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

type Targets = {
    profit: number;
    loss: number;
};

export function useTargets() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [targets, setTargets] = useState<Targets>({ profit: 0, loss: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!user) {
            setTargets({ profit: 0, loss: 0 });
            setIsLoaded(true);
            return;
        }

        const fetchTargets = async () => {
            const { data, error } = await supabase
                .from('user_settings')
                .select('daily_target, weekly_target, monthly_target')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching targets:', error);
            }

            if (data) {
                setTargets({
                    profit: data.daily_target || 0,
                    loss: data.weekly_target || 0,
                });
            }

            setIsLoaded(true);
        };

        fetchTargets();
    }, [user]);

    const updateTargets = useCallback(async (newTargets: Partial<Targets>) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to update targets.' });
            return;
        }

        try {
            const updateData: any = {};
            if (newTargets.profit !== undefined) updateData.daily_target = newTargets.profit;
            if (newTargets.loss !== undefined) updateData.weekly_target = newTargets.loss;

            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    ...updateData,
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;

            setTargets(prev => ({ ...prev, ...newTargets }));
            toast({
                title: "Targets Updated",
                description: "Your profit and loss targets have been saved.",
            });
        } catch (error) {
            console.error("Error updating targets:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not save your targets.",
            });
        }
    }, [user, toast]);

    return { targets, updateTargets, isLoaded };
}
