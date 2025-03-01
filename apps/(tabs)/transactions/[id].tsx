import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useWalletStore } from "@/store/walletStore";
import { formatCurrency, formatDate } from "@/utils/helpers";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react-native";

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, deleteTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { wallets } = useWalletStore();

  const transaction = transactions.find((t) => t.id === id);
  const category = categories.find((c) => c.id === transaction?.categoryId);
  const wallet = wallets.find((w) => w.id === transaction?.walletId);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Transaction Details",
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
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Transaction not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTransaction(transaction.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Transaction Details",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push(`/transactions/edit/${transaction.id}`)}
            >
              <Edit2 size={20} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text
            style={[
              styles.amount,
              {
                color:
                  transaction.type === "income"
                    ? Colors.income
                    : Colors.expense,
              },
            ]}
          >
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{transaction.description}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <View style={styles.categoryContainer}>
              <View
                style={[
                  styles.categoryColor,
                  { backgroundColor: category?.color || Colors.textSecondary },
                ]}
              />
              <Text style={styles.detailValue}>
                {category?.name || "Uncategorized"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Wallet</Text>
            <View style={styles.walletContainer}>
              <View
                style={[
                  styles.walletColor,
                  { backgroundColor: wallet?.color || Colors.textSecondary },
                ]}
              />
              <Text style={styles.detailValue}>
                {wallet?.name || "Unknown Wallet"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    transaction.type === "income"
                      ? Colors.income
                      : Colors.expense,
                },
              ]}
            >
              {transaction.type === "income" ? "Income" : "Expense"}
            </Text>
          </View>
        </View>

        <Button
          title="Delete Transaction"
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
  editButton: {
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    margin: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  goBackButton: {
    width: 200,
  },
});