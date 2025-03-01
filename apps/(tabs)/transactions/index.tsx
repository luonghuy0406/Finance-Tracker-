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
import { useCategoryStore } from "@/store/categoryStore";
import { useWalletStore } from "@/store/walletStore";
import TransactionItem from "@/components/TransactionItem";
import TimeFilterPicker from "@/components/TimeFilterPicker";
import EmptyState from "@/components/EmptyState";
import Colors from "@/constants/colors";
import { Plus, Search, Filter, PieChart } from "lucide-react-native";

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions, getFilteredTransactions } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { wallets } = useWalletStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState({ type: "monthly" as const });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  const filteredTransactions = getFilteredTransactions({
    timeFilter,
    searchQuery,
    type: selectedType !== "all" ? selectedType : undefined,
    categoryId: selectedCategoryId || undefined,
    walletId: selectedWalletId || undefined,
  });

  const resetFilters = () => {
    setSelectedType("all");
    setSelectedCategoryId(null);
    setSelectedWalletId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Transactions",
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
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Time:</Text>
            <TimeFilterPicker
              selectedFilter={timeFilter}
              onSelectFilter={setTimeFilter}
            />
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Type:</Text>
            <View style={styles.typeFilters}>
              <TouchableOpacity
                style={[
                  styles.typeFilter,
                  selectedType === "all" && styles.selectedTypeFilter,
                ]}
                onPress={() => setSelectedType("all")}
              >
                <Text
                  style={[
                    styles.typeFilterText,
                    selectedType === "all" && styles.selectedTypeFilterText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeFilter,
                  selectedType === "income" && styles.selectedTypeFilter,
                ]}
                onPress={() => setSelectedType("income")}
              >
                <Text
                  style={[
                    styles.typeFilterText,
                    selectedType === "income" && styles.selectedTypeFilterText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeFilter,
                  selectedType === "expense" && styles.selectedTypeFilter,
                ]}
                onPress={() => setSelectedType("expense")}
              >
                <Text
                  style={[
                    styles.typeFilterText,
                    selectedType === "expense" && styles.selectedTypeFilterText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetFilters}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No Transactions Found"
          message={
            searchQuery || selectedType !== "all" || selectedCategoryId || selectedWalletId
              ? "Try changing your filters or search query."
              : "Add your first transaction to start tracking your finances."
          }
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  addButton: {
    marginRight: 16,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
  },
  filtersContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterLabel: {
    width: 60,
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  typeFilters: {
    flexDirection: "row",
    gap: 8,
  },
  typeFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
  },
  selectedTypeFilter: {
    backgroundColor: Colors.primary,
  },
  typeFilterText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedTypeFilterText: {
    color: Colors.background,
    fontWeight: "500",
  },
  resetButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resetButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
});