import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
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
import { Button, Image } from "react-native";
import { useDispatch } from "react-redux";
import AdaptiveEdgeImage from "./AdaptiveEdge.png";

export default function WelcomeScreen() {
    const cssStyle = useResponsiveStyles();
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
        <>
            <Image source={AdaptiveEdgeImage} style={{ width: "100%", maxHeight: "50%", resizeMode: "center", top: -18 }} />
            <ThemedView style={cssStyle.container}>
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
        </>
    );
}
