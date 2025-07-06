import { GeneralNotes } from "@/components/Notes/GeneralNotes";
import { NPCTracker } from "@/components/Notes/NPCTracker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RootState } from "@/store/rootReducer";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { useResponsiveStyles } from "../contexts/ResponsiveContext";

export default function NotesScreen() {
    const styles = useResponsiveStyles();
    const character = useSelector((state: RootState) => state.character);
    const [activeTab, setActiveTab] = useState<"general" | "npcs">("general");

    // Handle the case where character might be undefined or null
    if (!character) {
        return (
            <ThemedView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ThemedText>Loading character data...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: "#1a1a1a" }}>
            <ThemedView style={{ backgroundColor: "#1a1a1a" }}>
                {/* Tab selector */}
                <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: "#333", backgroundColor: "#222" }]}>
                    <Pressable
                        style={[
                            { paddingVertical: 12, alignItems: "center" },
                            activeTab === "general" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                        ]}
                        onPress={() => setActiveTab("general")}
                    >
                        <ThemedText style={[styles.subtitle, activeTab === "general" && { color: "#2196F3" }]}>General</ThemedText>
                    </Pressable>
                    <Pressable
                        style={[{ paddingVertical: 12, alignItems: "center" }, activeTab === "npcs" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" }]}
                        onPress={() => setActiveTab("npcs")}
                    >
                        <ThemedText style={[styles.subtitle, activeTab === "npcs" && { color: "#2196F3" }]}>NPCs</ThemedText>
                    </Pressable>
                </View>

                {/* Content based on active tab */}
                {activeTab === "general" && <GeneralNotes />}
                {activeTab === "npcs" && <NPCTracker />}
            </ThemedView>
        </ScrollView>
    );
}
