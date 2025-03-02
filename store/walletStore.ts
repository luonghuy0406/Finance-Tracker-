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
  canDeleteWallet: (id: string) => boolean; // New method
}

const defaultWallets: Wallet[] = [
  {
    id: "cash",
    name: "Cash",
    balance: 0,
    icon: "Wallet",
    color: "#00B894",
  },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
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
      
      deleteWallet: (id) => {
        if (!get().canDeleteWallet(id)) {
          // You might want to dispatch an event or use a callback to notify the UI
          console.warn("Cannot delete the last wallet.");
          return;
        }
        set((state) => ({
          wallets: state.wallets.filter((wallet) => wallet.id !== id),
        }));
      },
      
      updateBalance: (id, amount) =>
        set((state) => ({
          wallets: state.wallets.map((wallet) =>
            wallet.id === id
              ? { ...wallet, balance: wallet.balance + amount }
              : wallet
          ),
        })),

      canDeleteWallet: (id: string) => {
        return get().wallets.length > 1;
      },
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);