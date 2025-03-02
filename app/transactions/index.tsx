import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTransactionStore } from "@/store/transactionStore";
import { useSettingsStore } from "@/store/settingsStore";
import TransactionItem from "@/components/TransactionItem";
import TimeFilterPicker from "@/components/TimeFilterPicker";
import EmptyState from "@/components/EmptyState";
import Colors from "@/constants/colors";
import { ArrowLeft, Plus, Search, PieChart, FilterX } from "lucide-react-native";

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions, getFilteredTransactions } = useTransactionStore();
  const { settings } = useSettingsStore();
  const [timeFilter, setTimeFilter] = useState({ type: "monthly" as const });
  const [searchQuery, setSearchQuery] = useState("");

  // Get translation function
  const t = (key: string): string => {
    if (settings.language === 'vi') {
      return translations.vi[key as keyof typeof translations.vi] || key;
    }
    return translations.en[key as keyof typeof translations.en] || key;
  };

  const filteredTransactions = getFilteredTransactions({
    timeFilter,
    searchQuery,
  });

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
              style={styles.addButton}
              onPress={() => router.push("/transactions/add")}
            >
              <Plus size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchTransactions")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textSecondary}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <FilterX size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TimeFilterPicker
          selectedFilter={timeFilter}
          onSelectFilter={setTimeFilter}
        />
      </View>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title={t("noTransactionsFound")}
          message={t("tryChangingFilters")}
          icon={<PieChart size={48} color={Colors.textSecondary} />}
        />
      ) : (
        <FlatList
          data={filteredTransactions}
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

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/transactions/add")}
      >
        <Plus size={24} color={Colors.background} />
      </TouchableOpacity>
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
  addButton: {
    marginRight: 16,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    color: Colors.text,
  },
  listContent: {
    padding: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

// Include translations directly to avoid import issues
const translations = {
  en: {
    transactions: "Transactions",
    searchTransactions: "Search transactions...",
    noTransactionsFound: "No Transactions Found",
    tryChangingFilters: "Try changing your filters or search query.",
  },
  vi: {
    transactions: "Giao dịch",
    searchTransactions: "Tìm kiếm giao dịch...",
    noTransactionsFound: "Không tìm thấy giao dịch nào",
    tryChangingFilters: "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.",
  }
};