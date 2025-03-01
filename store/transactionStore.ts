import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction, TimeFilter } from "@/types";
import { generateId } from "@/utils/helpers";
import { useWalletStore } from "./walletStore";

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getFilteredTransactions: (
    filters: {
      walletId?: string;
      categoryId?: string;
      type?: "income" | "expense";
      timeFilter?: TimeFilter;
      searchQuery?: string;
    }
  ) => Transaction[];
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      
      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: generateId() };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
        
        // Update wallet balance
        const amount = transaction.type === "income" 
          ? transaction.amount 
          : -transaction.amount;
        useWalletStore.getState().updateBalance(transaction.walletId, amount);
      },
      
      updateTransaction: (id, updates) => {
        const currentTransaction = get().transactions.find(t => t.id === id);
        if (!currentTransaction) return;
        
        // If wallet or amount changed, update wallet balances
        if (updates.walletId !== undefined || updates.amount !== undefined || updates.type !== undefined) {
          // Reverse the old transaction effect
          const oldAmount = currentTransaction.type === "income" 
            ? -currentTransaction.amount 
            : currentTransaction.amount;
          useWalletStore.getState().updateBalance(currentTransaction.walletId, oldAmount);
          
          // Apply the new transaction effect
          const newType = updates.type || currentTransaction.type;
          const newAmount = updates.amount || currentTransaction.amount;
          const newWalletId = updates.walletId || currentTransaction.walletId;
          
          const newEffect = newType === "income" ? newAmount : -newAmount;
          useWalletStore.getState().updateBalance(newWalletId, newEffect);
        }
        
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, ...updates } : transaction
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        const transaction = get().transactions.find(t => t.id === id);
        if (!transaction) return;
        
        // Reverse the transaction effect on wallet balance
        const amount = transaction.type === "income" 
          ? -transaction.amount 
          : transaction.amount;
        useWalletStore.getState().updateBalance(transaction.walletId, amount);
        
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      getFilteredTransactions: (filters) => {
        const { transactions } = get();
        return transactions.filter((transaction) => {
          // Filter by wallet
          if (filters.walletId && transaction.walletId !== filters.walletId) {
            return false;
          }
          
          // Filter by category
          if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
            return false;
          }
          
          // Filter by type (income/expense)
          if (filters.type && transaction.type !== filters.type) {
            return false;
          }
          
          // Filter by time period
          if (filters.timeFilter) {
            const transactionDate = new Date(transaction.date);
            const today = new Date();
            
            switch (filters.timeFilter.type) {
              case "daily":
                const isToday = 
                  transactionDate.getDate() === today.getDate() &&
                  transactionDate.getMonth() === today.getMonth() &&
                  transactionDate.getFullYear() === today.getFullYear();
                if (!isToday) return false;
                break;
                
              case "weekly":
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                if (transactionDate < weekStart) return false;
                break;
                
              case "monthly":
                const isThisMonth = 
                  transactionDate.getMonth() === today.getMonth() &&
                  transactionDate.getFullYear() === today.getFullYear();
                if (!isThisMonth) return false;
                break;
                
              case "quarterly":
                const currentQuarter = Math.floor(today.getMonth() / 3);
                const transactionQuarter = Math.floor(transactionDate.getMonth() / 3);
                const isThisQuarter = 
                  transactionQuarter === currentQuarter &&
                  transactionDate.getFullYear() === today.getFullYear();
                if (!isThisQuarter) return false;
                break;
                
              case "yearly":
                const isThisYear = transactionDate.getFullYear() === today.getFullYear();
                if (!isThisYear) return false;
                break;
                
              case "custom":
                if (filters.timeFilter.startDate && 
                    new Date(filters.timeFilter.startDate) > transactionDate) {
                  return false;
                }
                if (filters.timeFilter.endDate && 
                    new Date(filters.timeFilter.endDate) < transactionDate) {
                  return false;
                }
                break;
            }
          }
          
          // Filter by search query
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            return transaction.description.toLowerCase().includes(query);
          }
          
          return true;
        });
      },
    }),
    {
      name: "transaction-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);