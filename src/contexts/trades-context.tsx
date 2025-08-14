
'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  writeBatch,
  getDocs,
  query,
  runTransaction,
  where,
  setDoc,
  CollectionReference,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { Trade } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { DEFAULT_ACCOUNTS } from '@/lib/constants';
import { useAccountContext } from './account-context';

const TRADES_COLLECTION = 'trades';
const ACCOUNTS_COLLECTION = 'settings';
const ACCOUNTS_DOC_ID = 'userConfig'; 

/**
 * Removes properties with `undefined` values from an object.
 * Firestore does not support `undefined`.
 * @param obj The object to clean.
 * @returns A new object with `undefined` properties removed.
 */
const cleanupTradeData = (obj: any) => {
    const newObj: any = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};

interface TradesContextType {
    trades: Trade[];
    isTradesLoading: boolean;
    addTrade: (trade: Omit<Trade, 'id'>) => Promise<boolean>;
    addMultipleTrades: (newTrades: Omit<Trade, 'id'>[]) => Promise<{success: boolean, addedCount: number}>;
    updateTrade: (trade: Trade) => Promise<boolean>;
    deleteTrade: (id: string) => Promise<boolean>;
    deleteAllTrades: (accountId: string) => Promise<boolean>;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

export function TradesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const { selectedAccountId } = useAccountContext();

    const [trades, setTrades] = useState<Trade[]>([]);
    const [isTradesLoading, setIsTradesLoading] = useState(true);

    const getTradesCollectionRef = useCallback(() => {
        if (!user || !db) return null;
        return collection(db, 'users', user.uid, TRADES_COLLECTION);
    }, [user]);

    const getAccountsDocRef = useCallback(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid, ACCOUNTS_COLLECTION, ACCOUNTS_DOC_ID);
    }, [user]);


     useEffect(() => {
        if (!user || !selectedAccountId) {
            setTrades([]);
            setIsTradesLoading(false);
            return;
        }

        setIsTradesLoading(true);
        const tradesCollectionRef = getTradesCollectionRef() as CollectionReference<Trade>;
        const q = query(tradesCollectionRef, where('accountId', '==', selectedAccountId), orderBy('date', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedTrades = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                date: (doc.data().date as unknown as Timestamp).toDate()
            })) as Trade[];
            setTrades(fetchedTrades);
            setIsTradesLoading(false);
        }, (error) => {
             if (error.code === 'failed-precondition') {
                console.error("Firebase Index Required:", error);
                toast({
                    variant: 'destructive',
                    title: 'Firebase Index Required',
                    description: 'Please create the required Firestore index by clicking the link in the console error.',
                    duration: 10000,
                });
            } else {
                console.error("Error fetching trades:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch trade data."
                });
            }
            setIsTradesLoading(false);
        });

        return () => unsubscribe();
    }, [user, selectedAccountId, getTradesCollectionRef, toast]);


    const addTrade = useCallback(async (trade: Omit<Trade, 'id'>) => {
        const tradesCollection = getTradesCollectionRef();
        const accountsDocRef = getAccountsDocRef();
        if (!tradesCollection || !accountsDocRef) {
            throw new Error("User is not authenticated.");
        }

        try {
            await runTransaction(db, async (transaction) => {
                const accountsDoc = await transaction.get(accountsDocRef);
                const newTradeRef = doc(tradesCollection);

                if (!accountsDoc.exists()) {
                    console.warn("Accounts document not found for user. Creating it and skipping balance update for this trade.");
                    transaction.set(accountsDocRef, { accounts: DEFAULT_ACCOUNTS });
                } else {
                    const accounts = accountsDoc.data().accounts || [];
                    const accountIndex = accounts.findIndex((acc: any) => acc.id === trade.accountId);
                    
                    if (accountIndex === -1) {
                        throw new Error(`Account with ID ${trade.accountId} not found. Please select a valid account.`);
                    };

                    const updatedAccounts = [...accounts];
                    const currentBalance = updatedAccounts[accountIndex].currentBalance ?? updatedAccounts[accountIndex].initialBalance;
                    updatedAccounts[accountIndex].currentBalance = currentBalance + (trade.pnl || 0);

                    transaction.update(accountsDocRef, { accounts: updatedAccounts });
                }
                
                const cleanedTrade = cleanupTradeData(trade);
                transaction.set(newTradeRef, {
                    ...cleanedTrade,
                    date: Timestamp.fromDate(trade.date),
                });
            });
            return true;
        } catch (error: any) {
            console.error("Error adding trade:", error);
            throw error; // Re-throw to be caught by the form
        }
    }, [getTradesCollectionRef, getAccountsDocRef]);

    const addMultipleTrades = useCallback(async (newTrades: Omit<Trade, 'id'>[]) => {
        const tradesCollection = getTradesCollectionRef();
        if (!tradesCollection || newTrades.length === 0) return { success: false, addedCount: 0 };
        try {
            const batch = writeBatch(db);
            newTrades.forEach(trade => {
                const docRef = doc(tradesCollection);
                const tradeWithDateObject = { ...trade, date: new Date(trade.date) };
                const cleanedTrade = cleanupTradeData(tradeWithDateObject);
                batch.set(docRef, { ...cleanedTrade, date: Timestamp.fromDate(cleanedTrade.date) });
            });

            await batch.commit();

            toast({
                title: "Import Successful",
                description: "Batch import does not automatically update account balances. Please review balances manually if needed.",
            })

            return { success: true, addedCount: newTrades.length };
        } catch (error) {
            console.error("Error batch adding trades:", error);
            toast({ variant: "destructive", title: "Import Error", description: "Could not save the imported trades." });
            return { success: false, addedCount: 0 };
        }
    }, [getTradesCollectionRef, toast]);

    const updateTrade = useCallback(async (trade: Trade) => {
        const tradesCollection = getTradesCollectionRef();
        const accountsDocRef = getAccountsDocRef();
        if (!tradesCollection || !accountsDocRef || !trade.id) {
            throw new Error("User is not authenticated.");
        };

        try {
            const tradeRef = doc(tradesCollection, trade.id);
            await runTransaction(db, async (transaction) => {
                const originalTradeDoc = await transaction.get(tradeRef);
                const accountsDoc = await transaction.get(accountsDocRef);

                if (!originalTradeDoc.exists()) {
                    throw new Error("Original trade not found for update.");
                }

                const originalTrade = { ...originalTradeDoc.data(), id: originalTradeDoc.id } as Trade;
                const pnlDifference = (trade.pnl || 0) - (originalTrade.pnl || 0);

                if (accountsDoc.exists()) {
                    const accounts = accountsDoc.data().accounts || [];
                    const accountIndex = accounts.findIndex((acc: any) => acc.id === trade.accountId);

                    if (accountIndex !== -1) {
                        const updatedAccounts = [...accounts];
                        const currentBalance = updatedAccounts[accountIndex].currentBalance ?? updatedAccounts[accountIndex].initialBalance;
                        updatedAccounts[accountIndex].currentBalance = currentBalance + pnlDifference;
                        transaction.update(accountsDocRef, { accounts: updatedAccounts });
                    } else {
                         console.warn(`Account with ID ${trade.accountId} not found. Skipping balance update.`);
                    }
                } else {
                     console.warn("Accounts document not found for user. Skipping balance update.");
                }
                
                const { id, ...tradeData } = trade;
                const cleanedTrade = cleanupTradeData(tradeData);
                transaction.update(tradeRef, {
                    ...cleanedTrade,
                    date: Timestamp.fromDate(trade.date),
                });
            });
             return true;
        } catch (error: any) {
            console.error("Error updating trade:", error);
            throw error; // Re-throw to be caught by the form
        }
    }, [getTradesCollectionRef, getAccountsDocRef]);

    const deleteTrade = useCallback(async (id: string) => {
        const tradesCollection = getTradesCollectionRef();
        const accountsDocRef = getAccountsDocRef();
        if (!tradesCollection || !accountsDocRef) return false;

        try {
            const tradeRef = doc(tradesCollection, id);

             await runTransaction(db, async (transaction) => {
                const tradeDoc = await transaction.get(tradeRef);
                const accountsDoc = await transaction.get(accountsDocRef);

                if (!tradeDoc.exists()) {
                    throw new Error("Trade to delete not found.");
                }

                const tradeToDelete = tradeDoc.data() as Trade;
                const pnlToRemove = tradeToDelete.pnl || 0;

                if (accountsDoc.exists()) {
                    const accounts = accountsDoc.data().accounts || [];
                    const accountIndex = accounts.findIndex((acc: any) => acc.id === tradeToDelete.accountId);
                    
                    if (accountIndex !== -1) {
                        const updatedAccounts = [...accounts];
                        const currentBalance = updatedAccounts[accountIndex].currentBalance ?? updatedAccounts[accountIndex].initialBalance;
                        updatedAccounts[accountIndex].currentBalance = currentBalance - pnlToRemove;
                        transaction.update(accountsDocRef, { accounts: updatedAccounts });
                    } else {
                         console.warn(`Account with ID ${tradeToDelete.accountId} not found. Skipping balance update.`);
                    }
                } else {
                     console.warn("Accounts document not found for user. Skipping balance update.");
                }
                
                transaction.delete(tradeRef);
             });

            toast({ title: "Trade Deleted", description: "The trade has been removed from your log." });
            return true;
        } catch (error: any) {
            console.error("Error deleting trade:", error);
            toast({ variant: "destructive", title: "Error Deleting Trade", description: error.message || "Could not delete the trade." });
            return false;
        }
    }, [getTradesCollectionRef, getAccountsDocRef, toast]);

    const deleteAllTrades = useCallback(async (accountId: string) => {
        const tradesCollection = getTradesCollectionRef();
        if (!tradesCollection || !accountId) return false;

        try {
            const q = query(tradesCollection, where('accountId', '==', accountId));
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(db);
            querySnapshot.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            
            toast({
                title: "All Trades Cleared",
                description: "Your account balance for this account has not been reset. You may need to edit it manually in Settings.",
            })
            return true;
        } catch (error) {
            console.error("Error deleting all trades:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not clear trade log." });
            return false;
        }
    }, [getTradesCollectionRef, toast]);

    const value = useMemo(() => ({
        trades,
        isTradesLoading,
        addTrade,
        addMultipleTrades,
        updateTrade,
        deleteTrade,
        deleteAllTrades,
    }), [trades, isTradesLoading, addTrade, addMultipleTrades, updateTrade, deleteTrade, deleteAllTrades]);

    return <TradesContext.Provider value={value}>{children}</TradesContext.Provider>;
}

export const useTrades = (): TradesContextType => {
    const context = useContext(TradesContext);
    if (!context) {
        throw new Error('useTrades must be used within a TradesProvider');
    }
    return context;
};
