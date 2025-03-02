import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useWalletStore } from "@/store/walletStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { formatCurrency } from "@/utils/helpers";
import TransactionItem from "@/components/TransactionItem";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { ArrowLeft, Edit2, Trash2, Plus, PieChart } from "lucide-react-native";
import * as Icons from "lucide-react-native";
import { useTranslation } from "@/translations";

export default function WalletDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { wallets, deleteWallet, canDeleteWallet } = useWalletStore();
  const { transactions, getFilteredTransactions } = useTransactionStore();
  const { settings } = useSettingsStore();
  const { t } = useTranslation(settings.language);

  const wallet = wallets.find((w) => w.id === id);
  const walletTransactions = getFilteredTransactions({ walletId: id });

  if (!wallet) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: t("wallet"),
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
          <Text style={styles.notFoundText}>Wallet not found</Text>
          <Button
            title={t("back")}
            onPress={() => router.back()}
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const renderIcon = () => {
    const IconComponent = (Icons as any)[wallet.icon] || Icons.CreditCard;
    return <IconComponent size={32} color={wallet.color} />;
  };

  const handleDelete = () => {
    // Check if wallet has transactions
    if (walletTransactions.length > 0) {
      Alert.alert(
        t("delete"),
        "This wallet has transactions. Please delete or move all transactions before deleting the wallet.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!canDeleteWallet(wallet.id)) {
      Alert.alert(
        t("delete"),
        "You must have at least one wallet.",
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: wallet.name,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.push(`/wallets/edit/${wallet.id}`)}
              >
                <Edit2 size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDelete}
              >
                <Trash2 size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={[styles.walletHeader, { borderLeftColor: wallet.color }]}>
        <View style={styles.walletIconContainer}>
          {renderIcon()}
        </View>
        <Text style={styles.balanceLabel}>{t("balance")}</Text>
        <Text style={styles.balanceValue}>{formatCurrency(wallet.balance)}</Text>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>{t("transactions")}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push({
            pathname: "/transactions/add",
            params: { walletId: wallet.id }
          })}
        >
          <Plus size={20} color={Colors.primary} />
          <Text style={styles.addButtonText}>{t("add")}</Text>
        </TouchableOpacity>
      </View>

      {walletTransactions.length === 0 ? (
        <EmptyState
          title={t("noTransactionsYet")}
          message={t("addFirstTransaction")}
          icon={<PieChart size={48} color={Colors.textSecondary} />}
        />
      ) : (
        <FlatList
          data={walletTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onPress={() => router.push(`/transactions/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  backButton: {
    marginLeft: 16,
  },
  headerButtons: {
    flexDirection: "row",
    marginRight: 16,
  },
  headerButton: {
    marginLeft: 16,
  },
  walletHeader: {
    backgroundColor: Colors.background,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  walletIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
    gap: 12,
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