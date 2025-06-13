import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/rootReducer";
import { FlawSeverity, addFlaw, removeFlaw } from "@/store/slices/abilitiesSlice";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const FlawManager = () => {
  const dispatch = useDispatch();
  const flaws = useSelector((state: RootState) => state.character.abilities.flaws || []);
  const base = useSelector((state: RootState) => state.character.base);
  const buildPoints = base.buildPointsRemaining || 0;

  const [showAddFlawModal, setShowAddFlawModal] = useState(false);
  const [newFlawName, setNewFlawName] = useState("");
  const [newFlawDescription, setNewFlawDescription] = useState("");
  const [newFlawSeverity, setNewFlawSeverity] = useState<FlawSeverity>("quirk");

  const handleAddFlaw = () => {
    if (newFlawName.trim() && newFlawDescription.trim()) {
      // Add the flaw
      dispatch(
        addFlaw({
          name: newFlawName.trim(),
          description: newFlawDescription.trim(),
          severity: newFlawSeverity,
        })
      );

      // Update build points (flaws give build points)
      const flawBuildPoints = getBuildPointsForSeverity(newFlawSeverity);
      dispatch(
        updateMultipleFields([
          { field: "buildPointsRemaining", value: base.buildPointsRemaining + flawBuildPoints },
          { field: "buildPointsSpent", value: Math.max(0, base.buildPointsSpent - flawBuildPoints) },
        ])
      );

      // Reset form fields
      setNewFlawName("");
      setNewFlawDescription("");
      setNewFlawSeverity("quirk");
      setShowAddFlawModal(false);
    }
  };

  const handleRemoveFlaw = (flawId: string, flawSeverity: FlawSeverity) => {
    // Don't remove if they don't have enough BP
    const flawCost = getBuildPointsForSeverity(flawSeverity);
    if (buildPoints >= flawCost) {
      // Remove the flaw
      dispatch(removeFlaw(flawId));

      // Update build points (removing a flaw costs build points)
      dispatch(
        updateMultipleFields([
          { field: "buildPointsRemaining", value: base.buildPointsRemaining - flawCost },
          { field: "buildPointsSpent", value: base.buildPointsSpent + flawCost },
        ])
      );
    }
  };

  const getBuildPointsForSeverity = (severity: FlawSeverity): number => {
    switch (severity) {
      case "quirk":
        return 10;
      case "flaw":
        return 25;
      case "vice":
        return 40;
      default:
        return 0;
    }
  };

  const renderFlaws = () => {
    if (flaws.length === 0) {
      return (
        <ThemedView style={styles.emptyState}>
          <ThemedText>No flaws added yet. Add flaws to gain build points.</ThemedText>
        </ThemedView>
      );
    }

    return flaws.map((flaw) => (
      <View key={flaw.id} style={styles.flawItem}>
        <View style={styles.flawHeader}>
          <ThemedText style={styles.flawName}>{flaw.name}</ThemedText>
          <View style={styles.flawControls}>
            <Pressable
              style={[styles.removeButton, buildPoints < getBuildPointsForSeverity(flaw.severity) ? styles.disabledButton : {}]}
              onPress={() => handleRemoveFlaw(flaw.id, flaw.severity)}
              disabled={buildPoints < getBuildPointsForSeverity(flaw.severity)}
            >
              <ThemedText style={styles.removeButtonText}>X</ThemedText>
            </Pressable>
          </View>
        </View>
        <ThemedText style={styles.flawDescription}>{flaw.description}</ThemedText>
        <View style={styles.flawFooter}>
          <ThemedText style={styles.flawSeverity}>
            Severity: <ThemedText style={styles.severityValue}>{flaw.severity}</ThemedText>
          </ThemedText>
          <ThemedText style={styles.flawBuildPoints}>{getBuildPointsForSeverity(flaw.severity)} BP</ThemedText>
        </View>
      </View>
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Character Flaws</ThemedText>
        <Pressable style={styles.addButton} onPress={() => setShowAddFlawModal(true)}>
          <ThemedText style={styles.addButtonText}>Add Flaw</ThemedText>
        </Pressable>
      </View>

      <ScrollView style={styles.flawsContainer}>{renderFlaws()}</ScrollView>

      {/* Add Flaw Modal */}
      <Modal animationType="slide" transparent={true} visible={showAddFlawModal} onRequestClose={() => setShowAddFlawModal(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Add New Flaw</ThemedText>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Name:</ThemedText>
              <TextInput style={styles.input} value={newFlawName} onChangeText={setNewFlawName} placeholder="Flaw name" placeholderTextColor="#999" />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Description:</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newFlawDescription}
                onChangeText={setNewFlawDescription}
                placeholder="Describe the flaw"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Severity:</ThemedText>
              <View style={styles.severityOptions}>
                <Pressable style={[styles.severityButton, newFlawSeverity === "quirk" && styles.selectedSeverity]} onPress={() => setNewFlawSeverity("quirk")}>
                  <ThemedText style={styles.severityButtonText}>Quirk (10 BP)</ThemedText>
                </Pressable>

                <Pressable style={[styles.severityButton, newFlawSeverity === "flaw" && styles.selectedSeverity]} onPress={() => setNewFlawSeverity("flaw")}>
                  <ThemedText style={styles.severityButtonText}>Flaw (25 BP)</ThemedText>
                </Pressable>

                <Pressable style={[styles.severityButton, newFlawSeverity === "vice" && styles.selectedSeverity]} onPress={() => setNewFlawSeverity("vice")}>
                  <ThemedText style={styles.severityButtonText}>Vice (40 BP)</ThemedText>
                </Pressable>
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAddFlawModal(false)}>
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.addButton, (!newFlawName.trim() || !newFlawDescription.trim()) && styles.disabledButton]}
                onPress={handleAddFlaw}
                disabled={!newFlawName.trim() || !newFlawDescription.trim()}
              >
                <ThemedText style={styles.modalButtonText}>Add Flaw</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  flawsContainer: {
    maxHeight: 350,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 5,
  },
  flawItem: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  flawHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  flawName: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  flawControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "#F44336",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  flawDescription: {
    marginBottom: 8,
    fontSize: 14,
  },
  flawFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flawSeverity: {
    fontSize: 12,
  },
  severityValue: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  flawBuildPoints: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    color: "black",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  severityOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  severityButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    alignItems: "center",
    margin: 2,
  },
  selectedSeverity: {
    backgroundColor: "#2196F3",
  },
  severityButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#777",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
