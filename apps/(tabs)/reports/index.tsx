import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Stack } from "expo-router";
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import { formatCurrency, calculateFinancialSummary } from "@/utils/helpers";
import TimeFilterPicker from "@/components/TimeFilterPicker";
import EmptyState from "@/components/EmptyState";
import Colors from "@/constants/colors";
import { PieChart, BarChart, ArrowUpRight, ArrowDownLeft } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function ReportsScreen() {
  const { transactions, getFilteredTransactions } = useTransactionStore();
  const { categories } = useCategoryStore();
  const [timeFilter, setTimeFilter] = useState({ type: "monthly" as const });
  const [activeTab, setActiveTab] = useState<"overview" | "categories" | "trends">("overview");

  const filteredTransactions = getFilteredTransactions({ timeFilter });
  const { income, expenses, balance } = calculateFinancialSummary(filteredTransactions);

  // Calculate category totals
  const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
    const categoryId = transaction.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort categories by total amount
  const sortedCategories = Object.keys(categoryTotals)
    .map((categoryId) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        id: categoryId,
        name: category?.name || "Unknown",
        amount: categoryTotals[categoryId],
        color: category?.color || Colors.textSecondary,
        type: category?.type || "expense",
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const incomeCategories = sortedCategories.filter((c) => c.type === "income");
  const expenseCategories = sortedCategories.filter((c) => c.type === "expense");

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Reports" }} />

      <View style={styles.header}>
        <View style={styles.timeFilterContainer}>
          <TimeFilterPicker
            selectedFilter={timeFilter}
            onSelectFilter={setTimeFilter}
          />
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "overview" && styles.activeTab]}
            onPress={() => setActiveTab("overview")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "overview" && styles.activeTabText,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "categories" && styles.activeTab]}
            onPress={() => setActiveTab("categories")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "categories" && styles.activeTabText,
              ]}
            >
              Categories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "trends" && styles.activeTab]}
            onPress={() => setActiveTab("trends")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "trends" && styles.activeTabText,
              ]}
            >
              Trends
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No Data to Display"
          message="Add some transactions to see your financial reports."
          icon={<PieChart size={48} color={Colors.textSecondary} />}
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          {activeTab === "overview" && (
            <View style={styles.overviewContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Financial Summary</Text>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <View style={styles.summaryIconContainer}>
                      <ArrowUpRight size={16} color={Colors.income} />
                    </View>
                    <Text style={styles.summaryLabel}>Income</Text>
                    <Text style={[styles.summaryValue, styles.incomeValue]}>
                      {formatCurrency(income)}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <View style={styles.summaryIconContainer}>
                      <ArrowDownLeft size={16} color={Colors.expense} />
                    </View>
                    <Text style={styles.summaryLabel}>Expenses</Text>
                    <Text style={[styles.summaryValue, styles.expenseValue]}>
                      {formatCurrency(expenses)}
                    </Text>
                  </View>
                </View>
                <View style={styles.balanceContainer}>
                  <Text style={styles.balanceLabel}>Balance</Text>
                  <Text
                    style={[
                      styles.balanceValue,
                      balance >= 0 ? styles.positiveBalance : styles.negativeBalance,
                    ]}
                  >
                    {formatCurrency(balance)}
                  </Text>
                </View>
              </View>

              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Income vs Expenses</Text>
                <View style={styles.chartContainer}>
                  <View style={styles.chartLegend}>
                    <View style={styles.legendItem}>
                      <View
                        style={[styles.legendColor, { backgroundColor: Colors.income }]}
                      />
                      <Text style={styles.legendText}>Income</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[styles.legendColor, { backgroundColor: Colors.expense }]}
                      />
                      <Text style={styles.legendText}>Expenses</Text>
                    </View>
                  </View>
                  <View style={styles.barChart}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          { backgroundColor: Colors.income, height: 100 * (income / Math.max(income, expenses)) },
                        ]}
                      />
                      <Text style={styles.barLabel}>Income</Text>
                    </View>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          { backgroundColor: Colors.expense, height: 100 * (expenses / Math.max(income, expenses)) },
                        ]}
                      />
                      <Text style={styles.barLabel}>Expenses</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === "categories" && (
            <View style={styles.categoriesContainer}>
              <View style={styles.categorySection}>
                <Text style={styles.sectionTitle}>Top Expense Categories</Text>
                {expenseCategories.length === 0 ? (
                  <Text style={styles.noDataText}>No expense data available</Text>
                ) : (
                  expenseCategories.slice(0, 5).map((category) => (
                    <View key={category.id} style={styles.categoryItem}>
                      <View style={styles.categoryInfo}>
                        <View
                          style={[
                            styles.categoryColor,
                            { backgroundColor: category.color },
                          ]}
                        />
                        <Text style={styles.categoryName}>{category.name}</Text>
                      </View>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(category.amount)}
                      </Text>
                    </View>
                  ))
                )}
              </View>

              <View style={styles.categorySection}>
                <Text style={styles.sectionTitle}>Top Income Categories</Text>
                {incomeCategories.length === 0 ? (
                  <Text style={styles.noDataText}>No income data available</Text>
                ) : (
                  incomeCategories.slice(0, 5).map((category) => (
                    <View key={category.id} style={styles.categoryItem}>
                      <View style={styles.categoryInfo}>
                        <View
                          style={[
                            styles.categoryColor,
                            { backgroundColor: category.color },
                          ]}
                        />
                        <Text style={styles.categoryName}>{category.name}</Text>
                      </View>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(category.amount)}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          {activeTab === "trends" && (
            <View style={styles.trendsContainer}>
              <Text style={styles.trendsTitle}>
                Trends feature coming soon!
              </Text>
              <Text style={styles.trendsDescription}>
                We're working on adding detailed trend analysis to help you track your financial progress over time.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    backgroundColor: Colors.background,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timeFilterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "flex-end",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  overviewContainer: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  incomeValue: {
    color: Colors.income,
  },
  expenseValue: {
    color: Colors.expense,
  },
  balanceContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  positiveBalance: {
    color: Colors.income,
  },
  negativeBalance: {
    color: Colors.expense,
  },
  chartCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: Colors.text,
  },
  barChart: {
    flexDirection: "row",
    height: 150,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  barContainer: {
    alignItems: "center",
    width: 60,
    marginHorizontal: 20,
  },
  bar: {
    width: 40,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoriesContainer: {
    padding: 16,
  },
  categorySection: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: Colors.text,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  trendsContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  trendsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  trendsDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});