import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Category } from "@/types";
import { useCategoryStore } from "@/store/categoryStore";
import { useSettingsStore } from "@/store/settingsStore";
import Colors from "@/constants/colors";
import { X, Plus, Check } from "lucide-react-native";
import Button from "@/components/Button";
import { generateId } from "@/utils/helpers";
import * as Icons from "lucide-react-native";
import { useTranslation } from "../translations";

interface CategoryPickerProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  transactionType: "income" | "expense";
}

// Available icons for categories
const availableIcons = [
  "ShoppingBag", "Utensils", "Home", "Car", "Briefcase", "Gift", 
  "Zap", "Film", "Book", "Activity", "Plane", "CreditCard", 
  "DollarSign", "TrendingUp", "Smartphone", "Coffee", "Wifi", 
  "Droplet", "Scissors", "Shirt", "Bus", "Train", "Truck", "Heart"
];

export default function CategoryPicker({
  selectedCategory,
  onSelectCategory,
  transactionType,
}: CategoryPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const { categories, addCategory } = useCategoryStore();
  const { settings } = useSettingsStore();
  const { t } = useTranslation(settings.language);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("ShoppingBag");
  const [selectedColor, setSelectedColor] = useState("#FF7675");

  const filteredCategories = categories.filter(
    (category) => category.type === transactionType
  );

  const categoryColors = [
    "#FF7675", "#FD79A8", "#FDCB6E", "#E17055", "#D63031", 
    "#E84393", "#6C5CE7", "#74B9FF", "#00B894", "#55EFC4", 
    "#00CEC9", "#636E72"
  ];

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      type: transactionType,
      icon: selectedIcon,
      color: selectedColor,
    };

    addCategory(newCategory);
    setNewCategoryName("");
    setSelectedIcon("ShoppingBag");
    setSelectedColor("#FF7675");
    setAddModalVisible(false);
    onSelectCategory(newCategory);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={24} color={Colors.text} /> : null;
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.label}>{t("category")}</Text>
        <View style={styles.selectedValueContainer}>
          {selectedCategory && (
            <View style={styles.categoryIconContainer}>
              {renderIcon(selectedCategory.icon)}
            </View>
          )}
          <Text style={styles.selectedValue}>
            {selectedCategory?.name || t("selectCategory")}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("selectCategory")}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.addCategoryButton}
              onPress={() => {
                setModalVisible(false);
                setAddModalVisible(true);
              }}
            >
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.addCategoryText}>{t("addNewCategory")}</Text>
            </TouchableOpacity>

            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory?.id === item.id && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onSelectCategory(item);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.categoryInfo}>
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: `${item.color}20` },
                      ]}
                    >
                      {renderIcon(item.icon)}
                    </View>
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </View>
                  {selectedCategory?.id === item.id && (
                    <Check size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("addNewCategory")}</Text>
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t("categoryName")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("categoryName")}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t("icon")}</Text>
              <FlatList
                data={availableIcons}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.iconOption,
                      selectedIcon === item && styles.selectedIconOption,
                    ]}
                    onPress={() => setSelectedIcon(item)}
                  >
                    {renderIcon(item)}
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.iconList}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{t("color")}</Text>
              <FlatList
                data={categoryColors}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: item },
                      selectedColor === item && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(item)}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorList}
              />
            </View>

            <Button
              title={t("add")}
              onPress={handleAddCategory}
              style={styles.addButton}
              disabled={!newCategoryName.trim()}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  selectedValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  categoryIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedItem: {
    backgroundColor: `${Colors.primary}10`,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    color: Colors.text,
  },
  addCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginHorizontal: 20,
  },
  addCategoryText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  iconList: {
    paddingVertical: 8,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    marginRight: 12,
  },
  selectedIconOption: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  colorList: {
    paddingVertical: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: Colors.text,
    transform: [{ scale: 1.2 }],
  },
  addButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});