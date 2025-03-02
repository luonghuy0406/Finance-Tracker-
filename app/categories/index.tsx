import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Modal,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useCategoryStore } from "@/store/categoryStore";
import Colors from "@/constants/colors";
import { ArrowLeft, Plus, Edit2, Trash2, X, Check } from "lucide-react-native";
import Button from "@/components/Button";
import { generateId } from "@/utils/helpers";
import * as Icons from "lucide-react-native";

export default function CategoriesScreen() {
  const router = useRouter();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [activeType, setActiveType] = useState<"income" | "expense">("expense");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("ShoppingBag");
  const [selectedColor, setSelectedColor] = useState("#FF7675");

  // Available icons for categories
  const availableIcons = [
    "ShoppingBag", "Utensils", "Home", "Car", "Briefcase", "Gift", 
    "Zap", "Film", "Book", "Activity", "Plane", "CreditCard", 
    "DollarSign", "TrendingUp", "Smartphone", "Coffee", "Wifi", 
    "Droplet", "Scissors", "Shirt", "Bus", "Train", "Truck", "Heart"
  ];

  const categoryColors = [
    "#FF7675", "#FD79A8", "#FDCB6E", "#E17055", "#D63031", 
    "#E84393", "#6C5CE7", "#74B9FF", "#00B894", "#55EFC4", 
    "#00CEC9", "#636E72"
  ];

  const filteredCategories = categories.filter(
    (category) => category.type === activeType
  );

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setSelectedIcon("ShoppingBag");
    setSelectedColor("#FF7675");
    setModalVisible(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setModalVisible(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: categoryName.trim(),
        icon: selectedIcon,
        color: selectedColor,
      });
    } else {
      addCategory({
        name: categoryName.trim(),
        type: activeType,
        icon: selectedIcon,
        color: selectedColor,
      });
    }

    setModalVisible(false);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={24} color={Colors.text} /> : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Categories",
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
              onPress={openAddModal}
            >
              <Plus size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            activeType === "expense" && styles.activeTypeButton,
          ]}
          onPress={() => setActiveType("expense")}
        >
          <Text
            style={[
              styles.typeButtonText,
              activeType === "expense" && styles.activeTypeButtonText,
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            activeType === "income" && styles.activeTypeButton,
          ]}
          onPress={() => setActiveType("income")}
        >
          <Text
            style={[
              styles.typeButtonText,
              activeType === "income" && styles.activeTypeButtonText,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
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
            <View style={styles.categoryActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openEditModal(item)}
              >
                <Edit2 size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteCategory(item.id)}
              >
                <Trash2 size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Add/Edit Category Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category name"
                value={categoryName}
                onChangeText={setCategoryName}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Icon</Text>
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
              <Text style={styles.formLabel}>Color</Text>
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
              title={editingCategory ? "Update Category" : "Add Category"}
              onPress={handleSaveCategory}
              style={styles.saveButton}
              disabled={!categoryName.trim()}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
  typeSelector: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTypeButton: {
    backgroundColor: `${Colors.primary}20`,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTypeButtonText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: "500",
    color: Colors.text,
  },
  categoryActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
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
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});