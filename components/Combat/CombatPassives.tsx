import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { Passive, addPassive, removePassive } from "@/store/slices/abilitiesSlice";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ListManagerDesktop } from "../Common/ListManager.desktop";
import { ListManagerMobile } from "../Common/ListManager.mobile";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function CombatPassives() {
    const cssStyle = useResponsiveStyles();
    const { isMobile } = useResponsive();
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
    const renderPassiveItem = ({ item }: { item: Passive }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        return isExpanded ? (
            <Pressable style={cssStyle.abilityItem} onPress={() => setIsExpanded(!isExpanded)}>
                <Pressable style={[cssStyle.row, { justifyContent: "space-between" }]} onPress={() => setIsExpanded(!isExpanded)}>
                    <ThemedText style={cssStyle.abilityName}>{item.name}</ThemedText>
                </Pressable>
                <ThemedView style={[cssStyle.row, { backgroundColor: "transparent" }]}>
                    <ThemedText style={[cssStyle.hint, { width: "90%" }]}>{item.description}</ThemedText>
                    <Pressable style={[cssStyle.defaultButton, cssStyle.secondaryColors, { padding: 6 }]} onPress={() => handleRemovePassive(item.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} color="white" />
                    </Pressable>
                </ThemedView>
            </Pressable>
        ) : (
            <Pressable style={[cssStyle.abilityItem, cssStyle.row, { justifyContent: "space-between" }]} onPress={() => setIsExpanded(!isExpanded)}>
                <ThemedText style={cssStyle.abilityName}>{item.name}</ThemedText>
            </Pressable>
        );
    };

    return (
        <>
            {isMobile ? (
                <ListManagerMobile
                    title={`Passives (${passives.length})`}
                    data={passives}
                    renderItem={renderPassiveItem}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setShowAddPassiveModal(true)}
                    addButtonText="Add"
                    emptyStateText="No passives added yet"
                />
            ) : (
                <ListManagerDesktop<Passive>
                    title="Combat Passives"
                    description={`${passives.length} passive${passives.length !== 1 ? "s" : ""}`}
                    data={passives}
                    renderItem={renderPassiveItem}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setShowAddPassiveModal(true)}
                    addButtonText="Add Passive"
                    emptyStateText="You haven't added any passive abilities yet. Add a passive ability to get started."
                />
            )}

            {/* Add Passive Modal */}
            <Modal visible={showAddPassiveModal} transparent animationType="slide">
                <View style={cssStyle.modalOverlay}>
                    <ThemedView style={cssStyle.modalView}>
                        <ThemedText style={cssStyle.modalTitle}>Add New Passive Ability</ThemedText>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Name:</ThemedText>
                            <TextInput
                                style={cssStyle.input}
                                value={newPassiveName}
                                onChangeText={setNewPassiveName}
                                placeholder="Passive ability name"
                                placeholderTextColor="#999"
                            />
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
                            <TextInput
                                style={cssStyle.input}
                                value={newPassiveBPCost}
                                onChangeText={setNewPassiveBPCost}
                                placeholder="15"
                                placeholderTextColor="#999"
                                keyboardType="number-pad"
                            />
                        </View>

                        <View style={cssStyle.modalButtons}>
                            <Pressable style={cssStyle.secondaryButton} onPress={() => setShowAddPassiveModal(false)}>
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable style={cssStyle.primaryButton} onPress={handleAddPassive} disabled={!newPassiveName.trim() || !newPassiveBPCost}>
                                <ThemedText style={cssStyle.buttonText}>Add Passive</ThemedText>
                            </Pressable>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </>
    );
}
