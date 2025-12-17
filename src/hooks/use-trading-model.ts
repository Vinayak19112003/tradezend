"use client";

import { useState, useEffect, useCallback } from 'react';
import { type TradingModel } from '@/lib/types';
import { useToast } from './use-toast';

export type ModelSection = keyof TradingModel;

const TRADING_MODEL_STORAGE_KEY = 'tradezend_trading_model';
const DEFAULT_MODEL: TradingModel = {
    week: ['HTF Trend Analysis', 'Key Levels Identification'],
    day: ['Daily Bias', 'News Check'],
    trigger: ['Liquidity Sweep', 'Order Block'],
    ltf: ['Entry Confirmation', 'Risk Calculation'],
};

const getStoredModel = (): TradingModel => {
    if (typeof window === 'undefined') return DEFAULT_MODEL;
    try {
        const stored = localStorage.getItem(TRADING_MODEL_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(TRADING_MODEL_STORAGE_KEY, JSON.stringify(DEFAULT_MODEL));
            return DEFAULT_MODEL;
        }
        return JSON.parse(stored);
    } catch {
        return DEFAULT_MODEL;
    }
};

const saveStoredModel = (model: TradingModel): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TRADING_MODEL_STORAGE_KEY, JSON.stringify(model));
};

export function useTradingModel() {
    const { toast } = useToast();
    const [model, setModel] = useState<TradingModel>(DEFAULT_MODEL);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setModel(getStoredModel());
        setIsLoaded(true);
    }, []);

    const updateWholeObject = useCallback(async (newModel: TradingModel) => {
        try {
            setModel(newModel);
            saveStoredModel(newModel);
            return true;
        } catch (error) {
            console.error('Error updating trading model:', error);
            return false;
        }
    }, []);

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
