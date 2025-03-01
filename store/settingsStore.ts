import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSettings, Currency } from "@/types";
import { currencies } from "@/constants/currencies";

interface SettingsState {
  settings: UserSettings;
  updateCurrency: (currency: Currency) => void;
  updateLanguage: (language: string) => void;
  updateTheme: (theme: 'light' | 'dark') => void;
}

const defaultSettings: UserSettings = {
  currency: currencies[0], // USD by default
  language: "en",
  theme: "light",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateCurrency: (currency) =>
        set((state) => ({
          settings: { ...state.settings, currency },
        })),
      
      updateLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),
      
      updateTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);