import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { app_theme } from "@/app/styles/theme";
import { ArmorList } from "@/components/InventoryPage/ArmorList";
import { ConsumableList } from "@/components/InventoryPage/ConsumableList";
import { EquipmentList } from "@/components/InventoryPage/EquipmentList";
import { GoldManager } from "@/components/InventoryPage/GoldManager";
import { WeaponList } from "@/components/InventoryPage/WeaponList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: app_theme.primary_component_bg,
  },
  tabText: {
    fontSize: 16,
    color: "#999",
  },
  activeTabText: {
    color: app_theme.primary_component_text,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: app_theme.primary_component_bg,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

type TabType = "armor-weapons" | "equipment" | "other";

export default function InventoryScreen() {
  const cssStyle = useResponsiveStyles();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState<TabType>("armor-weapons");

  // Determine which variant to use based on device type
  const getListVariant = (): "full" | "compact" | "mini" => {
    if (isMobile) return "compact";
    return "full";
  };

  const renderArmorWeaponsTab = () => (
    <View>
      <ArmorList variant={getListVariant()} />
      <View style={{ marginTop: 16 }}>
        <WeaponList variant={getListVariant()} />
      </View>
    </View>
  );

  const renderEquipmentTab = () => <EquipmentList variant={getListVariant()} />;

  const renderOtherTab = () => <ConsumableList variant={getListVariant()} />;

  return (
    <ScrollView style={{ backgroundColor: "#1a1a1a" }}>
      {/* Tab Navigation */}
      <ThemedView style={{ backgroundColor: "#1a1a1a", flex: 1 }}>
        {/* Tab selector */}
        <View style={[cssStyle.row, { borderBottomWidth: 1, borderBottomColor: "#333", backgroundColor: "#222" }]}>
          <Pressable
            style={[{ flex: 1, paddingVertical: 12, alignItems: "center" }, activeTab === "armor-weapons" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" }]}
            onPress={() => setActiveTab("armor-weapons")}
          >
            <ThemedText style={[cssStyle.subtitle, activeTab === "armor-weapons" && { color: "#2196F3" }, { textAlign: "center" }]}>Armor & Weapons</ThemedText>
          </Pressable>

          <Pressable
            style={[{ flex: 1, paddingVertical: 12, alignItems: "center" }, activeTab === "equipment" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" }]}
            onPress={() => setActiveTab("equipment")}
          >
            <ThemedText style={[cssStyle.subtitle, activeTab === "equipment" && { color: "#2196F3" }]}>Equipment</ThemedText>
          </Pressable>

          <Pressable
            style={[{ flex: 1, paddingVertical: 12, alignItems: "center" }, activeTab === "other" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" }]}
            onPress={() => setActiveTab("other")}
          >
            <ThemedText style={[cssStyle.subtitle, activeTab === "other" && { color: "#2196F3" }]}>Other</ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      {/* Tab Content */}
      <ScrollView style={{ backgroundColor: "#1a1a1a" }}>
        {activeTab === "armor-weapons" && renderArmorWeaponsTab()}
        {activeTab === "equipment" && renderEquipmentTab()}
        {activeTab === "other" && renderOtherTab()}

        {/* Gold Manager Section */}
        <GoldManager />
      </ScrollView>
    </ScrollView>
  );
}
