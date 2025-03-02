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
import { currencies } from "@/constants/currencies";
import Colors from "@/constants/colors";
import { ArrowLeft, Check } from "lucide-react-native";

export default function CurrencyScreen() {
  const router = useRouter();
  const { settings, updateCurrency } = useSettingsStore();

  const handleSelectCurrency = (currencyCode: string) => {
    const selectedCurrency = currencies.find((c) => c.code === currencyCode);
    if (selectedCurrency) {
      updateCurrency(selectedCurrency);
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Currency",
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
        data={currencies}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.currencyItem}
            onPress={() => handleSelectCurrency(item.code)}
          >
            <View style={styles.currencyInfo}>
              <Text style={styles.currencySymbol}>{item.symbol}</Text>
              <View>
                <Text style={styles.currencyCode}>{item.code}</Text>
                <Text style={styles.currencyName}>{item.name}</Text>
              </View>
            </View>
            {settings.currency.code === item.code && (
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
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currencyInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "600",
    width: 40,
    textAlign: "center",
    marginRight: 16,
    color: Colors.text,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});