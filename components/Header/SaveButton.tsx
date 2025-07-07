import { saveCharacter } from "@/components/Utility/FilePick";
import { RootState } from "@/store/rootReducer";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { useResponsiveStyles } from "../../app/contexts/ResponsiveContext";
import { ThemedText } from "../ThemedText";

export function SaveButton() {
  const styles = useResponsiveStyles();
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
    <>
      <Pressable style={[styles.defaultButton, styles.primaryColors]} onPress={() => setShowSaveDialog(true)}>
        <FontAwesome name="save" size={15} color="#fff" />
      </Pressable>

      <Modal visible={showSaveDialog} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Save Character</ThemedText>
            </View>

            <View style={styles.modalContent}>
              <TextInput style={styles.input} placeholder="Enter file name (optional)" value={fileName} onChangeText={setFileName} autoFocus />
            </View>

            <View style={styles.modalButtons}>
              <Pressable style={styles.secondaryButton} onPress={() => setShowSaveDialog(false)}>
                <ThemedText style={styles.secondaryButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handleSave}>
                <ThemedText style={styles.buttonText}>Save</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
