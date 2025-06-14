import { saveCharacter } from "@/components/Utility/FilePick";
import { RootState } from "@/store/rootReducer";
import { useState } from "react";
import { Modal, Pressable, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";
import { cssStyle } from "../../app/styles/phone";

type SaveButtonProps = {
  compact?: boolean;
};

export function SaveButton({ compact = false }: SaveButtonProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const character = useSelector((state: RootState) => state.character);

  const handleSave = async () => {
    if (!fileName) {
      // Use character name if no filename is provided
      await saveCharacter(character.base.name || "character", character);
    } else {
      await saveCharacter(fileName, character);
    }
    setShowSaveDialog(false);
    setFileName("");
  };

  return (
    <ThemedView>
      <Pressable style={compact ? styles.compactSaveButton : styles.saveButton} onPress={() => setShowSaveDialog(true)}>
        <View>
          <IconSymbol name="square.and.arrow.down" size={compact ? 18 : 22} color="white" />
        </View>
      </Pressable>

      <Modal visible={showSaveDialog} transparent animationType="fade">
        <View style={cssStyle.modalOverlay}>
          <ThemedView style={cssStyle.modal}>
            <ThemedText style={cssStyle.modalTitle}>Save Character</ThemedText>
            <TextInput style={cssStyle.input} placeholder="Enter file name" value={fileName} onChangeText={setFileName} autoFocus />

            <View style={cssStyle.spaceBetween}>
              <Pressable style={[cssStyle.secondaryButton, { width: "45%" }]} onPress={() => setShowSaveDialog(false)}>
                <ThemedText>Cancel</ThemedText>
              </Pressable>

              <Pressable style={[cssStyle.primaryButton, { width: "45%" }]} onPress={handleSave}>
                <ThemedText style={cssStyle.modalButtonText}>Save</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

// Keep only component-specific styles that don't have generic equivalents
const styles = {
  saveButton: {
    position: "absolute" as const,
    top: 40,
    right: 20,
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    zIndex: 100,
  },
  compactSaveButton: {
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
};
