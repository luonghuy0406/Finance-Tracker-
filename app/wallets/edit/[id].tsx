import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useWalletStore } from "@/store/walletStore";
import { useSettingsStore } from "@/store/settingsStore";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import * as Icons from "lucide-react-native";
import { useTranslation } from "@/translations";
import { useTransactionStore } from "@/store/transactionStore";

// Available icons for wallets
const availableIcons = [
  "CreditCard", "Wallet", "DollarSign", "Briefcase", "PiggyBank", 
  "Landmark", "Building", "Coins", "Banknote", "Bitcoin", "Euro",
  "Smartphone", "ShoppingBag", "Gift", "Car", "Home", "Heart"
];

const walletColors = [
  "#6C5CE7", // Primary
  "#00B894", // Success
  "#FDCB6E", // Warning
  "#FF7675", // Error
  "#74B9FF", // Blue
  "#A29BFE", // Purple
  "#FD79A8", // Pink
  "#55EFC4", // Mint
  "#FF9FF3", // Light Pink
  "#636E72", // Gray
];

export default function EditWalletScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { wallets, updateWallet, deleteWallet } = useWalletStore();
  const { getFilteredTransactions } = useTransactionStore();
  const { settings } = useSettingsStore();
  const { t } = useTranslation(settings.language);

  const wallet = wallets.find(w => w.id === id);
  const [name, setName] = useState(wallet?.name || "");
  const [balance, setBalance] = useState(wallet?.balance.toString() || "");
  const [selectedIcon, setSelectedIcon] = useState(wallet?.icon || "Wallet");
  const [selectedColor, setSelectedColor] = useState(wallet?.color || walletColors[0]);

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setBalance(wallet.balance.toString());
      setSelectedIcon(wallet.icon);
      setSelectedColor(wallet.color);
    }
  }, [wallet]);

  if (!wallet) {
    router.back();
    return null;
  }

  const handleSubmit = () => {
    if (!name || !balance) {
      // Show validation error
      return;
    }

    updateWallet(wallet.id, {
      name,
      balance: parseFloat(balance),
      icon: selectedIcon,
      color: selectedColor,
    });

    router.back();
  };

  const handleDelete = () => {
    const walletTransactions = getFilteredTransactions({ walletId: wallet.id });
    
    if (walletTransactions.length > 0) {
      Alert.alert(
        t("delete"),
        "This wallet has transactions. Please delete or move all transactions before deleting the wallet.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      t("delete"),
      "Are you sure you want to delete this wallet?",
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("delete"),
          style: "destructive",
          onPress: () => {
            deleteWallet(wallet.id);
            router.back();
          },
        },
      ]
    );
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={24} color={Colors.text} /> : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: t("edit"),
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("walletName")}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Cash, Bank Account, Credit Card"
            value={name}
            onChangeText={setName}
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("balance")}</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={balance}
            onChangeText={setBalance}
            keyboardType="numeric"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("icon")}</Text>
          <FlatList
            data={availableIcons}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconOption,
                  selectedIcon === item && styles.selectedIconOption,
                ]}
                onPress={() => setSelectedIcon(item)}
              >
                {renderIcon(item)}
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.iconList}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("color")}</Text>
          <View style={styles.colorPicker}>
            {walletColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorOption,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        <Button
          title={t("save")}
          onPress={handleSubmit}
          style={styles.submitButton}
        />

        <Button
          title={t("delete")}
          onPress={handleDelete}
          variant="danger"
          style={styles.deleteButton}
        />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  amountInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  iconList: {
    paddingVertical: 8,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    marginRight: 12,
  },
  selectedIconOption: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: Colors.background,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    marginTop: 24,
  },
  deleteButton: {
    marginTop: 16,
  },
});