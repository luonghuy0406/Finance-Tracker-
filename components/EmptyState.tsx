import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});