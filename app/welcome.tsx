import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import SettingsModal from "@/components/Settings/SettingsModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Armor } from "@/constants/Item";
import { setCharacterLoaded } from "@/store/characterAuthSlice";
import { RootState } from "@/store/rootReducer";
import { AbilitiesState, setAbilitiesState } from "@/store/slices/abilitiesSlice";
import { BaseState, setBaseState } from "@/store/slices/baseSlice";
import { Character } from "@/store/slices/characterSlice";
import { InventoryState, setInventoryState } from "@/store/slices/inventorySlice";
import { MagicState, setMagicState } from "@/store/slices/magicSlice";
import { NotesState, setNotesState } from "@/store/slices/notesSlice";
import { SkillsState, setSkillsState } from "@/store/slices/skillsSlice";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Platform, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AdaptiveEdgeImage from "./AdaptiveEdge.png";

export default function WelcomeScreen() {
  const cssStyle = useResponsiveStyles();
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
      pow: 0,
      agi: 0,
      lor: 0,
      ins: 0,
      inf: 0,
    };

    const defaultInventory: InventoryState = {
      weapons: [],
      equipment: [],
      consumables: [],
      armor: {} as Armor,
      shield: { name: "", parryBonus: 0 },
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

  const handleImportCharacter = async () => {
    if (Platform.OS === "web") {
      // Create a file input element for web
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".txt,.json";

      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const content = await file.text();

            try {
              const parsed: Character = JSON.parse(content);

              // Dispatch to each individual slice
              if (parsed.base) dispatch(setBaseState(parsed.base));
              if (parsed.inventory) dispatch(setInventoryState(parsed.inventory));
              if (parsed.skills) dispatch(setSkillsState(parsed.skills));
              if (parsed.abilities) dispatch(setAbilitiesState(parsed.abilities));
              if (parsed.magic) dispatch(setMagicState(parsed.magic));

              // Mark character as loaded and navigate
              dispatch(setCharacterLoaded());
              setTimeout(() => {
                try {
                  router.replace("/(tabs)");
                } catch (err) {
                  console.error("Navigation error:", err);
                }
              }, 100);
            } catch (parseErr) {
              console.error("Invalid JSON format:", parseErr);
            }
          } catch (err) {
            console.error("Error reading file:", err);
          }
        }
      };

      input.click();
    } else {
      // Mobile platforms use DocumentPicker
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;

        try {
          const content = await FileSystem.readAsStringAsync(uri);

          try {
            const parsed: Character = JSON.parse(content);

            // Dispatch to each individual slice
            if (parsed.base) dispatch(setBaseState(parsed.base));
            if (parsed.inventory) dispatch(setInventoryState(parsed.inventory));
            if (parsed.skills) dispatch(setSkillsState(parsed.skills));
            if (parsed.abilities) dispatch(setAbilitiesState(parsed.abilities));
            if (parsed.magic) dispatch(setMagicState(parsed.magic));

            // Mark character as loaded and navigate
            dispatch(setCharacterLoaded());
            setTimeout(() => {
              try {
                router.replace("/(tabs)");
              } catch (err) {
                console.error("Navigation error:", err);
              }
            }, 100);
          } catch (parseErr) {
            console.error("Invalid JSON format:", parseErr);
          }
        } catch (err) {
          console.error("Error reading file:", err);
        }
      }
    }
  };

  return (
    <ThemedView style={{ height: "100%" }}>
      <View style={{ position: "relative", height: "50%" }}>
        <Image source={AdaptiveEdgeImage} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
        <Pressable
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
          <FontAwesomeIcon icon={faGears} size={24} color={!settings.isConfigured ? "#ffcc00" : "#fff"} />
        </Pressable>
      </View>
      <ThemedView style={[cssStyle.container, {}]}>
        <Pressable style={[cssStyle.primaryButton, { margin: 8 }]} onPress={handleCreateNewCharacter}>
          <ThemedText style={cssStyle.primaryText}>Create New Character</ThemedText>
        </Pressable>

        <Pressable style={[cssStyle.primaryButton, { margin: 8 }]} onPress={handleImportCharacter}>
          <ThemedText style={cssStyle.primaryText}>Import from File</ThemedText>
        </Pressable>
      </ThemedView>
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </ThemedView>
  );
}
