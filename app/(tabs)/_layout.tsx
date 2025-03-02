import React from "react";
import { Tabs } from "expo-router";
import { Home, PlusCircle, PieChart, Settings } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";
import { useTranslation } from "@/translations";
export default function TabLayout() {
  const { settings } = useSettingsStore();
  const { t } = useTranslation(settings.language);
  
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
        name="dashboards"
        options={{
          title: t("dashboard"),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          // title: t("addTransaction"),
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="reports"
        options={{
          title: t("reports"),
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />,
        }}
      /> */}
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