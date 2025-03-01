import { Category } from "@/types";

export const defaultCategories: Category[] = [
  // Income categories
  {
    id: "income-salary",
    name: "Salary",
    type: "income",
    icon: "Briefcase",
    color: "#00B894",
  },
  {
    id: "income-freelance",
    name: "Freelance",
    type: "income",
    icon: "Laptop",
    color: "#55EFC4",
  },
  {
    id: "income-investments",
    name: "Investments",
    type: "income",
    icon: "TrendingUp",
    color: "#00CEC9",
  },
  {
    id: "income-gifts",
    name: "Gifts",
    type: "income",
    icon: "Gift",
    color: "#74B9FF",
  },
  {
    id: "income-other",
    name: "Other Income",
    type: "income",
    icon: "Plus",
    color: "#6C5CE7",
  },

  // Expense categories
  {
    id: "expense-food",
    name: "Food & Dining",
    type: "expense",
    icon: "Utensils",
    color: "#FF7675",
  },
  {
    id: "expense-shopping",
    name: "Shopping",
    type: "expense",
    icon: "ShoppingBag",
    color: "#FD79A8",
  },
  {
    id: "expense-transportation",
    name: "Transportation",
    type: "expense",
    icon: "Car",
    color: "#FDCB6E",
  },
  {
    id: "expense-utilities",
    name: "Utilities",
    type: "expense",
    icon: "Zap",
    color: "#E17055",
  },
  {
    id: "expense-housing",
    name: "Housing",
    type: "expense",
    icon: "Home",
    color: "#D63031",
  },
  {
    id: "expense-entertainment",
    name: "Entertainment",
    type: "expense",
    icon: "Film",
    color: "#E84393",
  },
  {
    id: "expense-health",
    name: "Health",
    type: "expense",
    icon: "Activity",
    color: "#FF9FF3",
  },
  {
    id: "expense-education",
    name: "Education",
    type: "expense",
    icon: "Book",
    color: "#F368E0",
  },
  {
    id: "expense-other",
    name: "Other Expenses",
    type: "expense",
    icon: "MoreHorizontal",
    color: "#636E72",
  },
];