"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import type { Account } from '@/lib/types';
import { useToast } from './use-toast';

export function useAccounts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setIsLoaded(true);
      return;
    }

    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching accounts:', error);
        setIsLoaded(true);
        return;
      }

      const mappedAccounts: Account[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        initialBalance: row.initial_balance,
        currentBalance: row.current_balance,
      }));

      setAccounts(mappedAccounts);
      setIsLoaded(true);
    };

    fetchAccounts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('accounts_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'accounts',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchAccounts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addAccount = useCallback(async (newAccount: Omit<Account, 'id' | 'currentBalance'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('accounts')
        .insert({
          user_id: user.id,
          name: newAccount.name,
          initial_balance: newAccount.initialBalance,
          current_balance: newAccount.initialBalance,
        });

      if (error) throw error;

      toast({ title: "Account Added", description: `"${newAccount.name}" has been created.` });
      return true;
    } catch (error) {
      console.error('Error adding account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not add account." });
      return false;
    }
  }, [user, toast]);

  const updateAccount = useCallback(async (accountId: string, updatedData: Omit<Account, 'id' | 'currentBalance'>) => {
    if (!user) return false;

    try {
      // Get current account to calculate balance difference
      const currentAccount = accounts.find((acc: Account) => acc.id === accountId);
      if (!currentAccount) return false;

      const balanceDifference = updatedData.initialBalance - currentAccount.initialBalance;
      const newCurrentBalance = (currentAccount.currentBalance ?? currentAccount.initialBalance) + balanceDifference;

      const { error } = await supabase
        .from('accounts')
        .update({
          name: updatedData.name,
          initial_balance: updatedData.initialBalance,
          current_balance: newCurrentBalance,
        })
        .eq('id', accountId);

      if (error) throw error;

      toast({ title: "Account Updated", description: "Your account details have been saved." });
      return true;
    } catch (error) {
      console.error('Error updating account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not update account." });
      return false;
    }
  }, [user, accounts, toast]);

  const deleteAccount = useCallback(async (accountId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;

      toast({ title: "Account Deleted", description: `The account has been removed.` });
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete account." });
      return false;
    }
  }, [user, toast]);

  return { accounts, addAccount, updateAccount, deleteAccount, isLoaded };
}
