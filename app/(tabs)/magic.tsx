import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { DndSpellManager } from "@/components/Spellcasting/DndSpellManager";
import { MagicSchoolManager } from "@/components/Spellcasting/MagicSchoolManager";
import { SpellManager } from "@/components/Spellcasting/SpellManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function MagicScreen() {
    const cssStyle = useResponsiveStyles();
    const [activeTab, setActiveTab] = useState<"schools" | "character" | "dnd">("schools");

    return (
        <ScrollView>
            <ThemedView style={{ backgroundColor: "#1a1a1a", flex: 1 }}>
                {/* Tab selector */}
                <View style={[cssStyle.row, { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#333", backgroundColor: "#222" }]}>
                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "schools" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                        ]}
                        onPress={() => setActiveTab("schools")}
                    >
                        <ThemedText style={[cssStyle.subtitle, activeTab === "schools" && { color: "#2196F3" }]}>Spell Schools</ThemedText>
                    </Pressable>
                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "character" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                        ]}
                        onPress={() => setActiveTab("character")}
                    >
                        <ThemedText style={[cssStyle.subtitle, activeTab === "character" && { color: "#2196F3" }]}>My Spells</ThemedText>
                    </Pressable>
                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "dnd" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                        ]}
                        onPress={() => setActiveTab("dnd")}
                    >
                        <ThemedText style={[cssStyle.subtitle, activeTab === "dnd" && { color: "#2196F3" }]}>Spell Library</ThemedText>
                    </Pressable>
                </View>

                {/* Content based on active tab */}
                {activeTab === "schools" ? <MagicSchoolManager /> : activeTab === "character" ? <SpellManager /> : <DndSpellManager />}
            </ThemedView>
        </ScrollView>
    );
}
