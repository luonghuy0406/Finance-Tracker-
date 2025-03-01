import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSettingsStore } from "@/store/settingsStore";
import { languages } from "@/constants/languages";
import Colors from "@/constants/colors";
import { ArrowLeft, Check } from "lucide-react-native";
import { useTranslation } from "@/translations";

export default function LanguageScreen() {
  const router = useRouter();
  const { settings, updateLanguage } = useSettingsStore();
  const { t } = useTranslation(settings.language);

  const handleSelectLanguage = (languageCode: string) => {
    updateLanguage(languageCode);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: t("language"),
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.languageItem}
            onPress={() => handleSelectLanguage(item.code)}
          >
            <Text style={styles.languageName}>{item.name}</Text>
            {settings.language === item.code && (
              <Check size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    marginLeft: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  languageName: {
    fontSize: 16,
    color: Colors.text,
  },
});