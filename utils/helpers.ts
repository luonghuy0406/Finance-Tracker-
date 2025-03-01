import { Platform } from "react-native";
import { useSettingsStore } from "@/store/settingsStore";

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Format currency based on user settings
export const formatCurrency = (amount: number): string => {
  const { settings } = useSettingsStore.getState();
  const { currency } = settings;
  
  if (currency.code === "VND") {
    // Format VND without decimal places
    return `${Math.round(amount).toLocaleString('vi-VN')}${currency.symbol}`;
  }
  
  return `${currency.symbol}${amount.toFixed(2)}`;
};

// Format date to a readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const { settings } = useSettingsStore.getState();
  
  if (settings.language === "vi") {
    // Vietnamese date format
    return date.toLocaleDateString('vi-VN', {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get current date in ISO format
export const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Calculate total income, expenses, and balance from transactions
export const calculateFinancialSummary = (transactions: any[]) => {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === "income") {
        summary.income += transaction.amount;
      } else {
        summary.expenses += transaction.amount;
      }
      summary.balance = summary.income - summary.expenses;
      return summary;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
};

// Check if platform is web
export const isWeb = Platform.OS === "web";