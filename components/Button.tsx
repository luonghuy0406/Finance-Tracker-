import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import Colors from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Colors.textSecondary;
    
    switch (variant) {
      case "primary":
        return Colors.primary;
      case "secondary":
        return Colors.secondary;
      case "outline":
        return "transparent";
      case "danger":
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.background;
    
    switch (variant) {
      case "outline":
        return Colors.primary;
      default:
        return Colors.background;
    }
  };

  const getBorderColor = () => {
    if (disabled) return Colors.textSecondary;
    
    switch (variant) {
      case "outline":
        return Colors.primary;
      default:
        return "transparent";
    }
  };

  const getHeight = () => {
    switch (size) {
      case "small":
        return 36;
      case "medium":
        return 48;
      case "large":
        return 56;
      default:
        return 48;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          height: getHeight(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: size === "small" ? 14 : 16,
                marginLeft: icon ? 8 : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
    borderWidth: 1,
  },
  text: {
    fontWeight: "600",
  },
});