
'use client';

import { useState } from 'react';
import { useStrategies } from '@/hooks/use-strategies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AddStrategyDialog } from '../dashboard/add-strategy-dialog';

export function ManageStrategiesCard() {
    const { strategies, isLoaded } = useStrategies();

    if (!isLoaded) {
        return <Skeleton className="h-60" />;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Strategy Management</CardTitle>
                        <CardDescription>Add, edit, or remove your trading strategies.</CardDescription>
                    </div>
                     <AddStrategyDialog />
                </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-2">
                    {strategies.map((strategy: any) => (
                         <div key={strategy} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                            <div>
                                <span className="text-sm font-medium">{strategy}</span>
                            </div>
                        </div>
                    ))}
                     {strategies.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground p-4">
                            You haven&apos;t added any trading strategies yet.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
