import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/rootReducer";
import { Attack, addAttack, removeAttack } from "@/store/slices/abilitiesSlice";
import { spendEnergy } from "@/store/slices/baseSlice";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function CombatAttacks() {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const attacks = character.abilities.attacks || [];
  const buildPoints = character.base.buildPointsRemaining || 0;

  // Modal for adding items
  const [showAddAttackModal, setShowAddAttackModal] = useState(false);

  // Form states for new attack
  const [newAttackName, setNewAttackName] = useState("");
  const [newAttackDescription, setNewAttackDescription] = useState("");
  const [newAttackBPCost, setNewAttackBPCost] = useState("");
  const [newAttackEPCost, setNewAttackEPCost] = useState("");

  // Function to handle adding a new attack
  const handleAddAttack = () => {
    if (!newAttackName.trim()) {
      Alert.alert("Error", "Please enter an attack name");
      return;
    }

    const bpCost = parseInt(newAttackBPCost, 10) || 0;
    const epCost = parseInt(newAttackEPCost, 10) || 0;

    // Validate costs
    if (bpCost <= 0) {
      Alert.alert("Error", "Build point cost must be greater than 0");
      return;
    }

    if (epCost < 0) {
      Alert.alert("Error", "Energy cost cannot be negative");
      return;
    }

    // Check if character has enough build points
    if (buildPoints < bpCost) {
      Alert.alert("Not Enough Build Points", `You need ${bpCost} BP to add this attack.`);
      return;
    }

    // Create and add the new attack
    const newAttack: Omit<Attack, "id"> = {
      name: newAttackName.trim(),
      description: newAttackDescription.trim(),
      buildPointCost: bpCost,
      energyCost: epCost,
    };

    dispatch(addAttack(newAttack));

    // Reset form and close modal
    setNewAttackName("");
    setNewAttackDescription("");
    setNewAttackBPCost("");
    setNewAttackEPCost("");
    setShowAddAttackModal(false);
  };

  // Handle removing an attack
  const handleRemoveAttack = (attackId: string) => {
    Alert.alert("Remove Attack", "Are you sure you want to remove this attack? Your spent build points will be refunded.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => dispatch(removeAttack(attackId)),
      },
    ]);
  };

  // Handle using an attack (spending energy)
  const handleUseAttack = (attack: Attack) => {
    // Check if character has enough energy
    if ((character.base.energy || 0) < attack.energyCost) {
      Alert.alert("Not Enough Energy", `You need ${attack.energyCost} energy to use ${attack.name}. You have ${character.base.energy || 0} energy.`);
      return;
    }

    // Spend the energy
    dispatch(spendEnergy(attack.energyCost));

    // Show success message
    Alert.alert("Attack Used", `${attack.name} used successfully! ${attack.energyCost} energy spent.`, [{ text: "OK" }]);
  };

  // Render an attack item
  const renderAttackItem = ({ item }: { item: Attack }) => (
    <ThemedView style={styles.abilityItem}>
      <View style={styles.abilityHeader}>
        <ThemedText style={styles.abilityName}>{item.name}</ThemedText>
        <Pressable style={styles.deleteButton} onPress={() => handleRemoveAttack(item.id)}>
          <ThemedText style={styles.deleteButtonText}>X</ThemedText>
        </Pressable>
      </View>

      <ThemedText style={styles.abilityDescription}>{item.description}</ThemedText>

      <View style={styles.abilityFooter}>
        <View style={styles.costContainer}>
          <ThemedText style={styles.costText}>
            <ThemedText style={styles.costLabel}>Energy Cost:</ThemedText> {item.energyCost}
          </ThemedText>
        </View>

        <Pressable
          style={[styles.useButton, (character.base.energy || 0) < item.energyCost && styles.disabledButton]}
          onPress={() => handleUseAttack(item)}
          disabled={(character.base.energy || 0) < item.energyCost}
        >
          <ThemedText style={styles.useButtonText}>Use</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );

  return (
    <View style={styles.container}>
      {attacks.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>You haven't added any attacks yet. Add an attack to get started.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList data={attacks} renderItem={renderAttackItem} keyExtractor={(item) => item.id} style={styles.list} />
      )}

      <Pressable style={styles.addButton} onPress={() => setShowAddAttackModal(true)}>
        <FontAwesome name="plus" size={16} color="white" />
        <ThemedText style={styles.addButtonText}>Add Attack</ThemedText>
      </Pressable>

      {/* Add Attack Modal */}
      <Modal visible={showAddAttackModal} animationType="slide" transparent={true} onRequestClose={() => setShowAddAttackModal(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Add New Attack</ThemedText>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Name:</ThemedText>
              <TextInput style={styles.input} value={newAttackName} onChangeText={setNewAttackName} placeholder="Attack name" placeholderTextColor="#999" />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Description:</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newAttackDescription}
                onChangeText={setNewAttackDescription}
                placeholder="Describe what this attack does"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <ThemedText style={styles.label}>BP Cost:</ThemedText>
                <TextInput style={styles.input} value={newAttackBPCost} onChangeText={setNewAttackBPCost} placeholder="10" placeholderTextColor="#999" keyboardType="number-pad" />
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <ThemedText style={styles.label}>Energy Cost:</ThemedText>
                <TextInput style={styles.input} value={newAttackEPCost} onChangeText={setNewAttackEPCost} placeholder="5" placeholderTextColor="#999" keyboardType="number-pad" />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAddAttackModal(false)}>
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton, (!newAttackName.trim() || !newAttackBPCost) && styles.disabledButton]}
                onPress={handleAddAttack}
                disabled={!newAttackName.trim() || !newAttackBPCost}
              >
                <ThemedText style={styles.modalButtonText}>Add Attack</ThemedText>
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
  costContainer: {
    flex: 1,
  },
  costText: {
    fontSize: 12,
    color: "#666",
  },
  costLabel: {
    fontWeight: "bold",
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
  formRow: {
    flexDirection: "row",
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
  useButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  useButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
