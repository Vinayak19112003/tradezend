
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGeneralSettings, type GeneralSettings } from '@/hooks/use-general-settings';
import { Skeleton } from '../ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function GeneralSettings() {
    const { settings, updateSettings, isLoaded } = useGeneralSettings();
    const [localSettings, setLocalSettings] = useState<GeneralSettings>(settings);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isLoaded) {
            setLocalSettings(settings);
        }
    }, [settings, isLoaded]);

    const handleInputChange = (key: keyof GeneralSettings, value: string | number) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        const success = await updateSettings(localSettings);
        if (success) {
            toast({
                title: "Settings Saved",
                description: "Your general settings have been updated.",
            });
        }
        setIsSaving(false);
    };

    if (!isLoaded) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                    Manage your application-wide preferences.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="currency-format">Currency Format</Label>
                        <Select
                            value={localSettings.currency}
                            onValueChange={(value) => handleInputChange('currency', value)}
                        >
                            <SelectTrigger id="currency-format">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="usd">US Dollar - $</SelectItem>
                                <SelectItem value="cad">Canadian Dollar - $</SelectItem>
                                <SelectItem value="eur">Euro - €</SelectItem>
                                <SelectItem value="gbp">British Pound Sterling - £</SelectItem>
                                <SelectItem value="inr">Indian Rupee - ₹</SelectItem>
                                <SelectItem value="jpy">Japanese Yen - ¥</SelectItem>
                                <SelectItem value="sek">Swedish Krona - kr</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="default-order-date">Default Order Date</Label>
                        <Select
                           value={localSettings.defaultOrderDate}
                           onValueChange={(value) => handleInputChange('defaultOrderDate', value)}
                        >
                            <SelectTrigger id="default-order-date">
                                <SelectValue placeholder="Select default" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="previous">Previous Order Entry</SelectItem>
                                <SelectItem value="today">Today's Date</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="default-symbol">Default Symbol</Label>
                        <Input
                            id="default-symbol"
                            placeholder="e.g., EURUSD"
                            value={localSettings.defaultSymbol}
                            onChange={(e) => handleInputChange('defaultSymbol', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="default-qty">Default Qty</Label>
                        <Input
                            id="default-qty"
                            type="number"
                            placeholder="e.g., 1"
                            value={localSettings.defaultQty}
                            onChange={(e) => handleInputChange('defaultQty', Number(e.target.value))}
                        />
                    </div>
                </div>
                
                 <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
