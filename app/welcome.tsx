import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { TemplateSelector } from "@/components/Common/TemplateSelector";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ImportFile } from "@/components/Utility/FilePick";
import SettingsModal from "@/components/Settings/SettingsModal";
import { Armor } from "@/constants/Item";
import { setCharacterLoaded } from "@/store/characterAuthSlice";
import { RootState } from "@/store/rootReducer";
import { AbilitiesState, setAbilitiesState } from "@/store/slices/abilitiesSlice";
import { BaseState, setBaseState } from "@/store/slices/baseSlice";
import { InventoryState, setInventoryState } from "@/store/slices/inventorySlice";
import { MagicState, setMagicState } from "@/store/slices/magicSlice";
import { NotesState, setNotesState } from "@/store/slices/notesSlice";
import { SkillsState, setSkillsState } from "@/store/slices/skillsSlice";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Image, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AdaptiveEdgeImage from "./AdaptiveEdge.png";

export default function WelcomeScreen() {
    const cssStyle = useResponsiveStyles();
    const [showImport, setShowImport] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const settings = useSelector((state: RootState) => state.settings);

    const handleCreateNewCharacter = () => {
        // Create a new default character with proper initial values
        const defaultBase: BaseState = {
            id: 0,
            name: "",
            buildPointsSpent: 0,
            buildPointsRemaining: 100,
            energy: 10,
            maxEnergy: 10,
            hitPoints: 10,
            maxHitPoints: 10,
            movement: 30,
            str: 0,
            dex: 0,
            con: 0,
            int: 0,
            foc: 0,
            cha: 0,
        };

        const defaultInventory: InventoryState = {
            weapons: [],
            equipment: [],
            consumables: [],
            armor: {} as Armor,
            gold: 0,
        };

        const defaultAbilities: AbilitiesState = {
            flaws: [],
            attacks: [],
            passives: [],
        };

        const defaultMagic: MagicState = {
            magicSchools: [],
            spells: [],
            magicSchoolCredit: true,
        };

        const defaultNotes: NotesState = {
            notes: [],
            npcs: [],
        };

        const defaultSkills: SkillsState = {
            skills: [],
            dodge: 0,
            parry: 0,
            weaponSkills: [],
        };

        // Set each slice individually
        dispatch(setBaseState(defaultBase));
        dispatch(setInventoryState(defaultInventory));
        dispatch(setAbilitiesState(defaultAbilities));
        dispatch(setMagicState(defaultMagic));
        dispatch(setNotesState(defaultNotes));
        dispatch(setSkillsState(defaultSkills));
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

    const handleTemplateSelected = () => {
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
        <ThemedView style={{ flex: 1 }}>
            <View style={{ position: "relative", height: "50%" }}>
                <Image source={AdaptiveEdgeImage} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: 40,
                        right: 20,
                        padding: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 20,
                    }}
                    onPress={() => setShowSettings(true)}
                >
                    <IconSymbol name="gearshape.fill" size={24} color={!settings.isConfigured ? "#ffcc00" : "#fff"} />
                </TouchableOpacity>
            </View>
            <ThemedView style={[cssStyle.container, { flex: 1 }]}>
                {!showImport && !showTemplates ? (
                    <>
                        <Button title="Create New Character" onPress={handleCreateNewCharacter} />

                        <Button title="Select Template" onPress={() => setShowTemplates(true)} />

                        <Button title="Import Existing Character" onPress={() => setShowImport(true)} />
                    </>
                ) : showImport ? (
                    <>
                        <ImportFile onImportSuccess={handleImportSuccess} />
                        <Button title="Back" onPress={() => setShowImport(false)} />
                    </>
                ) : (
                    <>
                        <TemplateSelector onSelectTemplate={handleTemplateSelected} onBack={() => setShowTemplates(false)} />
                    </>
                )}
            </ThemedView>
            <SettingsModal 
                visible={showSettings} 
                onClose={() => setShowSettings(false)} 
            />
        </ThemedView>
    );
}
