import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Wallet } from "@/types";
import { generateId } from "@/utils/helpers";

interface WalletState {
  wallets: Wallet[];
  addWallet: (wallet: Omit<Wallet, "id">) => void;
  updateWallet: (id: string, updates: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
  updateBalance: (id: string, amount: number) => void;
}

const defaultWallets: Wallet[] = [
  {
    id: "cash",
    name: "Cash",
    balance: 1000,
    icon: "Wallet",
    color: "#00B894",
  },
  {
    id: "bank",
    name: "Bank Account",
    balance: 5000,
    icon: "CreditCard",
    color: "#6C5CE7",
  },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      wallets: defaultWallets,
      
      addWallet: (wallet) => 
        set((state) => ({
          wallets: [...state.wallets, { ...wallet, id: generateId() }],
        })),
      
      updateWallet: (id, updates) =>
        set((state) => ({
          wallets: state.wallets.map((wallet) =>
            wallet.id === id ? { ...wallet, ...updates } : wallet
          ),
        })),
      
      deleteWallet: (id) =>
        set((state) => ({
          wallets: state.wallets.filter((wallet) => wallet.id !== id),
        })),
      
      updateBalance: (id, amount) =>
        set((state) => ({
          wallets: state.wallets.map((wallet) =>
            wallet.id === id
              ? { ...wallet, balance: wallet.balance + amount }
              : wallet
          ),
        })),
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);