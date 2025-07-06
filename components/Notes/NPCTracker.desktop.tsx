import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { addNPC, NPC, RelationshipLevel, removeNPC, updateNPC, updateNPCRelationship } from "@/store/slices/notesSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, ScrollView, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const NPCTrackerDesktop: React.FC = () => {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const npcs = useSelector((state: RootState) => state.character.notes.npcs || []);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
    const [expandedNPCs, setExpandedNPCs] = useState<{ [key: string]: boolean }>({});

    // Form states for adding new NPC
    const [newNPCName, setNewNPCName] = useState("");
    const [newNPCDesc, setNewNPCDesc] = useState("");
    const [newNPCRelationship, setNewNPCRelationship] = useState<RelationshipLevel>(0);
    const [newNPCNotes, setNewNPCNotes] = useState("");

    // Form states for editing existing NPC
    const [editNPCName, setEditNPCName] = useState("");
    const [editNPCDesc, setEditNPCDesc] = useState("");
    const [editNPCRelationship, setEditNPCRelationship] = useState<RelationshipLevel>(0);
    const [editNPCNotes, setEditNPCNotes] = useState("");

    // Reset all form fields
    const resetForm = () => {
        setNewNPCName("");
        setNewNPCDesc("");
        setNewNPCRelationship(0);
        setNewNPCNotes("");

        setEditNPCName("");
        setEditNPCDesc("");
        setEditNPCRelationship(0);
        setEditNPCNotes("");

        setSelectedNPC(null);
        setModalVisible(false);
    };

    const handleAddNPC = () => {
        if (newNPCName.trim()) {
            dispatch(
                addNPC({
                    name: newNPCName,
                    description: newNPCDesc,
                    relationshipLevel: newNPCRelationship,
                    notes: newNPCNotes,
                })
            );
            resetForm();
        } else {
            Alert.alert("Invalid Input", "NPC name is required.");
        }
    };

    const handleUpdateNPC = () => {
        if (selectedNPC && editNPCName.trim()) {
            // Update NPC details
            dispatch(
                updateNPC({
                    id: selectedNPC.id,
                    name: editNPCName,
                    description: editNPCDesc,
                    notes: editNPCNotes,
                })
            );

            // Update relationship level separately
            dispatch(
                updateNPCRelationship({
                    id: selectedNPC.id,
                    relationshipLevel: editNPCRelationship,
                })
            );

            resetForm();
        } else {
            Alert.alert("Invalid Input", "NPC name is required.");
        }
    };

    const handleDeleteNPC = (npcId: string) => {
        Alert.alert("Delete NPC", "Are you sure you want to delete this NPC?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => dispatch(removeNPC(npcId)),
            },
        ]);
    };

    const openEditModal = (npc: NPC) => {
        setSelectedNPC(npc);
        setEditNPCName(npc.name);
        setEditNPCDesc(npc.description);
        setEditNPCRelationship(npc.relationshipLevel);
        setEditNPCNotes(npc.notes);
        setModalVisible(true);
    };

    // Get relationship description based on level (-3 to +3)
    const getRelationshipDescription = (level: RelationshipLevel) => {
        switch (level) {
            case -3:
                return "Mortal Enemies";
            case -2:
                return "Hostile";
            case -1:
                return "Unfriendly";
            case 0:
                return "Neutral";
            case 1:
                return "Friendly";
            case 2:
                return "Allied";
            case 3:
                return "Great Allies";
            default:
                return "Unknown";
        }
    };

    const toggleExpanded = (npcId: string) => {
        setExpandedNPCs((prev) => ({
            ...prev,
            [npcId]: !prev[npcId],
        }));
    };

    const renderNPC = ({ item }: { item: NPC }) => {
        const isExpanded = expandedNPCs[item.id] || false;

        return (
            <ThemedView style={cssStyle.noteCard}>
                <View style={cssStyle.itemHeader}>
                    <ThemedText style={cssStyle.title}>{item.name}</ThemedText>
                    <Pressable style={cssStyle.primaryButton} onPress={() => toggleExpanded(item.id)}>
                        <MaterialIcons name={isExpanded ? "expand-less" : "expand-more"} size={24} color="#444" />
                    </Pressable>
                </View>

                <ThemedText style={cssStyle.bodyText}>{item.description}</ThemedText>

                <ThemedText style={cssStyle.bodyText}>{getRelationshipDescription(item.relationshipLevel)}</ThemedText>

                {isExpanded && (
                    <>
                        {item.notes ? (
                            <View style={cssStyle.itemContainer}>
                                <ThemedText style={cssStyle.headerText}>Notes:</ThemedText>
                                <ThemedText style={cssStyle.bodyText}>{item.notes}</ThemedText>
                            </View>
                        ) : null}

                        <View style={cssStyle.buttonGroup}>
                            <Pressable style={cssStyle.primaryButton} onPress={() => openEditModal(item)}>
                                <MaterialIcons name="edit" size={20} color="#444" />
                            </Pressable>
                            <Pressable style={cssStyle.secondaryButton} onPress={() => handleDeleteNPC(item.id)}>
                                <MaterialIcons name="delete" size={20} color="#ff4444" />
                            </Pressable>
                        </View>
                    </>
                )}
            </ThemedView>
        );
    };

    return (
        <ScrollView>
            <ThemedView style={cssStyle.container}>
                {npcs.length === 0 ? (
                    <ThemedText style={cssStyle.emptyText}>No NPCs added yet.</ThemedText>
                ) : (
                    <FlatList
                        data={npcs}
                        keyExtractor={(item) => item.id}
                        renderItem={renderNPC}
                        contentContainerStyle={cssStyle.list}
                        scrollEnabled={false} // Let parent scroll view handle scrolling
                    />
                )}

                <Pressable style={cssStyle.primaryButton} onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="person-add" size={24} color="#fff" />
                    <ThemedText style={cssStyle.buttonText}>Add NPC</ThemedText>
                </Pressable>

                {/* Modal for adding/editing NPCs */}
                <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => resetForm()}>
                    <View style={[cssStyle.modal]}>
                        <ThemedView style={cssStyle.modalOverlay}>
                            <ThemedText style={cssStyle.modalTitle}>{selectedNPC ? "Edit NPC" : "Add New NPC"}</ThemedText>

                            <TextInput
                                style={cssStyle.input}
                                value={selectedNPC ? editNPCName : newNPCName}
                                onChangeText={selectedNPC ? setEditNPCName : setNewNPCName}
                                placeholder="NPC Name"
                                placeholderTextColor="#aaa"
                            />

                            <TextInput
                                style={cssStyle.textArea}
                                value={selectedNPC ? editNPCDesc : newNPCDesc}
                                onChangeText={selectedNPC ? setEditNPCDesc : setNewNPCDesc}
                                placeholder="Description (optional)"
                                placeholderTextColor="#aaa"
                                multiline
                            />

                            <ThemedText style={cssStyle.sectionHeader}>Relationship Level:</ThemedText>

                            <View style={cssStyle.container}>
                                <ThemedText style={cssStyle.title}>{getRelationshipDescription(selectedNPC?.relationshipLevel ?? 0)}</ThemedText>

                                <View style={cssStyle.relationshipScale}>
                                    <Slider
                                        minimumValue={-3}
                                        maximumValue={3}
                                        step={1}
                                        value={selectedNPC?.relationshipLevel ?? 0}
                                        style={{ width: 300 }}
                                        onSlidingComplete={(value) =>
                                            selectedNPC ? setEditNPCRelationship(value as RelationshipLevel) : setNewNPCRelationship(value as RelationshipLevel)
                                        }
                                    />
                                </View>
                            </View>

                            <ThemedText style={cssStyle.skillDescription}>
                                {getRelationshipDescription(selectedNPC ? editNPCRelationship : newNPCRelationship)}
                                {" (-3 to +3)"}
                            </ThemedText>

                            <TextInput
                                style={cssStyle.textArea}
                                value={selectedNPC ? editNPCNotes : newNPCNotes}
                                onChangeText={selectedNPC ? setEditNPCNotes : setNewNPCNotes}
                                placeholder="Notes about this NPC (optional)"
                                placeholderTextColor="#aaa"
                                multiline
                            />

                            <View style={cssStyle.modalButtons}>
                                <Pressable style={[cssStyle.secondaryButton]} onPress={resetForm}>
                                    <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                                </Pressable>
                                <Pressable style={[cssStyle.primaryButton]} onPress={selectedNPC ? handleUpdateNPC : handleAddNPC}>
                                    <ThemedText style={cssStyle.buttonText}>{selectedNPC ? "Update" : "Add"}</ThemedText>
                                </Pressable>
                            </View>
                        </ThemedView>
                    </View>
                </Modal>
            </ThemedView>
        </ScrollView>
    );
};
