import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Category } from "@/types";
import Colors from "@/constants/colors";
import * as Icons from "lucide-react-native";
import { useTranslation } from "@/translations";

interface FrequentCategorySuggestionsProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  transactionType: "income" | "expense";
}

export default function FrequentCategorySuggestions({
  categories,
  onSelectCategory,
  transactionType,
}: FrequentCategorySuggestionsProps) {
  const { t } = useTranslation();

  const frequentCategories = categories.filter(
    (cat) => cat.isFrequent && cat.type === transactionType
  );

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={20} color={Colors.text} /> : null;
  };

  if (frequentCategories.length === 0) {
    return null; // Don't show if no frequent categories
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("frequentCategories")}</Text>
      <FlatList
        horizontal
        data={frequentCategories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => onSelectCategory(item)}
          >
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: `${item.color}20` },
              ]}
            >
              {renderIcon(item.icon)}
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    width: 100, // Fixed width for buttons
  },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
  },
});