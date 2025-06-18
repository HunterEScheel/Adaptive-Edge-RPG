import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { addAttack, addPassive, Attack, Passive, removeAttack, removePassive } from "@/store/slices/abilitiesSlice";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function CombatAbilitiesManager() {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const attacks = character.abilities.attacks || [];
    const passives = character.abilities.passives || [];
    const buildPoints = character.base.buildPointsRemaining || 0;

    // Tabs for switching between attacks and passives
    const [activeTab, setActiveTab] = useState<"attacks" | "passives">("attacks");

    // Modals for adding items
    const [showAddAttackModal, setShowAddAttackModal] = useState(false);
    const [showAddPassiveModal, setShowAddPassiveModal] = useState(false);

    // Form states for new attack
    const [newAttackName, setNewAttackName] = useState("");
    const [newAttackDescription, setNewAttackDescription] = useState("");
    const [newAttackBPCost, setNewAttackBPCost] = useState("");
    const [newAttackEPCost, setNewAttackEPCost] = useState("");

    // Form states for new passive
    const [newPassiveName, setNewPassiveName] = useState("");
    const [newPassiveDescription, setNewPassiveDescription] = useState("");
    const [newPassiveBPCost, setNewPassiveBPCost] = useState("");

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

    // Render an attack item
    const renderAttackItem = ({ item }: { item: Attack }) => (
        <ThemedView style={cssStyle.abilityItem}>
            <View style={cssStyle.headerRow}>
                <ThemedText style={cssStyle.abilityName}>{item.name}</ThemedText>
                <Pressable style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleRemoveAttack(item.id)}>
                    <ThemedText style={cssStyle.smallButtonText}>×</ThemedText>
                </Pressable>
            </View>

            <ThemedText style={cssStyle.abilityDescription}>{item.description}</ThemedText>

            <View style={cssStyle.abilityFooter}>
                <ThemedText style={cssStyle.costText}>
                    <ThemedText style={cssStyle.costLabel}>BP Cost:</ThemedText> {item.buildPointCost}
                </ThemedText>
                <ThemedText style={cssStyle.costText}>
                    <ThemedText style={cssStyle.costLabel}>Energy Cost:</ThemedText> {item.energyCost}
                </ThemedText>
            </View>
        </ThemedView>
    );

    // Render a passive ability item
    const renderPassiveItem = ({ item }: { item: Passive }) => (
        <ThemedView style={cssStyle.abilityItem}>
            <View style={cssStyle.headerRow}>
                <ThemedText style={cssStyle.abilityName}>{item.name}</ThemedText>
                <Pressable style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleRemovePassive(item.id)}>
                    <ThemedText style={cssStyle.smallButtonText}>×</ThemedText>
                </Pressable>
            </View>

            <ThemedText style={cssStyle.abilityDescription}>{item.description}</ThemedText>

            <View style={cssStyle.abilityFooter}>
                <ThemedText style={cssStyle.costText}>
                    <ThemedText style={cssStyle.costLabel}>BP Cost:</ThemedText> {item.buildPointCost}
                </ThemedText>
                <ThemedText style={[cssStyle.passiveTag]}>PASSIVE</ThemedText>
            </View>
        </ThemedView>
    );

    return (
        <ThemedView style={cssStyle.container}>
            {/* Header */}
            <View style={cssStyle.headerRow}>
                <ThemedText style={cssStyle.title}>Combat Abilities</ThemedText>
            </View>

            {/* Tab Navigation */}
            <View style={cssStyle.row}>
                <Pressable style={[cssStyle.tabButton, activeTab === "attacks" && cssStyle.activeTab]} onPress={() => setActiveTab("attacks")}>
                    <ThemedText style={[cssStyle.tabText, activeTab === "attacks" && cssStyle.activeTabText]}>Attacks ({attacks.length})</ThemedText>
                </Pressable>
                <Pressable style={[cssStyle.tabButton, activeTab === "passives" && cssStyle.activeTab]} onPress={() => setActiveTab("passives")}>
                    <ThemedText style={[cssStyle.tabText, activeTab === "passives" && cssStyle.activeTabText]}>Passives ({passives.length})</ThemedText>
                </Pressable>
            </View>

            {/* Content */}
            {activeTab === "attacks" ? (
                attacks.length > 0 ? (
                    <FlatList
                        data={attacks}
                        renderItem={renderAttackItem}
                        keyExtractor={(item) => item.id}
                        style={[cssStyle.list, { maxHeight: 350 }]}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={cssStyle.emptyState}>
                        <ThemedText style={cssStyle.emptyStateText}>No attacks yet.{"\n"}Tap the + button to add your first attack!</ThemedText>
                    </View>
                )
            ) : passives.length > 0 ? (
                <FlatList
                    data={passives}
                    renderItem={renderPassiveItem}
                    keyExtractor={(item) => item.id}
                    style={[cssStyle.list, { maxHeight: 350 }]}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={cssStyle.emptyState}>
                    <ThemedText style={cssStyle.emptyStateText}>No passive abilities yet.{"\n"}Tap the + button to add your first passive ability!</ThemedText>
                </View>
            )}

            {/* Add Button */}
            <Pressable
                style={cssStyle.primaryButton}
                onPress={() => {
                    if (activeTab === "attacks") {
                        setShowAddAttackModal(true);
                    } else {
                        setShowAddPassiveModal(true);
                    }
                }}
            >
                <FontAwesome name="plus" size={16} color="white" />
                <ThemedText style={cssStyle.buttonText}>Add {activeTab === "attacks" ? "Attack" : "Passive"}</ThemedText>
            </Pressable>

            {/* Add Attack Modal */}
            <Modal animationType="slide" transparent={true} visible={showAddAttackModal} onRequestClose={() => setShowAddAttackModal(false)}>
                <View style={cssStyle.modalOverlay}>
                    <ThemedView style={cssStyle.modalView}>
                        <ThemedText style={cssStyle.title}>Add New Attack</ThemedText>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Attack Name *</ThemedText>
                            <TextInput
                                style={cssStyle.input}
                                value={newAttackName}
                                onChangeText={setNewAttackName}
                                placeholder="Enter attack name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Description</ThemedText>
                            <TextInput
                                style={[cssStyle.input, cssStyle.textArea]}
                                value={newAttackDescription}
                                onChangeText={setNewAttackDescription}
                                placeholder="Describe the attack..."
                                placeholderTextColor="#999"
                                multiline
                            />
                        </View>

                        <View style={cssStyle.formRow}>
                            <View style={[cssStyle.formGroup, { flex: 1, marginRight: 10 }]}>
                                <ThemedText style={cssStyle.label}>Build Points *</ThemedText>
                                <TextInput
                                    style={cssStyle.input}
                                    value={newAttackBPCost}
                                    onChangeText={setNewAttackBPCost}
                                    placeholder="0"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[cssStyle.formGroup, { flex: 1, marginLeft: 10 }]}>
                                <ThemedText style={cssStyle.label}>Energy Cost</ThemedText>
                                <TextInput
                                    style={cssStyle.input}
                                    value={newAttackEPCost}
                                    onChangeText={setNewAttackEPCost}
                                    placeholder="0"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={cssStyle.modalButtons}>
                            <Pressable style={cssStyle.secondaryButton} onPress={() => setShowAddAttackModal(false)}>
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable
                                style={[cssStyle.primaryButton, (!newAttackName.trim() || !newAttackBPCost) && cssStyle.disabledButton]}
                                onPress={handleAddAttack}
                                disabled={!newAttackName.trim() || !newAttackBPCost}
                            >
                                <ThemedText style={cssStyle.buttonText}>Add Attack</ThemedText>
                            </Pressable>
                        </View>
                    </ThemedView>
                </View>
            </Modal>

            {/* Add Passive Modal */}
            <Modal animationType="slide" transparent={true} visible={showAddPassiveModal} onRequestClose={() => setShowAddPassiveModal(false)}>
                <View style={cssStyle.modalOverlay}>
                    <ThemedView style={cssStyle.modalView}>
                        <ThemedText style={cssStyle.title}>Add New Passive Ability</ThemedText>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Passive Name *</ThemedText>
                            <TextInput
                                style={cssStyle.input}
                                value={newPassiveName}
                                onChangeText={setNewPassiveName}
                                placeholder="Enter passive ability name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Description</ThemedText>
                            <TextInput
                                style={[cssStyle.input, cssStyle.textArea]}
                                value={newPassiveDescription}
                                onChangeText={setNewPassiveDescription}
                                placeholder="Describe the passive ability..."
                                placeholderTextColor="#999"
                                multiline
                            />
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Build Points *</ThemedText>
                            <TextInput
                                style={cssStyle.input}
                                value={newPassiveBPCost}
                                onChangeText={setNewPassiveBPCost}
                                placeholder="0"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={cssStyle.modalButtons}>
                            <Pressable style={cssStyle.secondaryButton} onPress={() => setShowAddPassiveModal(false)}>
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable
                                style={[cssStyle.primaryButton, (!newPassiveName.trim() || !newPassiveBPCost) && cssStyle.disabledButton]}
                                onPress={handleAddPassive}
                                disabled={!newPassiveName.trim() || !newPassiveBPCost}
                            >
                                <ThemedText style={cssStyle.buttonText}>Add Passive</ThemedText>
                            </Pressable>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </ThemedView>
    );
}
