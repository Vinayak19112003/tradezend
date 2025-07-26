
'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useStreamerMode } from '@/contexts/streamer-mode-context';
import { useGeneralSettings } from '@/hooks/use-general-settings';
import { Skeleton } from '../ui/skeleton';

export default function PreferencesCard() {
    const { setTheme, theme } = useTheme();
    const { isStreamerMode, toggleStreamerMode } = useStreamerMode();
    const { settings, updateSettings, isLoaded } = useGeneralSettings();
    
    const handleCurrencyChange = (value: string) => {
        updateSettings({ ...settings, currency: value });
    }

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
                 <div className="flex items-center justify-between">
                    <Label htmlFor="currency-select">Currency</Label>
                    <Select value={settings.currency} onValueChange={handleCurrencyChange}>
                        <SelectTrigger id="currency-select" className="w-[180px]">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="inr">INR (₹)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between">
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
