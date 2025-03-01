import React from "react";
import { Tabs } from "expo-router";
import { Home, PlusCircle, Settings } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";
import { translations } from "@/translations";

export default function TabLayout() {
  const { settings } = useSettingsStore();
  
  // Get translation function
  const t = (key: string): string => {
    const lang = settings.language in translations ? settings.language : 'en';
    return translations[lang as keyof typeof translations][key as keyof typeof translations[typeof lang]] || translations.en[key as keyof typeof translations['en']] || key;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("dashboard"),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-transaction"
        options={{
          title: t("addTransaction"),
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}