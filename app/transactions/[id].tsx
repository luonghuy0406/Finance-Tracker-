import React from "react";
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
import { useSettingsStore } from "@/store/settingsStore";
import { formatCurrency, formatDate } from "@/utils/helpers";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react-native";
import * as Icons from "lucide-react-native";
import { useTranslation } from "@/translations";

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, deleteTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { wallets } = useWalletStore();
  const { settings } = useSettingsStore();
  const { t } = useTranslation(settings.language);

  const transaction = transactions.find((t) => t.id === id);
  const category = categories.find((c) => c.id === transaction?.categoryId);
  const wallet = wallets.find((w) => w.id === transaction?.walletId);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: t("transactions"),
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
            title={t("back")}
            onPress={() => router.back()}
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const renderCategoryIcon = () => {
    if (!category?.icon) return null;
    
    const IconComponent = (Icons as any)[category.icon];
    if (!IconComponent) return null;
    
    return <IconComponent size={24} color={category.color} />;
  };

  const renderWalletIcon = () => {
    if (!wallet?.icon) return null;
    
    const IconComponent = (Icons as any)[wallet.icon];
    if (!IconComponent) return null;
    
    return <IconComponent size={24} color={wallet.color} />;
  };

  const handleDelete = () => {
    Alert.alert(
      t("delete"),
      "Are you sure you want to delete this transaction?",
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("delete"),
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
          title: t("transactions"),
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
            <Text style={styles.detailLabel}>{t("description")}</Text>
            <Text style={styles.detailValue}>{transaction.description}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("category")}</Text>
            <View style={styles.categoryContainer}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: `${category?.color || Colors.textSecondary}20` },
                ]}
              >
                {renderCategoryIcon()}
              </View>
              <Text style={styles.detailValue}>
                {category?.name || "Uncategorized"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("wallet")}</Text>
            <View style={styles.walletContainer}>
              <View
                style={[
                  styles.walletIcon,
                  { backgroundColor: `${wallet?.color || Colors.textSecondary}20` },
                ]}
              >
                {renderWalletIcon()}
              </View>
              <Text style={styles.detailValue}>
                {wallet?.name || "Unknown Wallet"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("type")}</Text>
            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    transaction.type === "income" ? Colors.income : Colors.expense,
                },
              ]}
            >
              {transaction.type === "income" ? t("income") : t("expense")}
            </Text>
          </View>
        </View>

        <Button
          title={t("delete")}
          onPress={handleDelete}
          variant="danger"
          style={styles.deleteButton}
          icon={<Trash2 size={20} color={Colors.background} />}
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
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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