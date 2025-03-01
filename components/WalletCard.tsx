import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Wallet } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import Colors from "@/constants/colors";
import * as Icons from "lucide-react-native";

interface WalletCardProps {
  wallet: Wallet;
  onPress?: () => void;
}

export default function WalletCard({ wallet, onPress }: WalletCardProps) {
  const renderIcon = () => {
    const IconComponent = (Icons as any)[wallet.icon] || Icons.CreditCard;
    return <IconComponent size={24} color={wallet.color} />;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: wallet.color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{wallet.name}</Text>
        <Text style={styles.balance}>{formatCurrency(wallet.balance)}</Text>
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
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  balance: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
});