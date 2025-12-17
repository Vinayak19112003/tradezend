"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Account } from '@/lib/types';
import { useToast } from './use-toast';

const ACCOUNTS_STORAGE_KEY = 'tradezend_accounts';
const DEFAULT_ACCOUNT: Account = {
  id: 'default-account',
  name: 'Main Account',
  initialBalance: 10000,
  currentBalance: 10000,
};

// Helper function to get accounts from localStorage
const getStoredAccounts = (): Account[] => {
  if (typeof window === 'undefined') return [DEFAULT_ACCOUNT];
  try {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!stored) {
      // Create default account if none exists
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([DEFAULT_ACCOUNT]));
      return [DEFAULT_ACCOUNT];
    }
    return JSON.parse(stored);
  } catch {
    return [DEFAULT_ACCOUNT];
  }
};

// Helper function to save accounts to localStorage
const saveStoredAccounts = (accounts: Account[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to localStorage:', e);
  }
};

export function useAccounts() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredAccounts();
    setAccounts(stored);
    setIsLoaded(true);
  }, []);

  const addAccount = useCallback(async (newAccount: Omit<Account, 'id' | 'currentBalance'>) => {
    try {
      const account: Account = {
        id: crypto.randomUUID(),
        name: newAccount.name,
        initialBalance: newAccount.initialBalance,
        currentBalance: newAccount.initialBalance,
      };

      setAccounts(prev => {
        const updated = [...prev, account];
        saveStoredAccounts(updated);
        return updated;
      });

      toast({ title: "Account Added", description: `"${newAccount.name}" has been created.` });
      return true;
    } catch (error) {
      console.error('Error adding account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not add account." });
      return false;
    }
  }, [toast]);

  const updateAccount = useCallback(async (accountId: string, updatedData: Omit<Account, 'id' | 'currentBalance'>) => {
    try {
      setAccounts(prev => {
        const updated = prev.map(acc => {
          if (acc.id !== accountId) return acc;

          const balanceDifference = updatedData.initialBalance - acc.initialBalance;
          const newCurrentBalance = (acc.currentBalance ?? acc.initialBalance) + balanceDifference;

          return {
            ...acc,
            name: updatedData.name,
            initialBalance: updatedData.initialBalance,
            currentBalance: newCurrentBalance,
          };
        });
        saveStoredAccounts(updated);
        return updated;
      });

      toast({ title: "Account Updated", description: "Your account details have been saved." });
      return true;
    } catch (error) {
      console.error('Error updating account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not update account." });
      return false;
    }
  }, [toast]);

  const deleteAccount = useCallback(async (accountId: string) => {
    try {
      setAccounts(prev => {
        const updated = prev.filter(acc => acc.id !== accountId);
        // Ensure at least one account exists
        if (updated.length === 0) {
          updated.push(DEFAULT_ACCOUNT);
        }
        saveStoredAccounts(updated);
        return updated;
      });

      toast({ title: "Account Deleted", description: `The account has been removed.` });
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete account." });
      return false;
    }
  }, [toast]);

  return { accounts, addAccount, updateAccount, deleteAccount, isLoaded };
}
