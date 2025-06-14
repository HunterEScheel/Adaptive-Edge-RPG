import React, { useState } from "react";
import { Modal, Pressable, ScrollView, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { ListManager } from "@/components/Common/ListManager";
import { RootState } from "@/store/rootReducer";
import { FlawSeverity, addFlaw, removeFlaw, Flaw } from "@/store/slices/abilitiesSlice";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { cssStyle } from "../../app/styles/phone";

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

  const renderFlawItem = ({ item: flaw }: { item: Flaw }) => {
    return (
      <ThemedView key={flaw.id} style={cssStyle.card}>
        <View style={cssStyle.headerRow}>
          <ThemedText style={cssStyle.title}>{flaw.name}</ThemedText>
          <View style={cssStyle.row}>
            <Pressable style={styles.removeButton} onPress={() => handleRemoveFlaw(flaw.id, flaw.severity)}>
              <ThemedText style={styles.removeButtonText}>×</ThemedText>
            </Pressable>
          </View>
        </View>
        <ThemedText style={cssStyle.subtitle}>{flaw.description}</ThemedText>
        <View style={cssStyle.headerRow}>
          <ThemedText style={cssStyle.label}>
            Severity: <ThemedText style={cssStyle.valueText}>{flaw.severity}</ThemedText>
          </ThemedText>
          <ThemedText style={cssStyle.valueText}>{getBuildPointsForSeverity(flaw.severity)} BP</ThemedText>
        </View>
      </ThemedView>
    );
  };

  return (
    <>
      <ListManager<Flaw>
        title="Character Flaws"
        description={`${flaws.length} flaw${flaws.length !== 1 ? 's' : ''} • ${flaws.reduce((total, flaw) => total + getBuildPointsForSeverity(flaw.severity), 0)} BP gained`}
        data={flaws}
        renderItem={renderFlawItem}
        keyExtractor={(item) => item.id}
        onAddPress={() => setShowAddFlawModal(true)}
        addButtonText="Add Flaw"
        emptyStateText="No flaws added yet"
      />

      {/* Add Flaw Modal */}
      <Modal animationType="slide" transparent={true} visible={showAddFlawModal} onRequestClose={() => setShowAddFlawModal(false)}>
        <View style={cssStyle.modalOverlay}>
          <ThemedView style={cssStyle.modalView}>
            <ThemedText style={cssStyle.modalTitle}>Add New Flaw</ThemedText>

            <TextInput
              style={cssStyle.input}
              placeholder="Flaw name"
              value={newFlawName}
              onChangeText={setNewFlawName}
            />

            <TextInput
              style={[cssStyle.input, { height: 80 }]}
              placeholder="Description"
              value={newFlawDescription}
              onChangeText={setNewFlawDescription}
              multiline
            />

            <ThemedText style={cssStyle.label}>Severity:</ThemedText>
            <View style={cssStyle.row}>
              {(["quirk", "flaw", "vice"] as FlawSeverity[]).map((severity) => (
                <Pressable
                  key={severity}
                  style={[
                    cssStyle.secondaryButton,
                    { marginRight: 10 },
                    newFlawSeverity === severity && cssStyle.primaryButton,
                  ]}
                  onPress={() => setNewFlawSeverity(severity)}
                >
                  <ThemedText
                    style={newFlawSeverity === severity ? cssStyle.buttonText : undefined}
                  >
                    {severity}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <View style={cssStyle.headerRow}>
              <Pressable style={[cssStyle.secondaryButton, { width: "45%" }]} onPress={() => setShowAddFlawModal(false)}>
                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[cssStyle.primaryButton, { width: "45%" }]}
                onPress={handleAddFlaw}
                disabled={!newFlawName.trim() || !newFlawDescription.trim()}
              >
                <ThemedText style={cssStyle.buttonText}>Add Flaw</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
};

const styles = {
  removeButton: {
    backgroundColor: "#F44336",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold" as const,
  },
};
