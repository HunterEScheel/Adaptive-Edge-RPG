import { DELETE_PRESET, FETCH_PRESETS, SAVE_PRESET } from "@/store/actions";
import { RootState } from "@/store/rootReducer";
import { Character, setCharacter } from "@/store/slices/characterSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import VersatileInput from "../Input";
import { ThemedText } from "../ThemedText";

const CharacterPresetManager = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const presets = useSelector((state: RootState) => state.presets);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Character | null>(null);

  // Save form state
  const [presetName, setPresetName] = useState("");
  const [presetDescription, setPresetDescription] = useState("");
  const [presetTags, setPresetTags] = useState("");

  // Load presets on component mount
  useEffect(() => {
    dispatch({ type: FETCH_PRESETS });
  }, [dispatch]);

  // Save current character as a preset
  const handleSavePreset = () => {
    const tags = presetTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    dispatch({ type: SAVE_PRESET, payload: character });

    setShowSaveModal(false);
    resetForm();
  };

  // Load a character preset
  const handleLoadPreset = (selection: Character) => {
    dispatch(setCharacter(selection));
    setShowLoadModal(false);
  };

  // Delete a preset
  const handleDeletePreset = (preset: Character) => {
    dispatch({ type: DELETE_PRESET, payload: preset });
  };

  // Reset form fields
  const resetForm = () => {
    setPresetName("");
    setPresetDescription("");
    setPresetTags("");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Render preset item in list
  const renderPresetItem = ({ item }: { item: Character }) => (
    <View style={[styles.presetItem]}>
      <TouchableOpacity
        style={styles.presetContent}
        onPress={() => {
          setSelectedPreset(item);
          setShowLoadModal(true);
        }}
      >
        <View style={styles.presetHeader}>
          <ThemedText style={styles.presetName}>{item.base.name}</ThemedText>
        </View>

        <ThemedText style={styles.presetDescription} numberOfLines={2}></ThemedText>

        <View style={styles.characterSummary}>
          <ThemedText style={styles.summaryText}>
            {item.base.name} ({item.base.buildPointsSpent} BP)
          </ThemedText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteButton, { backgroundColor: "red" }]} onPress={() => handleDeletePreset(item)}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Character Presets</ThemedText>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: "blue" }]} onPress={() => setShowSaveModal(true)}>
          <ThemedText style={styles.saveButtonText}>Save Current Character</ThemedText>
        </TouchableOpacity>
      </View>

      {presets.length > 0 ? (
        <FlatList data={presets} renderItem={renderPresetItem} keyExtractor={(item) => item.base.id.toString()} contentContainerStyle={styles.listContent} />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="save-outline" size={50} />
          <ThemedText style={styles.emptyText}>No character presets yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>Save your current character as a preset to see it here</ThemedText>
        </View>
      )}

      {/* Save Preset Modal */}
      <Modal visible={showSaveModal} animationType="slide" transparent={true} onRequestClose={() => setShowSaveModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Save Character Preset</ThemedText>
              <TouchableOpacity onPress={() => setShowSaveModal(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>

            <VersatileInput type="string" label="Preset Name" value={presetName} onChangeText={setPresetName} placeholder="My Character Preset" />

            <VersatileInput type="string" label="Tags (comma separated)" value={presetTags} onChangeText={setPresetTags} placeholder="fighter, dwarf, tank" />

            <View style={styles.summaryContainer}>
              <ThemedText style={styles.summaryLabel}>Character Summary:</ThemedText>
              <ThemedText style={styles.summaryText}>{character.base.name}</ThemedText>
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity style={[styles.cancelButton]} onPress={() => setShowSaveModal(false)}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton]} onPress={handleSavePreset}>
                <ThemedText style={styles.confirmButtonText}>Save Preset</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Load Preset Modal */}
      <Modal visible={showLoadModal && selectedPreset !== null} animationType="slide" transparent={true} onRequestClose={() => setShowLoadModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Load Character Preset</ThemedText>
              <TouchableOpacity onPress={() => setShowLoadModal(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>

            {selectedPreset && (
              <>
                <ThemedText style={styles.presetDetailName}>{selectedPreset.base.name}</ThemedText>
                <View style={styles.divider} />

                <ThemedText style={styles.warningText}>Loading this preset will replace your current character. This action cannot be undone.</ThemedText>

                <View style={styles.formButtons}>
                  <TouchableOpacity style={[styles.cancelButton]} onPress={() => setShowLoadModal(false)}>
                    <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.confirmButton]} onPress={() => handleLoadPreset(selectedPreset)}>
                    <ThemedText style={styles.confirmButtonText}>Load Character</ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 16,
  },
  presetItem: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  presetContent: {
    flex: 1,
    padding: 12,
  },
  presetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  presetName: {
    fontSize: 18,
    fontWeight: "600",
  },
  presetDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  presetDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  characterSummary: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#fff",
  },
  deleteButton: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontWeight: "600",
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  summaryContainer: {
    marginVertical: 12,
  },
  presetDetailName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  presetDetailDate: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 12,
  },
  presetDetailDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginVertical: 16,
  },
  warningText: {
    fontSize: 14,
    color: "#ff6b6b",
    marginBottom: 16,
  },
});

export default CharacterPresetManager;
