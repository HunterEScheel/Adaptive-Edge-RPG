import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/rootReducer";
import { Passive, addPassive, removePassive } from "@/store/slices/abilitiesSlice";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function CombatPassives() {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const passives = character.abilities.passives || [];
  const buildPoints = character.base.buildPointsRemaining || 0;

  // Modal for adding items
  const [showAddPassiveModal, setShowAddPassiveModal] = useState(false);

  // Form states for new passive
  const [newPassiveName, setNewPassiveName] = useState("");
  const [newPassiveDescription, setNewPassiveDescription] = useState("");
  const [newPassiveBPCost, setNewPassiveBPCost] = useState("");

  // Function to handle adding a new passive ability
  const handleAddPassive = () => {
    if (!newPassiveName.trim()) {
      Alert.alert("Error", "Please enter a passive ability name");
      return;
    }

    const bpCost = parseInt(newPassiveBPCost, 10) || 0;

    // Validate cost
    if (bpCost <= 0) {
      Alert.alert("Error", "Build point cost must be greater than 0");
      return;
    }

    // Check if character has enough build points
    if (buildPoints < bpCost) {
      Alert.alert("Not Enough Build Points", `You need ${bpCost} BP to add this passive ability.`);
      return;
    }

    // Create and add the new passive
    const newPassive: Omit<Passive, "id"> = {
      name: newPassiveName.trim(),
      description: newPassiveDescription.trim(),
      buildPointCost: bpCost,
    };

    dispatch(addPassive(newPassive));

    // Reset form and close modal
    setNewPassiveName("");
    setNewPassiveDescription("");
    setNewPassiveBPCost("");
    setShowAddPassiveModal(false);
  };

  // Handle removing a passive ability
  const handleRemovePassive = (passiveId: string) => {
    Alert.alert("Remove Passive Ability", "Are you sure you want to remove this passive ability? Your spent build points will be refunded.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => dispatch(removePassive(passiveId)),
      },
    ]);
  };

  // Render a passive ability item
  const renderPassiveItem = ({ item }: { item: Passive }) => (
    <ThemedView style={styles.abilityItem}>
      <View style={styles.abilityHeader}>
        <ThemedText style={styles.abilityName}>{item.name}</ThemedText>
        <Pressable style={styles.deleteButton} onPress={() => handleRemovePassive(item.id)}>
          <ThemedText style={styles.deleteButtonText}>X</ThemedText>
        </Pressable>
      </View>

      <ThemedText style={styles.abilityDescription}>{item.description}</ThemedText>

      <View style={styles.abilityFooter}>
        <ThemedText style={styles.costText}>
          <ThemedText style={styles.costLabel}>BP Cost:</ThemedText> {item.buildPointCost}
        </ThemedText>
        <ThemedText style={[styles.passiveTag]}>PASSIVE</ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <View style={styles.container}>
      {passives.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>You haven't added any passive abilities yet. Add a passive ability to get started.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList data={passives} renderItem={renderPassiveItem} keyExtractor={(item) => item.id} style={styles.list} />
      )}

      <Pressable style={styles.addButton} onPress={() => setShowAddPassiveModal(true)}>
        <FontAwesome name="plus" size={16} color="white" />
        <ThemedText style={styles.addButtonText}>Add Passive</ThemedText>
      </Pressable>

      {/* Add Passive Modal */}
      <Modal visible={showAddPassiveModal} animationType="slide" transparent={true} onRequestClose={() => setShowAddPassiveModal(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Add New Passive Ability</ThemedText>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Name:</ThemedText>
              <TextInput style={styles.input} value={newPassiveName} onChangeText={setNewPassiveName} placeholder="Passive ability name" placeholderTextColor="#999" />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Description:</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newPassiveDescription}
                onChangeText={setNewPassiveDescription}
                placeholder="Describe what this passive ability does"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>BP Cost:</ThemedText>
              <TextInput style={styles.input} value={newPassiveBPCost} onChangeText={setNewPassiveBPCost} placeholder="15" placeholderTextColor="#999" keyboardType="number-pad" />
            </View>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAddPassiveModal(false)}>
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton, (!newPassiveName.trim() || !newPassiveBPCost) && styles.disabledButton]}
                onPress={handleAddPassive}
                disabled={!newPassiveName.trim() || !newPassiveBPCost}
              >
                <ThemedText style={styles.modalButtonText}>Add Passive</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  list: {
    maxHeight: 350,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 5,
    height: 100,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#666",
  },
  abilityItem: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  abilityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  abilityName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  abilityDescription: {
    marginBottom: 10,
    color: "#333",
  },
  abilityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
    paddingTop: 8,
  },
  costText: {
    fontSize: 12,
    color: "#666",
  },
  costLabel: {
    fontWeight: "bold",
  },
  passiveTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 4,
  },
  addButton: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    marginRight: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
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
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#777",
  },
  saveButton: {
    backgroundColor: "#007AFF",
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
