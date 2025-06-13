import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import CharacterPresetManager from "./CharacterPresetManager";

interface PresetManagerButtonProps {
  compact?: boolean;
}

/**
 * A button component that opens the Character Preset Manager in a modal
 */
export function PresetManagerButton({ compact = false }: PresetManagerButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={[styles.button, compact ? styles.compactButton : null]} onPress={() => setModalVisible(true)}>
        {compact ? (
          <Ionicons name="save-outline" size={20} color="#fff" />
        ) : (
          <>
            <Ionicons name="save-outline" size={20} color="#fff" style={styles.icon} />
            <ThemedText style={styles.buttonText}>Character Presets</ThemedText>
          </>
        )}
      </TouchableOpacity>

      {/* Full-screen modal for the preset manager */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Character Presets</ThemedText>
          </View>

          {/* Include the full CharacterPresetManager component */}
          <CharacterPresetManager />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3498db",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 0,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginRight: 34, // Balance out the close button width
  },
});
