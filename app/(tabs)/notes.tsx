import { GeneralNotes } from "@/components/Notes/GeneralNotes";
import { NPCTracker } from "@/components/Notes/NPCTracker";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ScrollView } from "react-native";
import { cssStyle } from "../styles/desktop";

export default function NotesScreen() {
    return (
        <ThemedView style={cssStyle.container}>
            <ScrollView>
                <GeneralNotes />
                <NPCTracker />
            </ScrollView>
        </ThemedView>
    );
}
