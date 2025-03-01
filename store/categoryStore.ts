import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "@/types";
import { defaultCategories } from "@/constants/categories";
import { generateId } from "@/utils/helpers";

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: generateId() }],
        })),
      
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        })),
      
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),
    }),
    {
      name: "category-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);