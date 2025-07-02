import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

import { FlawManager } from "@/components/MainPage/FlawManager";
import { SkillManager } from "@/components/MainPage/SkillManager";
import { TetherManager } from "@/components/MainPage/TetherManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RootState } from "@/store/rootReducer";
import React from "react";
import { useResponsiveStyles } from "../contexts/ResponsiveContext";

export default function HomeScreen() {
    const styles = useResponsiveStyles();
    const character = useSelector((state: RootState) => state.character);
    const [activeTab, setActiveTab] = useState<"skills" | "flaws" | "tethers">("skills");

    // Handle the case where character might be undefined or null
    if (!character) {
        return (
            <ThemedView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ThemedText>Loading character data...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ backgroundColor: "#1a1a1a", flex: 1 }}>
            {/* Tab selector */}
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: "#333", backgroundColor: "#222" }]}>
                <Pressable
                    style={[
                        { flex: 1, paddingVertical: 12, alignItems: "center" },
                        activeTab === "skills" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                    ]}
                    onPress={() => setActiveTab("skills")}
                >
                    <ThemedText style={[styles.subtitle, activeTab === "skills" && { color: "#2196F3" }]}>Skills</ThemedText>
                </Pressable>
                <Pressable
                    style={[
                        { flex: 1, paddingVertical: 12, alignItems: "center" },
                        activeTab === "flaws" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                    ]}
                    onPress={() => setActiveTab("flaws")}
                >
                    <ThemedText style={[styles.subtitle, activeTab === "flaws" && { color: "#2196F3" }]}>Flaws</ThemedText>
                </Pressable>
                <Pressable
                    style={[
                        { flex: 1, paddingVertical: 12, alignItems: "center" },
                        activeTab === "tethers" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                    ]}
                    onPress={() => setActiveTab("tethers")}
                >
                    <ThemedText style={[styles.subtitle, activeTab === "tethers" && { color: "#2196F3" }]}>Tethers</ThemedText>
                </Pressable>
            </View>

            <ScrollView style={{ backgroundColor: "#1a1a1a" }}>
                {/* Content based on active tab */}
                {activeTab === "skills" && <SkillManager />}
                {activeTab === "flaws" && <FlawManager />}
                {activeTab === "tethers" && <TetherManager />}
            </ScrollView>
        </ThemedView>
    );
}
