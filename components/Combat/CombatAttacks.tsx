import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { Attack, addAttack, removeAttack } from "@/store/slices/abilitiesSlice";
import { spendEnergy } from "@/store/slices/baseSlice";
import { ListManager } from "../Common/ListManager";
import { CompactListManager } from "../Common/CompactListManager";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function CombatAttacks() {
    const cssStyle = useResponsiveStyles();
    const { isPhone } = useResponsive();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const attacks = useSelector((state: RootState) => state.character.abilities.attacks || []);

    const [showAddAttackModal, setShowAddAttackModal] = useState(false);
    const [newAttackName, setNewAttackName] = useState("");
    const [newAttackDescription, setNewAttackDescription] = useState("");
    const [newAttackBPCost, setNewAttackBPCost] = useState("");
    const [newAttackEPCost, setNewAttackEPCost] = useState("");

    const handleAddAttack = () => {
        if (!newAttackName.trim() || !newAttackBPCost) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        const newAttack: Attack = {
            id: Date.now().toString(),
            name: newAttackName.trim(),
            description: newAttackDescription.trim(),
            buildPointCost: parseInt(newAttackBPCost),
            energyCost: parseInt(newAttackEPCost) || 0,
        };

        dispatch(addAttack(newAttack));

        // Reset form
        setNewAttackName("");
        setNewAttackDescription("");
        setNewAttackBPCost("");
        setNewAttackEPCost("");
        setShowAddAttackModal(false);
    };

    const handleRemoveAttack = (attackId: string) => {
        Alert.alert("Remove Attack", "Are you sure you want to remove this attack?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => dispatch(removeAttack(attackId)),
            },
        ]);
    };

    const handleUseAttack = (attack: Attack) => {
        if ((character.base.energy || 0) < attack.energyCost) {
            Alert.alert("Insufficient Energy", `You need ${attack.energyCost} energy to use this attack.`);
            return;
        }

        Alert.alert("Use Attack", `Use ${attack.name}?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Use",
                onPress: () => {
                    dispatch(spendEnergy(attack.energyCost));
                    Alert.alert("Attack Used", `${attack.name} has been used!`);
                },
            },
        ]);
    };

    // Render an attack item
    const renderAttackItem = ({ item }: { item: Attack }) => (
        <ThemedView style={cssStyle.abilityItem}>
            <View style={cssStyle.headerRow}>
                <ThemedText style={cssStyle.abilityName}>{item.name}</ThemedText>
                <Pressable style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleRemoveAttack(item.id)}>
                    <ThemedText style={cssStyle.smallButtonText}>X</ThemedText>
                </Pressable>
            </View>

            <ThemedText style={cssStyle.abilityDescription}>{item.description}</ThemedText>

            <View style={cssStyle.abilityFooter}>
                <View style={cssStyle.costContainer}>
                    <ThemedText style={cssStyle.costText}>
                        <ThemedText style={cssStyle.costLabel}>Energy Cost:</ThemedText> {item.energyCost}
                    </ThemedText>
                </View>

                <Pressable
                    style={[cssStyle.primaryButton, (character.base.energy || 0) < item.energyCost && cssStyle.disabledButton]}
                    onPress={() => handleUseAttack(item)}
                    disabled={(character.base.energy || 0) < item.energyCost}
                >
                    <ThemedText style={cssStyle.smallButtonText}>Use</ThemedText>
                </Pressable>
            </View>
        </ThemedView>
    );

    return (
        <>
            {isPhone ? (
                <CompactListManager
                    title={`Attacks (${attacks.length})`}
                    data={attacks}
                    renderItem={renderAttackItem}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setShowAddAttackModal(true)}
                    addButtonText="Add"
                    emptyStateText="No attacks added yet"
                />
            ) : (
                <ListManager
                    title="Combat Attacks"
                    description={`${attacks.length} attack${attacks.length !== 1 ? "s" : ""}`}
                    data={attacks}
                    renderItem={renderAttackItem}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setShowAddAttackModal(true)}
                    addButtonText="Add Attack"
                    emptyStateText="You haven't added any attacks yet. Add an attack to get started."
                />
            )}

            {/* Add Attack Modal */}
            <Modal animationType="slide" transparent={true} visible={showAddAttackModal} onRequestClose={() => setShowAddAttackModal(false)}>
                <View style={cssStyle.modalOverlay}>
                    <View style={cssStyle.modalView}>
                        <ThemedText style={cssStyle.modalTitle}>Add New Attack</ThemedText>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Name:</ThemedText>
                            <TextInput
                                style={cssStyle.input}
                                value={newAttackName}
                                onChangeText={setNewAttackName}
                                placeholder="Attack name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Description:</ThemedText>
                            <TextInput
                                style={[cssStyle.input, cssStyle.textArea]}
                                value={newAttackDescription}
                                onChangeText={setNewAttackDescription}
                                placeholder="Describe what this attack does"
                                placeholderTextColor="#999"
                                multiline
                            />
                        </View>

                        <View style={cssStyle.formRow}>
                            <View style={[cssStyle.formGroup, { flex: 1, marginRight: 8 }]}>
                                <ThemedText style={cssStyle.label}>BP Cost:</ThemedText>
                                <TextInput
                                    style={cssStyle.input}
                                    value={newAttackBPCost}
                                    onChangeText={setNewAttackBPCost}
                                    placeholder="10"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={[cssStyle.formGroup, { flex: 1, marginLeft: 8 }]}>
                                <ThemedText style={cssStyle.label}>Energy Cost:</ThemedText>
                                <TextInput
                                    style={cssStyle.input}
                                    value={newAttackEPCost}
                                    onChangeText={setNewAttackEPCost}
                                    placeholder="5"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        <View style={cssStyle.modalButtons}>
                            <Pressable style={cssStyle.secondaryButton} onPress={() => setShowAddAttackModal(false)}>
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable style={cssStyle.primaryButton} onPress={handleAddAttack} disabled={!newAttackName.trim() || !newAttackBPCost}>
                                <ThemedText style={cssStyle.buttonText}>Add Attack</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
