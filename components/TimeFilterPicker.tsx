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
import { TimeFilter } from "@/types";
import Colors from "@/constants/colors";
import { X } from "lucide-react-native";
import { useSettingsStore } from "@/store/settingsStore";
import { useTranslation } from "@/translations";

interface TimeFilterPickerProps {
  selectedFilter: TimeFilter;
  onSelectFilter: (filter: TimeFilter) => void;
}

export default function TimeFilterPicker({
  selectedFilter,
  onSelectFilter,
}: TimeFilterPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { settings } = useSettingsStore();
  const { t } = useTranslation(settings.language);

  const timeFilters: { label: string; value: TimeFilter["type"] }[] = [
    { label: t("today"), value: "daily" },
    { label: t("thisWeek"), value: "weekly" },
    { label: t("thisMonth"), value: "monthly" },
    { label: t("thisQuarter"), value: "quarterly" },
    { label: t("thisYear"), value: "yearly" },
  ];

  const getFilterLabel = (filterType: TimeFilter["type"]) => {
    return timeFilters.find((filter) => filter.value === filterType)?.label || t("custom");
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedValue}>
          {getFilterLabel(selectedFilter.type)}
        </Text>
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
              <Text style={styles.modalTitle}>{t("selectTimePeriod")}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={timeFilters}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.filterItem,
                    selectedFilter.type === item.value && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onSelectFilter({ type: item.value });
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.filterName,
                      selectedFilter.type === item.value && styles.selectedText,
                    ]}
                  >
                    {item.label}
                  </Text>
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
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectedValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
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
  filterItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedItem: {
    backgroundColor: `${Colors.primary}10`,
  },
  filterName: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedText: {
    color: Colors.primary,
    fontWeight: "600",
  },
});