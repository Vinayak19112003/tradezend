"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Account } from '@/lib/types';
import { useToast } from './use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

const DEFAULT_ACCOUNT_NAME = 'Main Account';
const DEFAULT_INITIAL_BALANCE = 10000;

export function useAccounts() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch accounts from Supabase
  const fetchAccounts = useCallback(async () => {
    if (!user) {
      setAccounts([]);
      setIsLoaded(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }); // Keep consistent order

      if (error) throw error;

      if (!data || data.length === 0) {
        // Create default account if none exists
        const defaultAccountPayload = {
          user_id: user.id,
          name: DEFAULT_ACCOUNT_NAME,
          initial_balance: DEFAULT_INITIAL_BALANCE,
          current_balance: DEFAULT_INITIAL_BALANCE
        };

        const { data: newAccount, error: createError } = await supabase
          .from('accounts')
          .insert(defaultAccountPayload)
          .select()
          .single();

        if (createError) throw createError;

        if (newAccount) {
          setAccounts([{
            id: newAccount.id,
            name: newAccount.name,
            initialBalance: newAccount.initial_balance,
            currentBalance: newAccount.current_balance
          }]);
        }
      } else {
        // Map DB snake_case columns to camelCase
        const mappedAccounts = data.map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          initialBalance: acc.initial_balance,
          currentBalance: acc.current_balance
        }));
        setAccounts(mappedAccounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load accounts." });
    } finally {
      setIsLoaded(true);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = useCallback(async (newAccount: Omit<Account, 'id' | 'currentBalance'>) => {
    if (!user) return false;
    try {
      const payload = {
        user_id: user.id,
        name: newAccount.name,
        initial_balance: newAccount.initialBalance,
        current_balance: newAccount.initialBalance, // Default current balance to initial
      };

      const { error } = await supabase
        .from('accounts')
        .insert(payload);

      if (error) throw error;

      toast({ title: "Account Added", description: `"${newAccount.name}" has been created.` });
      await fetchAccounts();
      return true;
    } catch (error) {
      console.error('Error adding account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not add account." });
      return false;
    }
  }, [user, toast, fetchAccounts]);

  const updateAccount = useCallback(async (accountId: string, updatedData: Omit<Account, 'id' | 'currentBalance'>) => {
    if (!user) return false;
    try {
      // First, get the current account to calculate balance difference
      const currentAccount = accounts.find(a => a.id === accountId);
      if (!currentAccount) throw new Error("Account not found");

      const balanceDifference = updatedData.initialBalance - (currentAccount.initialBalance || 0);
      const newCurrentBalance = (currentAccount.currentBalance || 0) + balanceDifference;

      const payload = {
        name: updatedData.name,
        initial_balance: updatedData.initialBalance,
        current_balance: newCurrentBalance
      };

      const { error } = await supabase
        .from('accounts')
        .update(payload)
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({ title: "Account Updated", description: "Your account details have been saved." });
      await fetchAccounts();
      return true;
    } catch (error) {
      console.error('Error updating account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not update account." });
      return false;
    }
  }, [user, accounts, toast, fetchAccounts]);

  const deleteAccount = useCallback(async (accountId: string) => {
    if (!user) return false;
    if (accounts.length <= 1) {
      toast({ variant: "destructive", title: "Cannot Delete", description: "You must have at least one account." });
      return false;
    }

    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({ title: "Account Deleted", description: `The account has been removed.` });
      await fetchAccounts();
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete account." });
      return false;
    }
  }, [user, accounts.length, toast, fetchAccounts]);

  return { accounts, addAccount, updateAccount, deleteAccount, isLoaded };
}
