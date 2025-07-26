
"use client";

import { useCallback } from 'react';
import useJournalSettings from './use-journal-settings';
import { DEFAULT_GENERAL_SETTINGS } from '@/lib/constants';

export type GeneralSettings = {
    currency: string;
};

export function useGeneralSettings() {
    const { items: settings, updateWholeObject, isLoaded } = useJournalSettings('generalSettings', DEFAULT_GENERAL_SETTINGS);

    const updateSettings = useCallback(async (newSettings: GeneralSettings) => {
        const success = await updateWholeObject(newSettings);
        return success;
    }, [updateWholeObject]);

    return { settings, updateSettings, isLoaded };
}
