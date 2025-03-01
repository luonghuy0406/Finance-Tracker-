import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useCategoryStore } from "@/store/categoryStore";
import Colors from "@/constants/colors";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import * as Icons from "lucide-react-native";

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { categories } = useCategoryStore();
  const category = categories.find((c) => c.id === transaction.categoryId);

  const renderCategoryIcon = () => {
    if (!category?.icon) return null;
    
    const IconComponent = (Icons as any)[category.icon];
    if (!IconComponent) return null;
    
    return <IconComponent size={20} color={category.color} />;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              transaction.type === "income"
                ? `${Colors.income}20`
                : `${Colors.expense}20`,
          },
        ]}
      >
        {category?.icon ? (
          renderCategoryIcon()
        ) : (
          transaction.type === "income" ? (
            <ArrowUpRight size={20} color={Colors.income} />
          ) : (
            <ArrowDownLeft size={20} color={Colors.expense} />
          )
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.category}>{category?.name || "Uncategorized"}</Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            {
              color:
                transaction.type === "income" ? Colors.income : Colors.expense,
            },
          ]}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
});