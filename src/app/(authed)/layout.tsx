
'use client';

/**
 * @fileoverview This is the main layout for all authenticated pages in the application.
 * It wraps the content of each page with common UI elements like the header.
 * It also contains the logic for the "Add/Edit Trade" form, which is presented as a
 * modal dialog or a sheet on mobile devices.
 */

import { useState, memo, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Trade } from '@/lib/types';
import AuthGuard from '@/components/auth/auth-guard';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TradeFormProvider, useTradeForm } from '@/contexts/trade-form-context';
import { Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TradesProvider } from '@/contexts/trades-context';
import { AccountProvider } from '@/contexts/account-context';
import { AppSidebar } from '@/components/shell/app-sidebar';


// Dynamically import the TradeForm to optimize the initial bundle size.
// The form is only loaded when the user triggers it.
const TradeForm = dynamic(() => import('@/components/trade/trade-form').then(mod => mod.TradeForm), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
});

/**
 * This component contains the state and logic for the Add/Edit Trade form.
 * It is separated so that it can be wrapped by the TradeFormProvider.
 */
const TradeFormController = memo(function TradeFormController({ children }: { children: React.ReactNode }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTrade, setEditingTrade] = useState<Trade | undefined>(undefined);
    const { setOpenFormFunction } = useTradeForm();
    const isMobile = useIsMobile();

    const handleOpenForm = (trade?: Trade) => {
        setEditingTrade(trade);
        setIsFormOpen(true);
    };

    // Register the function to open the form with the context
    useEffect(() => {
        setOpenFormFunction(() => handleOpenForm);
    }, [setOpenFormFunction]);

    const handleCloseForm = () => {
        setEditingTrade(undefined);
        setIsFormOpen(false);
    };

    const handleSaveSuccess = () => {
        handleCloseForm();
    };

    const FormComponent = isMobile ? Sheet : Dialog;
    const FormContentComponent = isMobile ? SheetContent : DialogContent;
    const FormHeaderComponent = isMobile ? SheetHeader : DialogHeader;
    const FormTitleComponent = isMobile ? SheetTitle : DialogTitle;
    const FormDescriptionComponent = isMobile ? SheetDescription : DialogDescription;

    return (
        <>
            {children}
            <FormComponent open={isFormOpen} onOpenChange={setIsFormOpen}>
                <FormContentComponent className={cn(isMobile ? "w-full" : "max-w-4xl")}>
                    <FormHeaderComponent>
                        <FormTitleComponent>{editingTrade ? "Edit Trade" : "Add New Trade"}</FormTitleComponent>
                        <FormDescriptionComponent>
                            Fill in the details of your trade. Accurate records lead to better insights.
                        </FormDescriptionComponent>
                    </FormHeaderComponent>
                    <div className={cn("p-4 overflow-y-auto max-h-[80vh]")}>
                        <TradeForm
                            trade={editingTrade}
                            onSaveSuccess={handleSaveSuccess}
                            setOpen={setIsFormOpen}
                        />
                    </div>
                </FormContentComponent>
            </FormComponent>
        </>
    );
});


/**
 * The root layout component for all authenticated pages.
 * It wraps the main content with necessary context providers.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The page content passed by Next.js.
 */
export default function AuthedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AccountProvider>
            <TradesProvider>
                <TradeFormProvider>
                    <AuthGuard>
                        <TradeFormController>
                            <div className="flex min-h-screen w-full bg-black">
                                {/* Desktop Sidebar */}
                                <div className="hidden md:flex">
                                    <AppSidebar />
                                </div>

                                {/* Mobile Header & Sidebar */}
                                <div className="md:hidden flex items-center h-16 px-4 border-b border-white/5 bg-black/60 sticky top-0 z-40 backdrop-blur-md">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="ghost" size="icon" className="mr-4 text-zinc-400">
                                                <Menu className="h-6 w-6" />
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="p-0 border-r border-white/10 bg-black w-[280px]">
                                            <AppSidebar />
                                        </SheetContent>
                                    </Sheet>
                                    <span className="font-bold text-lg tracking-tight text-white">TradeZend</span>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-background">
                                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
                                        {children}
                                    </main>
                                </div>
                            </div>
                        </TradeFormController>
                    </AuthGuard>
                </TradeFormProvider>
            </TradesProvider>
        </AccountProvider>
    )
}
