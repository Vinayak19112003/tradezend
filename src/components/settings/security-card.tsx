
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';


export default function SecurityCard() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleChangePassword = async () => {
        setIsLoading(true);
        try {
            const user = auth.currentUser;
            if (user && user.email) {
                await sendPasswordResetEmail(auth, user.email);
                toast({
                    title: "Success",
                    description: "A password reset link has been sent to your email.",
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No authenticated user found.",
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to send password reset email.",
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                    Manage your account security settings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Change Password</p>
                    <Button variant="outline" onClick={handleChangePassword} disabled={isLoading}>
                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

