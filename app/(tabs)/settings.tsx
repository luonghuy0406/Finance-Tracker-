import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSettingsStore } from "@/store/settingsStore";
import { currencies } from "@/constants/currencies";
import { languages } from "@/constants/languages";
import Colors from "@/constants/colors";
import {
  Globe,
  DollarSign,
  ChevronRight,
  Moon,
  HelpCircle,
  Lock,
  LogOut,
  Tag,
} from "lucide-react-native";
import { useTranslation } from "@/translations";

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateTheme } = useSettingsStore();
  const { t } = useTranslation(settings.language);

  const handleThemeToggle = (value: boolean) => {
    updateTheme(value ? "dark" : "light");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: t("settings") }} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("preferences")}</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/settings/currency")}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <DollarSign size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>{t("currency")}</Text>
                <Text style={styles.settingValue}>
                  {settings.currency.code} ({settings.currency.symbol})
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/settings/language")}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Globe size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>{t("language")}</Text>
                <Text style={styles.settingValue}>
                  {
                    languages.find((lang) => lang.code === settings.language)
                      ?.name
                  }
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/categories")}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Tag size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>{t("categories")}</Text>
                <Text style={styles.settingValue}>
                  {t("manage")}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Moon size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>{t("darkMode")}</Text>
                <Text style={styles.settingValue}>
                  {settings.theme === "dark" ? t("enabled") : t("disabled")}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.theme === "dark"}
              onValueChange={handleThemeToggle}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.background}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("account")}</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Lock size={20} color={Colors.primary} />
              </View>
              <Text style={styles.settingLabel}>{t("privacySecurity")}</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <HelpCircle size={20} color={Colors.primary} />
              </View>
              <Text style={styles.settingLabel}>{t("helpSupport")}</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.logoutItem]}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${Colors.error}20` },
                ]}
              >
                <LogOut size={20} color={Colors.error} />
              </View>
              <Text style={[styles.settingLabel, { color: Colors.error }]}>
                {t("logOut")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>{t("version")} 1.0.0</Text>
          <Text style={styles.appCopyright}>
            © 2025 Personal Finance Tracker
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.background,
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginVertical: 8,
    paddingHorizontal: 16,
    textTransform: "uppercase",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  appInfo: {
    alignItems: "center",
    padding: 24,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});