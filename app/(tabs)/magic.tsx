import { MagicSchoolManager } from "@/components/Spellcasting/MagicSchoolManagerV2";
import { SpellManager } from "@/components/Spellcasting/SpellManager";
import { DndSpellManager } from "@/components/Spellcasting/DndSpellManager";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";

export default function MagicScreen() {
    const cssStyle = useResponsiveStyles();
    const [activeTab, setActiveTab] = useState<"schools" | "character" | "dnd">("schools");

    return (
        <ScrollView>
            <ThemedView>
                {/* Tab selector */}
                <View style={[cssStyle.row, { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" }]}>
                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "schools" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" }
                        ]}
                        onPress={() => setActiveTab("schools")}
                    >
                        <ThemedText style={[
                            cssStyle.subtitle,
                            activeTab === "schools" && { color: "#2196F3" }
                        ]}>
                            Spell Schools
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "character" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" }
                        ]}
                        onPress={() => setActiveTab("character")}
                    >
                        <ThemedText style={[
                            cssStyle.subtitle,
                            activeTab === "character" && { color: "#2196F3" }
                        ]}>
                            My Spells
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "dnd" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" }
                        ]}
                        onPress={() => setActiveTab("dnd")}
                    >
                        <ThemedText style={[
                            cssStyle.subtitle,
                            activeTab === "dnd" && { color: "#2196F3" }
                        ]}>
                            Spell Library
                        </ThemedText>
                    </Pressable>
                </View>

                {/* Content based on active tab */}
                {activeTab === "schools" ? (
                    <MagicSchoolManager />
                ) : activeTab === "character" ? (
                    <SpellManager />
                ) : (
                    <DndSpellManager />
                )}
            </ThemedView>
        </ScrollView>
    );
}
