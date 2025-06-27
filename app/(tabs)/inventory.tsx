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
        borderBottomColor: "#ddd",
    },
    tab: {
        flex: 1,
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
        color: "#666",
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
    const { isPhone, isTablet } = useResponsive();
    const [activeTab, setActiveTab] = useState<TabType>("armor-weapons");

    // Determine which variant to use based on device type
    const getListVariant = (): "full" | "compact" | "mini" => {
        if (isPhone) return "compact";
        if (isTablet) return "compact";
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
        <ScrollView>
            <ThemedView style={cssStyle.container}>
                {/* Gold Manager Section */}
                <GoldManager />

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <Pressable style={[styles.tab, activeTab === "armor-weapons" && styles.activeTab]} onPress={() => setActiveTab("armor-weapons")}>
                        <ThemedText style={[styles.tabText, activeTab === "armor-weapons" && styles.activeTabText]}>Armor & Weapons</ThemedText>
                    </Pressable>
                    <Pressable style={[styles.tab, activeTab === "equipment" && styles.activeTab]} onPress={() => setActiveTab("equipment")}>
                        <ThemedText style={[styles.tabText, activeTab === "equipment" && styles.activeTabText]}>Equipment</ThemedText>
                    </Pressable>
                    <Pressable style={[styles.tab, activeTab === "other" && styles.activeTab]} onPress={() => setActiveTab("other")}>
                        <ThemedText style={[styles.tabText, activeTab === "other" && styles.activeTabText]}>Other</ThemedText>
                    </Pressable>
                </View>

                {/* Tab Content */}
                <ScrollView style={{ flex: 1 }}>
                    {activeTab === "armor-weapons" && renderArmorWeaponsTab()}
                    {activeTab === "equipment" && renderEquipmentTab()}
                    {activeTab === "other" && renderOtherTab()}
                </ScrollView>
            </ThemedView>
        </ScrollView>
    );
}
