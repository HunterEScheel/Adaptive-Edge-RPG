import { saveCharacter } from "@/components/Utility/FilePick";
import { RootState } from "@/store/rootReducer";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";

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
    <View>
      <Pressable style={compact ? styles.compactSaveButton : styles.saveButton} onPress={() => setShowSaveDialog(true)}>
        <View>
          <IconSymbol name="square.and.arrow.down" size={compact ? 18 : 24} color="#FFFFFF" />
        </View>
      </Pressable>

      <Modal animationType="fade" transparent={true} visible={showSaveDialog} onRequestClose={() => setShowSaveDialog(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.saveDialog}>
            <ThemedText style={styles.dialogTitle}>Save Character</ThemedText>

            <TextInput style={styles.fileNameInput} placeholder="Enter file name (optional)" value={fileName} onChangeText={setFileName} autoFocus />

            <View style={styles.buttonRow}>
              <Pressable style={[styles.dialogButton, styles.cancelButton]} onPress={() => setShowSaveDialog(false)}>
                <ThemedText>Cancel</ThemedText>
              </Pressable>

              <Pressable style={[styles.dialogButton, styles.confirmButton]} onPress={handleSave}>
                <ThemedText style={styles.confirmText}>Save</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  compactSaveButton: {
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  saveDialog: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  fileNameInput: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dialogButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#EEEEEE",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  confirmText: {
    color: "#FFFFFF",
  },
});
