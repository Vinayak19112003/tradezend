
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function UserProfileCard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <Card>
            <CardHeader className="items-center text-center">
                <Avatar className="h-20 w-20 mb-2">
                    <AvatarImage src="/avatars/01.png" alt="User avatar" />
                    <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{user?.displayName || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleLogout} variant="outline" className="w-full">
                    Log Out
                </Button>
            </CardContent>
        </Card>
    );
}
