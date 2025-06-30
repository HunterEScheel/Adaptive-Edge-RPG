import { GeneralNotes } from "@/components/Notes/GeneralNotes";
import { NPCTracker } from "@/components/Notes/NPCTracker";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ScrollView } from "react-native";
import { cssStyle } from "../styles/desktop";

export default function NotesScreen() {
    return (
        <ThemedView style={[cssStyle.container, { backgroundColor: "#1a1a1a", flex: 1 }]}>
            <ScrollView style={{ backgroundColor: "#1a1a1a" }}>
                <GeneralNotes />
                <NPCTracker />
            </ScrollView>
        </ThemedView>
    );
}
