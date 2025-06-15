import { cssStyle } from "@/app/styles/responsive";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ImportFile } from "@/components/Utility/FilePick";
import { setCharacterLoaded } from "@/store/characterAuthSlice";
import { AbilitiesState } from "@/store/slices/abilitiesSlice";
import { BaseState } from "@/store/slices/baseSlice";
import { Character, setCharacter } from "@/store/slices/characterSlice";
import { InventoryState } from "@/store/slices/inventorySlice";
import { MagicState } from "@/store/slices/magicSlice";
import { NotesState } from "@/store/slices/notesSlice";
import { SkillsState } from "@/store/slices/skillsSlice";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button } from "react-native";
import { useDispatch } from "react-redux";

export default function WelcomeScreen() {
    const [showImport, setShowImport] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleCreateNewCharacter = () => {
        // Create a new default character
        const newCharacter: Character = {
            base: {} as BaseState,
            inventory: {} as InventoryState,
            abilities: {} as AbilitiesState,
            magic: {} as MagicState,
            notes: {} as NotesState,
            skills: {} as SkillsState,
        };

        // Set the character in Redux and mark as loaded
        dispatch(setCharacter(newCharacter));
        dispatch(setCharacterLoaded());

        // Use a timeout to ensure the state is updated before navigation
        // This is a workaround for the race condition
        setTimeout(() => {
            try {
                router.replace("/(tabs)");
            } catch (err) {
                console.error("Navigation error:", err);
            }
        }, 100);
    };

    const handleImportSuccess = () => {
        // Mark character as loaded
        dispatch(setCharacterLoaded());

        // Use a timeout to ensure the state is updated before navigation
        // This is a workaround for the race condition
        setTimeout(() => {
            try {
                router.replace("/(tabs)");
            } catch (err) {
                console.error("Navigation error:", err);
            }
        }, 100);
    };

    return (
        <ThemedView style={cssStyle.container}>
            <ThemedText type="title" style={cssStyle.title}>
                GURPS & Dragons
            </ThemedText>

            <ThemedText style={cssStyle.subtitle}>Welcome to your character sheet app</ThemedText>

            {!showImport ? (
                <>
                    <Button title="Create New Character" onPress={handleCreateNewCharacter} />

                    <Button title="Import Existing Character" onPress={() => setShowImport(true)} />
                </>
            ) : (
                <>
                    <ImportFile onImportSuccess={handleImportSuccess} />
                    <Button title="Back" onPress={() => setShowImport(false)} />
                </>
            )}
        </ThemedView>
    );
}
