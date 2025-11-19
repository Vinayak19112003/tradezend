"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { type TradingModel } from '@/lib/types';
import { useToast } from './use-toast';

export type ModelSection = keyof TradingModel;

const DEFAULT_MODEL: TradingModel = {
    week: [],
    day: [],
    trigger: [],
    ltf: [],
};

export function useTradingModel() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [model, setModel] = useState<TradingModel>(DEFAULT_MODEL);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!user) {
            setModel(DEFAULT_MODEL);
            setIsLoaded(true);
            return;
        }

        const fetchModel = async () => {
            const { data, error } = await supabase
                .from('trading_model')
                .select('week, day, trigger, ltf')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching trading model:', error);
            }

            if (data) {
                setModel({
                    week: data.week || [],
                    day: data.day || [],
                    trigger: data.trigger || [],
                    ltf: data.ltf || [],
                });
            }

            setIsLoaded(true);
        };

        fetchModel();
    }, [user]);

    const updateWholeObject = useCallback(async (newModel: TradingModel) => {
        if (!user) return false;

        try {
            const { error } = await supabase
                .from('trading_model')
                .upsert({
                    user_id: user.id,
                    week: newModel.week,
                    day: newModel.day,
                    trigger: newModel.trigger,
                    ltf: newModel.ltf,
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;

            setModel(newModel);
            return true;
        } catch (error) {
            console.error('Error updating trading model:', error);
            return false;
        }
    }, [user]);

    const addItem = useCallback(async (section: ModelSection, item: string) => {
        const newModel = { ...model };
        if (newModel[section].includes(item)) {
            toast({
                variant: 'destructive',
                title: 'Item Exists',
                description: 'This item is already in your checklist.',
            });
            return false;
        }
        newModel[section] = [...newModel[section], item];
        return await updateWholeObject(newModel);
    }, [model, updateWholeObject, toast]);

    const updateItem = useCallback(async (section: ModelSection, oldItem: string, newItem: string) => {
        const newModel = { ...model };
        const index = newModel[section].indexOf(oldItem);
        if (index !== -1) {
            newModel[section][index] = newItem;
            return await updateWholeObject(newModel);
        }
        return false;
    }, [model, updateWholeObject]);

    const updateOrder = useCallback(async (section: ModelSection, newOrder: string[]) => {
        const newModel = { ...model };
        newModel[section] = newOrder;
        await updateWholeObject(newModel);
    }, [model, updateWholeObject]);

    return { model, addItem, updateItem, updateOrder, updateModel: updateWholeObject, isLoaded };
}
