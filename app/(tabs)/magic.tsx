import { MagicSchoolManager } from "@/components/Spellcasting/MagicSchoolManager";
import { SpellManager } from "@/components/Spellcasting/SpellManager";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ScrollView } from "react-native";

export default function MagicScreen() {
    // Define sections for the FlatList
    return (
        <ScrollView>
            <ThemedView>
                <MagicSchoolManager />
                <SpellManager />
            </ThemedView>
        </ScrollView>
    );
}
