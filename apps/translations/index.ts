export const translations = {
    en: {
      // Common
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      back: "Back",
      
      // Dashboard
      dashboard: "Dashboard",
      summary: "Summary",
      balance: "Balance",
      income: "Income",
      expenses: "Expenses",
      myWallets: "My Wallets",
      manage: "Manage",
      recentTransactions: "Recent Transactions",
      viewAll: "View All",
      noWalletsYet: "No Wallets Yet",
      addFirstWallet: "Add your first wallet to start tracking your finances.",
      noTransactionsYet: "No Transactions Yet",
      addFirstTransaction: "Add your first transaction to start tracking your finances.",
      
      // Reports
      reports: "Reports",
      overview: "Overview",
      financialSummary: "Financial Summary",
      incomeVsExpenses: "Income vs Expenses",
      topExpenseCategories: "Top Expense Categories",
      topIncomeCategories: "Top Income Categories",
      noExpenseData: "No expense data available",
      noIncomeData: "No income data available",
      noDataToDisplay: "No Data to Display",
      addTransactionsForReports: "Add some transactions to see your financial reports.",
      
      // Transactions
      transactions: "Transactions",
      addTransaction: "Add Transaction",
      searchTransactions: "Search transactions...",
      noTransactionsFound: "No Transactions Found",
      tryChangingFilters: "Try changing your filters or search query.",
      amount: "Amount",
      description: "Description",
      date: "Date",
      category: "Category",
      selectCategory: "Select a category",
      wallet: "Wallet",
      selectWallet: "Select a wallet",
      type: "Type",
      expense: "Expense",
      
      // Categories
      categories: "Categories",
      addNewCategory: "Add New Category",
      editCategory: "Edit Category",
      categoryName: "Category Name",
      icon: "Icon",
      color: "Color",
      
      // Wallets
      wallets: "Wallets",
      addWallet: "Add Wallet",
      totalBalance: "Total Balance",
      walletName: "Wallet Name",
      initialBalance: "Initial Balance",
      
      // Settings
      settings: "Settings",
      preferences: "Preferences",
      currency: "Currency",
      language: "Language",
      darkMode: "Dark Mode",
      enabled: "Enabled",
      disabled: "Disabled",
      account: "Account",
      privacySecurity: "Privacy & Security",
      helpSupport: "Help & Support",
      logOut: "Log Out",
      version: "Version",
    },
    vi: {
      // Common
      add: "Thêm",
      edit: "Sửa",
      delete: "Xóa",
      save: "Lưu",
      cancel: "Hủy",
      back: "Quay lại",
      
      // Dashboard
      dashboard: "Tổng quan",
      summary: "Tóm tắt",
      balance: "Số dư",
      income: "Thu nhập",
      expenses: "Chi tiêu",
      myWallets: "Ví của tôi",
      manage: "Quản lý",
      recentTransactions: "Giao dịch gần đây",
      viewAll: "Xem tất cả",
      noWalletsYet: "Chưa có ví nào",
      addFirstWallet: "Thêm ví đầu tiên để bắt đầu theo dõi tài chính của bạn.",
      noTransactionsYet: "Chưa có giao dịch nào",
      addFirstTransaction: "Thêm giao dịch đầu tiên để bắt đầu theo dõi tài chính của bạn.",
      
      // Reports
      reports: "Báo cáo",
      overview: "Tổng quan",
      financialSummary: "Tóm tắt tài chính",
      incomeVsExpenses: "Thu nhập và Chi tiêu",
      topExpenseCategories: "Danh mục chi tiêu hàng đầu",
      topIncomeCategories: "Danh mục thu nhập hàng đầu",
      noExpenseData: "Không có dữ liệu chi tiêu",
      noIncomeData: "Không có dữ liệu thu nhập",
      noDataToDisplay: "Không có dữ liệu để hiển thị",
      addTransactionsForReports: "Thêm một số giao dịch để xem báo cáo tài chính của bạn.",
      
      // Transactions
      transactions: "Giao dịch",
      addTransaction: "Thêm giao dịch",
      searchTransactions: "Tìm kiếm giao dịch...",
      noTransactionsFound: "Không tìm thấy giao dịch nào",
      tryChangingFilters: "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.",
      amount: "Số tiền",
      description: "Mô tả",
      date: "Ngày",
      category: "Danh mục",
      selectCategory: "Chọn danh mục",
      wallet: "Ví",
      selectWallet: "Chọn ví",
      type: "Loại",
      expense: "Chi tiêu",
      
      // Categories
      categories: "Danh mục",
      addNewCategory: "Thêm danh mục mới",
      editCategory: "Sửa danh mục",
      categoryName: "Tên danh mục",
      icon: "Biểu tượng",
      color: "Màu sắc",
      
      // Wallets
      wallets: "Ví",
      addWallet: "Thêm ví",
      totalBalance: "Tổng số dư",
      walletName: "Tên ví",
      initialBalance: "Số dư ban đầu",
      
      // Settings
      settings: "Cài đặt",
      preferences: "Tùy chọn",
      currency: "Tiền tệ",
      language: "Ngôn ngữ",
      darkMode: "Chế độ tối",
      enabled: "Đã bật",
      disabled: "Đã tắt",
      account: "Tài khoản",
      privacySecurity: "Quyền riêng tư & Bảo mật",
      helpSupport: "Trợ giúp & Hỗ trợ",
      logOut: "Đăng xuất",
      version: "Phiên bản",
    }
  };
  
  export type TranslationKey = keyof typeof translations.en;
  
  export const useTranslation = (language: string = 'en') => {
    const t = (key: TranslationKey): string => {
      const lang = language in translations ? language : 'en';
      return translations[lang as keyof typeof translations][key] || translations.en[key] || key;
    };
  
    return { t };
  };