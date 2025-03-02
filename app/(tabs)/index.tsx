import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useTransactionStore } from "@/store/transactionStore";
import { useWalletStore } from "@/store/walletStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useSettingsStore } from "@/store/settingsStore";
import { formatCurrency, calculateFinancialSummary } from "@/utils/helpers";
import Colors from "@/constants/colors";
import WalletCard from "@/components/WalletCard";
import TransactionItem from "@/components/TransactionItem";
import TimeFilterPicker from "@/components/TimeFilterPicker";
import EmptyState from "@/components/EmptyState";
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft, PieChart, BarChart } from "lucide-react-native";
import { useTranslation } from "@/translations";

export default function DashboardScreen() {
  const router = useRouter();
  const { transactions, getFilteredTransactions } = useTransactionStore();
  const { wallets } = useWalletStore();
  const { categories } = useCategoryStore();
  const { settings } = useSettingsStore();
  const [timeFilter, setTimeFilter] = useState({ type: "monthly" as const });
  const [activeTab, setActiveTab] = useState<"overview" | "reports">("overview");
  const { t } = useTranslation(settings.language);

  const filteredTransactions = getFilteredTransactions({ timeFilter });
  const recentTransactions = filteredTransactions.slice(0, 5);
  const { income, expenses, balance } = calculateFinancialSummary(filteredTransactions);

  // Calculate category totals for reports
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
      <Stack.Screen
        options={{
          title: t("dashboard"),
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
            {t("overview")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "reports" && styles.activeTab]}
          onPress={() => setActiveTab("reports")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "reports" && styles.activeTabText,
            ]}
          >
            {t("reports")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && (
          <>
            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryHeader}>
                <Text style={styles.sectionTitle}>{t("summary")}</Text>
                <TimeFilterPicker
                  selectedFilter={timeFilter}
                  onSelectFilter={setTimeFilter}
                />
              </View>

              <View style={styles.summaryCards}>
                <View style={[styles.summaryCard, styles.balanceCard]}>
                  <Text style={styles.summaryLabel}>{t("balance")}</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(balance)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <View style={[styles.summaryCard, styles.incomeCard]}>
                    <View style={styles.summaryIconContainer}>
                      <ArrowUpRight size={16} color={Colors.income} />
                    </View>
                    <Text style={styles.summaryLabel}>{t("income")}</Text>
                    <Text style={[styles.summaryValue, styles.incomeValue]}>
                      {formatCurrency(income)}
                    </Text>
                  </View>

                  <View style={[styles.summaryCard, styles.expenseCard]}>
                    <View style={styles.summaryIconContainer}>
                      <ArrowDownLeft size={16} color={Colors.expense} />
                    </View>
                    <Text style={styles.summaryLabel}>{t("expenses")}</Text>
                    <Text style={[styles.summaryValue, styles.expenseValue]}>
                      {formatCurrency(expenses)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Wallets Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t("myWallets")}</Text>
                <TouchableOpacity
                  onPress={() => router.push("/wallets")}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllText}>{t("manage")}</Text>
                </TouchableOpacity>
              </View>

              {wallets.length === 0 ? (
                <EmptyState
                  title={t("noWalletsYet")}
                  message={t("addFirstWallet")}
                  icon={<Wallet size={48} color={Colors.textSecondary} />}
                />
              ) : (
                <View style={styles.walletsList}>
                  {wallets.map((wallet) => (
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                      onPress={() => router.push(`/wallets/${wallet.id}`)}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Recent Transactions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t("recentTransactions")}</Text>
                <TouchableOpacity
                  onPress={() => router.push("/transactions")}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllText}>{t("viewAll")}</Text>
                </TouchableOpacity>
              </View>

              {recentTransactions.length === 0 ? (
                <EmptyState
                  title={t("noTransactionsYet")}
                  message={t("addFirstTransaction")}
                  icon={<PieChart size={48} color={Colors.textSecondary} />}
                />
              ) : (
                <View style={styles.transactionsList}>
                  {recentTransactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      onPress={() =>
                        router.push(`/transactions/${transaction.id}`)
                      }
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        {activeTab === "reports" && (
          <>
            <View style={styles.reportsHeader}>
              <TimeFilterPicker
                selectedFilter={timeFilter}
                onSelectFilter={setTimeFilter}
              />
            </View>

            {filteredTransactions.length === 0 ? (
              <EmptyState
                title={t("noDataToDisplay")}
                message={t("addTransactionsForReports")}
                icon={<PieChart size={48} color={Colors.textSecondary} />}
              />
            ) : (
              <>
                <View style={styles.overviewContainer}>
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{t("financialSummary")}</Text>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryItem}>
                        <View style={styles.summaryIconContainer}>
                          <ArrowUpRight size={16} color={Colors.income} />
                        </View>
                        <Text style={styles.summaryLabel}>{t("income")}</Text>
                        <Text style={[styles.summaryValue, styles.incomeValue]}>
                          {formatCurrency(income)}
                        </Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <View style={styles.summaryIconContainer}>
                          <ArrowDownLeft size={16} color={Colors.expense} />
                        </View>
                        <Text style={styles.summaryLabel}>{t("expenses")}</Text>
                        <Text style={[styles.summaryValue, styles.expenseValue]}>
                          {formatCurrency(expenses)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.balanceContainer}>
                      <Text style={styles.balanceLabel}>{t("balance")}</Text>
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
                    <Text style={styles.chartTitle}>{t("incomeVsExpenses")}</Text>
                    <View style={styles.chartContainer}>
                      <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                          <View
                            style={[styles.legendColor, { backgroundColor: Colors.income }]}
                          />
                          <Text style={styles.legendText}>{t("income")}</Text>
                        </View>
                        <View style={styles.legendItem}>
                          <View
                            style={[styles.legendColor, { backgroundColor: Colors.expense }]}
                          />
                          <Text style={styles.legendText}>{t("expenses")}</Text>
                        </View>
                      </View>
                      <View style={styles.barChart}>
                        <View style={styles.barContainer}>
                          <View
                            style={[
                              styles.bar,
                              { backgroundColor: Colors.income, height: 100 * (income / Math.max(income, expenses, 1)) },
                            ]}
                          />
                          <Text style={styles.barLabel}>{t("income")}</Text>
                        </View>
                        <View style={styles.barContainer}>
                          <View
                            style={[
                              styles.bar,
                              { backgroundColor: Colors.expense, height: 100 * (expenses / Math.max(income, expenses, 1)) },
                            ]}
                          />
                          <Text style={styles.barLabel}>{t("expenses")}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.categoriesContainer}>
                  <View style={styles.categorySection}>
                    <Text style={styles.sectionTitle}>{t("topExpenseCategories")}</Text>
                    {expenseCategories.length === 0 ? (
                      <Text style={styles.noDataText}>{t("noExpenseData")}</Text>
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
                    <Text style={styles.sectionTitle}>{t("topIncomeCategories")}</Text>
                    {incomeCategories.length === 0 ? (
                      <Text style={styles.noDataText}>{t("noIncomeData")}</Text>
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
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  scrollContent: {
    paddingBottom: 24,
  },
  addButton: {
    marginRight: 16,
  },
  summaryContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 8,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryCards: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceCard: {
    marginBottom: 12,
  },
  incomeCard: {},
  expenseCard: {},
  summaryIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  incomeValue: {
    color: Colors.income,
  },
  expenseValue: {
    color: Colors.expense,
  },
  section: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  viewAllButton: {
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  walletsList: {
    gap: 12,
  },
  transactionsList: {
    gap: 12,
  },
  // Reports styles
  reportsHeader: {
    backgroundColor: Colors.background,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  overviewContainer: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  balanceContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    alignItems: "center",
    marginTop: 16,
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
    marginTop: 16,
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
});