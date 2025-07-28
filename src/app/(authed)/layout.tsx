
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TradeFormProvider, useTradeForm } from '@/contexts/trade-form-context';
import { Loader2 } from 'lucide-react';
import { TradesProvider } from '@/contexts/trades-context';
import { Header } from '@/components/shell/header';
import { AccountProvider } from '@/contexts/account-context';
import MainLayout from '@/components/shell/main-layout';

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
                        <div className="flex min-h-screen w-full flex-col bg-muted/40">
                            <Header />
                            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                                <MainLayout />
                            </main>
                        </div>
                    </TradeFormController>
                </AuthGuard>
            </TradeFormProvider>
        </TradesProvider>
    </AccountProvider>
  )
}
