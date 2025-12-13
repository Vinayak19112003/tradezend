
'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useStreamerMode } from '@/contexts/streamer-mode-context';
import { useGeneralSettings, type GeneralSettings } from '@/hooks/use-general-settings';
import { Skeleton } from '../ui/skeleton';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PreferencesCard() {
    const { setTheme, theme } = useTheme();
    const { isStreamerMode, toggleStreamerMode } = useStreamerMode();
    const { settings, updateSettings, isLoaded } = useGeneralSettings();
    
    const [localSettings, setLocalSettings] = useState<GeneralSettings>(settings);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if(isLoaded) {
            setLocalSettings(settings);
        }
    }, [isLoaded, settings]);

    const handleCurrencyChange = (value: string) => {
        setLocalSettings(prev => ({...prev, currency: value as 'usd' | 'inr'}));
    }
    
    const handleSave = async () => {
        setIsSaving(true);
        await updateSettings(localSettings);
        setIsSaving(false);
    }
    
    const handleCancel = () => {
        setLocalSettings(settings);
    }

    const hasChanged = settings.currency !== localSettings.currency;

    if (!isLoaded) {
         return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                    Customize the look and feel of your journal.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="theme-select">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme-select" className="w-[180px]">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="currency-select">Currency</Label>
                        <Select value={localSettings.currency} onValueChange={handleCurrencyChange}>
                            <SelectTrigger id="currency-select" className="w-[180px]">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="usd">USD ($)</SelectItem>
                                <SelectItem value="inr">INR (₹)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={cn(
                        "flex justify-end gap-2 transition-all duration-300 ease-in-out",
                        hasChanged ? "max-h-10 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    )}>
                        <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </div>
                 </div>
                <div className="flex items-center justify-between pt-2 border-t">
                    <Label htmlFor="streamer-mode-switch" className="flex flex-col gap-1">
                        <span>Streamer Mode</span>
                        <span className="text-xs text-muted-foreground">Hide sensitive information on screen.</span>
                    </Label>
                    <Switch
                        id="streamer-mode-switch"
                        checked={isStreamerMode}
                        onCheckedChange={toggleStreamerMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
