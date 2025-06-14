import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/rootReducer";
import { Passive, addPassive, removePassive } from "@/store/slices/abilitiesSlice";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { cssStyle } from "@/app/styles/phone";
import { ListManager } from "../Common/ListManager";

export function CombatPassives() {
  const dispatch = useDispatch();
  const passives = useSelector((state: RootState) => state.character.abilities.passives || []);

  const [showAddPassiveModal, setShowAddPassiveModal] = useState(false);
  const [newPassiveName, setNewPassiveName] = useState("");
  const [newPassiveDescription, setNewPassiveDescription] = useState("");
  const [newPassiveBPCost, setNewPassiveBPCost] = useState("");

  const handleAddPassive = () => {
    if (!newPassiveName.trim() || !newPassiveBPCost) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newPassive: Passive = {
      id: Date.now().toString(),
      name: newPassiveName.trim(),
      description: newPassiveDescription.trim(),
      buildPointCost: parseInt(newPassiveBPCost),
    };

    dispatch(addPassive(newPassive));

    // Reset form
    setNewPassiveName("");
    setNewPassiveDescription("");
    setNewPassiveBPCost("");
    setShowAddPassiveModal(false);
  };

  const handleRemovePassive = (passiveId: string) => {
    Alert.alert("Remove Passive", "Are you sure you want to remove this passive ability?", [
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
    <ThemedView style={cssStyle.abilityItem}>
      <View style={cssStyle.abilityHeader}>
        <ThemedText style={cssStyle.abilityName}>{item.name}</ThemedText>
        <Pressable style={cssStyle.deleteButton} onPress={() => handleRemovePassive(item.id)}>
          <ThemedText style={cssStyle.deleteButtonText}>X</ThemedText>
        </Pressable>
      </View>

      <ThemedText style={cssStyle.abilityDescription}>{item.description}</ThemedText>

      <View style={cssStyle.abilityFooter}>
        <ThemedText style={cssStyle.costText}>
          <ThemedText style={cssStyle.costLabel}>BP Cost:</ThemedText> {item.buildPointCost}
        </ThemedText>
        <ThemedText style={cssStyle.passiveTag}>PASSIVE</ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <>
      <ListManager
        title="Combat Passives"
        description={`${passives.length} passive${passives.length !== 1 ? 's' : ''}`}
        data={passives}
        renderItem={renderPassiveItem}
        keyExtractor={(item) => item.id}
        onAddPress={() => setShowAddPassiveModal(true)}
        addButtonText="Add Passive"
        emptyStateText="You haven't added any passive abilities yet. Add a passive ability to get started."
      />

      {/* Add Passive Modal */}
      <Modal visible={showAddPassiveModal} transparent animationType="slide">
        <View style={cssStyle.modalOverlay}>
          <ThemedView style={cssStyle.modalContent}>
            <ThemedText style={cssStyle.modalTitle}>Add New Passive Ability</ThemedText>

            <View style={cssStyle.formGroup}>
              <ThemedText style={cssStyle.label}>Name:</ThemedText>
              <TextInput style={cssStyle.input} value={newPassiveName} onChangeText={setNewPassiveName} placeholder="Passive ability name" placeholderTextColor="#999" />
            </View>

            <View style={cssStyle.formGroup}>
              <ThemedText style={cssStyle.label}>Description:</ThemedText>
              <TextInput
                style={[cssStyle.input, cssStyle.textArea]}
                value={newPassiveDescription}
                onChangeText={setNewPassiveDescription}
                placeholder="Describe what this passive ability does"
                placeholderTextColor="#999"
                multiline
              />
            </View>

            <View style={cssStyle.formGroup}>
              <ThemedText style={cssStyle.label}>BP Cost:</ThemedText>
              <TextInput style={cssStyle.input} value={newPassiveBPCost} onChangeText={setNewPassiveBPCost} placeholder="15" placeholderTextColor="#999" keyboardType="number-pad" />
            </View>

            <View style={cssStyle.modalActions}>
              <Pressable style={[cssStyle.modalButton, cssStyle.cancelButton]} onPress={() => setShowAddPassiveModal(false)}>
                <ThemedText style={cssStyle.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[cssStyle.modalButton, cssStyle.saveButton, (!newPassiveName.trim() || !newPassiveBPCost) && cssStyle.disabledButton]}
                onPress={handleAddPassive}
                disabled={!newPassiveName.trim() || !newPassiveBPCost}
              >
                <ThemedText style={cssStyle.modalButtonText}>Add Passive</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}
