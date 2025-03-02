import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Wallet } from "@/types";
import { useWalletStore } from "@/store/walletStore";
import { useSettingsStore } from "@/store/settingsStore";
import Colors from "@/constants/colors";
import { X } from "lucide-react-native";
import * as Icons from "lucide-react-native";
import { useTranslation } from "../translations";

interface WalletPickerProps {
  selectedWallet: Wallet | null;
  onSelectWallet: (wallet: Wallet) => void;
}

export default function WalletPicker({
  selectedWallet,
  onSelectWallet,
}: WalletPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { wallets } = useWalletStore();
  const { settings } = useSettingsStore();
  const { t } = useTranslation(settings.language);

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.CreditCard;
    return <IconComponent size={20} color={Colors.text} />;
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.label}>{t("wallet")}</Text>
        <View style={styles.selectedValueContainer}>
          {selectedWallet && (
            <View 
              style={[
                styles.walletIconContainer, 
                { backgroundColor: `${selectedWallet.color}20` }
              ]}
            >
              {renderIcon(selectedWallet.icon)}
            </View>
          )}
          <Text style={styles.selectedValue}>
            {selectedWallet?.name || t("selectWallet")}
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
              <Text style={styles.modalTitle}>{t("selectWallet")}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={wallets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.walletItem,
                    selectedWallet?.id === item.id && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onSelectWallet(item);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.walletInfo}>
                    <View
                      style={[
                        styles.walletIcon,
                        { backgroundColor: `${item.color}20` },
                      ]}
                    >
                      {renderIcon(item.icon)}
                    </View>
                    <Text style={styles.walletName}>{item.name}</Text>
                  </View>
                  {selectedWallet?.id === item.id && (
                    <View style={[styles.walletColor, { backgroundColor: item.color }]} />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
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
  walletIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  walletItem: {
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
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  walletName: {
    fontSize: 16,
    color: Colors.text,
  },
  walletColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});