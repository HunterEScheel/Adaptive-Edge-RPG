import { RootState } from "@/store/rootReducer";
import { addNPC, NPC, RelationshipLevel, removeNPC, updateNPC, updateNPCRelationship } from "@/store/slices/notesSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Collapsible } from "../Collapsible";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const NPCTracker: React.FC = () => {
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

  // Build relationship indicator UI
  const renderRelationshipIndicator = (level: RelationshipLevel, onUpdate?: (newLevel: RelationshipLevel) => void) => {
    const colors = [
      "#D32F2F", // -3: Dark Red
      "#F44336", // -2: Red
      "#FF9800", // -1: Orange
      "#9E9E9E", // 0: Grey
      "#8BC34A", // 1: Light Green
      "#4CAF50", // 2: Green
      "#2E7D32", // 3: Dark Green
    ];

    return (
      <View style={styles.relationshipContainer}>
        <ThemedText style={styles.relationshipLabel}>{getRelationshipDescription(level)}</ThemedText>

        <View style={styles.relationshipScale}>
          {[-3, -2, -1, 0, 1, 2, 3].map((value) => {
            const colorIndex = value + 3; // Convert -3..3 to 0..6 for array index
            const isActive = level === value;

            return (
              <Pressable
                key={value}
                style={[styles.relationshipDot, { backgroundColor: colors[colorIndex] }, isActive && styles.activeDot]}
                onPress={onUpdate ? () => onUpdate(value as RelationshipLevel) : undefined}
                disabled={!onUpdate}
              />
            );
          })}
        </View>
      </View>
    );
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
      <ThemedView style={styles.npcCard}>
        <View style={styles.npcHeader}>
          <ThemedText style={styles.npcName}>{item.name}</ThemedText>
          <Pressable style={styles.expandButton} onPress={() => toggleExpanded(item.id)}>
            <MaterialIcons name={isExpanded ? "expand-less" : "expand-more"} size={24} color="#444" />
          </Pressable>
        </View>

        <ThemedText style={styles.npcDescription}>{item.description}</ThemedText>

        <ThemedText style={styles.relationshipText}>{getRelationshipDescription(item.relationshipLevel)}</ThemedText>

        {isExpanded && (
          <>
            {item.notes ? (
              <View style={styles.notesContainer}>
                <ThemedText style={styles.notesHeader}>Notes:</ThemedText>
                <ThemedText style={styles.notesContent}>{item.notes}</ThemedText>
              </View>
            ) : null}

            <View style={styles.actionButtons}>
              <Pressable style={styles.iconButton} onPress={() => openEditModal(item)}>
                <MaterialIcons name="edit" size={20} color="#444" />
              </Pressable>
              <Pressable style={styles.iconButton} onPress={() => handleDeleteNPC(item.id)}>
                <MaterialIcons name="delete" size={20} color="#ff4444" />
              </Pressable>
            </View>
          </>
        )}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Collapsible title="NPC Relationships">
        <ThemedView style={styles.npcContainer}>
          {npcs.length === 0 ? (
            <ThemedText style={styles.emptyText}>No NPCs added yet.</ThemedText>
          ) : (
            <FlatList
              data={npcs}
              keyExtractor={(item) => item.id}
              renderItem={renderNPC}
              contentContainerStyle={styles.npcList}
              scrollEnabled={false} // Let parent scroll view handle scrolling
            />
          )}

          <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <MaterialIcons name="person-add" size={24} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add NPC</ThemedText>
          </Pressable>

          {/* Modal for adding/editing NPCs */}
          <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => resetForm()}>
            <View style={styles.modalOverlay}>
              <ThemedView style={styles.modalContent}>
                <ThemedText style={styles.modalHeader}>{selectedNPC ? "Edit NPC" : "Add New NPC"}</ThemedText>

                <TextInput
                  style={styles.input}
                  value={selectedNPC ? editNPCName : newNPCName}
                  onChangeText={selectedNPC ? setEditNPCName : setNewNPCName}
                  placeholder="NPC Name"
                  placeholderTextColor="#aaa"
                />

                <TextInput
                  style={styles.textArea}
                  value={selectedNPC ? editNPCDesc : newNPCDesc}
                  onChangeText={selectedNPC ? setEditNPCDesc : setNewNPCDesc}
                  placeholder="Description (optional)"
                  placeholderTextColor="#aaa"
                  multiline
                />

                <ThemedText style={styles.sectionHeader}>Relationship Level:</ThemedText>
                {renderRelationshipIndicator(selectedNPC ? editNPCRelationship : newNPCRelationship, (newLevel) => (selectedNPC ? setEditNPCRelationship(newLevel) : setNewNPCRelationship(newLevel)))}

                <ThemedText style={styles.relationshipHelp}>
                  {getRelationshipDescription(selectedNPC ? editNPCRelationship : newNPCRelationship)}
                  {" (-3 to +3)"}
                </ThemedText>

                <TextInput
                  style={styles.textArea}
                  value={selectedNPC ? editNPCNotes : newNPCNotes}
                  onChangeText={selectedNPC ? setEditNPCNotes : setNewNPCNotes}
                  placeholder="Notes about this NPC (optional)"
                  placeholderTextColor="#aaa"
                  multiline
                />

                <View style={styles.modalButtons}>
                  <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={resetForm}>
                    <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                  </Pressable>
                  <Pressable style={[styles.modalButton, styles.saveButton]} onPress={selectedNPC ? handleUpdateNPC : handleAddNPC}>
                    <ThemedText style={styles.buttonText}>{selectedNPC ? "Update" : "Add"}</ThemedText>
                  </Pressable>
                </View>
              </ThemedView>
            </View>
          </Modal>
        </ThemedView>
      </Collapsible>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  npcContainer: {
    padding: 10,
  },
  npcList: {
    marginBottom: 10,
  },
  npcCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#673AB7",
  },
  npcHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandButton: {
    padding: 5,
  },
  npcName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    flex: 1,
  },
  npcDescription: {
    fontSize: 14,
    marginBottom: 10,
    fontStyle: "italic",
  },
  relationshipText: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
  relationshipContainer: {
    marginVertical: 10,
  },
  relationshipLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  relationshipScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  relationshipDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  activeDot: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#333",
    zIndex: 1,
  },
  relationshipHelp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },
  notesContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
  },
  notesHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notesContent: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontStyle: "italic",
    color: "#888",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#673AB7",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 16,
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    minHeight: 80,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#673AB7",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
