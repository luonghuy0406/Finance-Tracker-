import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useWalletStore } from "@/store/walletStore";
import { formatCurrency } from "@/utils/helpers";
import WalletCard from "@/components/WalletCard";
import EmptyState from "@/components/EmptyState";
import Colors from "@/constants/colors";
import { ArrowLeft, Plus, Wallet } from "lucide-react-native";

export default function WalletsScreen() {
  const router = useRouter();
  const { wallets } = useWalletStore();

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Wallets",
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
              onPress={() => router.push("/wallets/add")}
            >
              <Plus size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>{formatCurrency(totalBalance)}</Text>
      </View>

      {wallets.length === 0 ? (
        <EmptyState
          title="No Wallets Yet"
          message="Add your first wallet to start tracking your finances."
          icon={<Wallet size={48} color={Colors.textSecondary} />}
        />
      ) : (
        <FlatList
          data={wallets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WalletCard
              wallet={item}
              onPress={() => router.push(`/wallets/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/wallets/add")}
      >
        <Plus size={24} color={Colors.background} />
      </TouchableOpacity>
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
  balanceContainer: {
    backgroundColor: Colors.background,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.primary,
  },
  listContent: {
    padding: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});