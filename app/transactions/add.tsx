import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useWalletStore } from "@/store/walletStore";
import { getCurrentDate } from "@/utils/helpers";
import CategoryPicker from "@/components/CategoryPicker";
import WalletPicker from "@/components/WalletPicker";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { ArrowLeft, Calendar } from "lucide-react-native";

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { wallets } = useWalletStore();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getCurrentDate());
  const [selectedCategory, setSelectedCategory] = useState(
    categories.find((c) => c.type === type) || null
  );
  const [selectedWallet, setSelectedWallet] = useState(
    wallets.length > 0 ? wallets[0] : null
  );

  const handleTypeChange = (newType: "income" | "expense") => {
    setType(newType);
    // Reset category when type changes
    setSelectedCategory(categories.find((c) => c.type === newType) || null);
  };

  const handleSubmit = () => {
    if (!amount || !selectedCategory || !selectedWallet) {
      // Show validation error
      return;
    }
    addTransaction({
      amount: parseFloat(amount),
      description: description || "",
      date,
      categoryId: selectedCategory.id,
      walletId: selectedWallet.id,
      type,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Add Transaction",
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
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "expense" && styles.activeTypeButton,
            ]}
            onPress={() => handleTypeChange("expense")}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "expense" && styles.activeTypeButtonText,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "income" && styles.activeTypeButton,
            ]}
            onPress={() => handleTypeChange("income")}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "income" && styles.activeTypeButtonText,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="What was this for?"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateText}>{date}</Text>
            <Calendar size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <CategoryPicker
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            transactionType={type}
          />
        </View>

        <View style={styles.formGroup}>
          <WalletPicker
            selectedWallet={selectedWallet}
            onSelectWallet={setSelectedWallet}
          />
        </View>

        <Button
          title="Save Transaction"
          onPress={handleSubmit}
          style={styles.submitButton}
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
  typeSelector: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTypeButton: {
    backgroundColor: Colors.background,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTypeButtonText: {
    color: Colors.text,
  },
  formGroup: {
    marginBottom: 16,
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
  dateInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  submitButton: {
    marginTop: 24,
  },
});