import { findMatchingSkills } from "@/components/ai/compareEmbedding";
import { Skill, calculateSkillCost, calculateTotalSkillCost } from "@/constants/Skills";
import embeddingDatabase from "@/services/embeddingDatabase";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { addSkill, removeSkill, updateSkillLevel } from "@/store/slices/skillsSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// Simple ID generator function
const generateId = () => Math.random().toString(36).substring(2, 15);

export function SkillManager() {
  const dispatch = useDispatch();
  // Get character state from Redux with fallbacks for initialization
  const skills = useSelector((state: RootState) => state.character?.skills?.skills || []);
  const base = useSelector((state: RootState) => state.character?.base || { buildPointsRemaining: 0, buildPointsSpent: 0 });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // New skill form state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");

  // Online/offline state
  const [isOnline, setIsOnline] = useState(true); // Default to true, will be updated on mount
  const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Skill suggestions state
  const [suggestions, setSuggestions] = useState<Array<{ skill: string; similarity: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Calculate total BP spent on skills
  const totalSkillPoints = skills
    ? skills.reduce((total: number, skill: Skill) => {
        return total + calculateTotalSkillCost(skill.level);
      }, 0)
    : 0;

  // Network connectivity check function - detects if we're on WiFi
  const checkConnectivity = useCallback(async () => {
    console.log("Checking connectivity status...");
    setIsCheckingConnectivity(true);
    try {
      // Try multiple endpoints to ensure we can detect connectivity
      const endpoints = ["https://api.supabase.co/health", "https://www.google.com", "https://www.apple.com"];

      // Try each endpoint until one works
      let connected = false;
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to connect to ${endpoint}...`);
          const response = await Promise.race([fetch(endpoint, { method: "HEAD" }), new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000))]);

          if (response instanceof Response && response.ok) {
            connected = true;
            console.log(`Successfully connected to ${endpoint}!`);
            break;
          }
        } catch (endpointError) {
          console.log(`Failed to connect to ${endpoint}: ${String(endpointError)}`);
        }
      }

      console.log(`Connection status determined: ${connected ? "ONLINE" : "OFFLINE"}`);
      setIsOnline(connected);

      // Update offline mode in embedding database
      if (embeddingDatabase && typeof embeddingDatabase.setOfflineMode === "function") {
        console.log(`Setting embedding database to ${connected ? "ONLINE" : "OFFLINE"} mode`);
        await embeddingDatabase.setOfflineMode(!connected);
      }

      // Initialize the embedding database if online
      if (connected) {
        try {
          console.log("Connected to network, syncing embeddings from cloud...");
          await embeddingDatabase.syncFromCloud();
          console.log("Successfully synced embeddings from cloud");
        } catch (error) {
          console.error("Error syncing embeddings:", error);
        }
      }

      return connected;
    } catch (error) {
      console.log("Network check failed:", error);
      setIsOnline(false);

      // Update offline mode in embedding database
      if (embeddingDatabase && typeof embeddingDatabase.setOfflineMode === "function") {
        await embeddingDatabase.setOfflineMode(true);
      }

      return false;
    } finally {
      setIsCheckingConnectivity(false);
    }
  }, []);

  // Check connectivity on mount and periodically
  useEffect(() => {
    // Initial check
    checkConnectivity();

    // Set up periodic checks every 30 seconds when the app is active
    const intervalId = setInterval(checkConnectivity, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [checkConnectivity]);

  // Debounced search for similar skills function
  const debouncedSearch = useCallback(
    (skillName: string) => {
      if (!skillName.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const timer = setTimeout(async () => {
        await getSuggestions(skillName);
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    },
    [isOnline]
  );

  // Get skill suggestions based on input
  const getSuggestions = async (skillName: string) => {
    if (!skillName.trim() || !isOnline) return;

    try {
      setLoadingSuggestions(true);
      const matchingSkills = await findMatchingSkills(skillName, false);

      // Show all matches with at least 35% similarity
      setSuggestions(matchingSkills.filter((match: { skill: string; similarity: number }) => match.similarity > 0.35));

      console.log(`Found ${matchingSkills.length} matches, ${matchingSkills.filter((m: any) => m.similarity > 0.35).length} above 35% threshold`);
      setShowSuggestions(true);
      setLoadingSuggestions(false);
    } catch (error) {
      console.error("Error getting skill suggestions:", error);
      setLoadingSuggestions(false);
      setSuggestions([]);
    }
  };

  // Use debounce to avoid excessive API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (newSkillName.trim().length > 2 && isOnline) {
        getSuggestions(newSkillName);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [newSkillName, isOnline]);

  // Select a suggested skill
  const selectSuggestion = (suggestion: string) => {
    // Instead of just setting the name, directly add the skill
    const newSkill: Skill = {
      id: generateId(),
      name: newSkillName.trim(),
      description: newSkillDescription.trim(),
      level: 1,
    };

    // Update the character state
    dispatch(addSkill(newSkill));

    // Update build points (cost of level 1 skill)
    const costLevel1 = calculateSkillCost(1);
    // Update both buildPointsRemaining and buildPointsSpent
    dispatch({
      type: "character/updateMultipleFields",
      payload: [
        {
          field: "buildPointsRemaining",
          value: base.buildPointsRemaining - costLevel1,
        },
        {
          field: "buildPointsSpent",
          value: base.buildPointsSpent + costLevel1,
        },
      ],
    });

    // Reset UI state
    setNewSkillName("");
    setNewSkillDescription("");
    setSuggestions([]);
    setShowSuggestions(false);
    setAddModalVisible(false); // Close the modal
  };

  // Handle adding a custom skill
  const handleAddCustomSkill = async () => {
    if (!newSkillName.trim()) {
      Alert.alert("Error", "Please enter a skill name.");
      return;
    }

    // Check if skill already exists
    const skillExists = skills?.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (skillExists) {
      Alert.alert("Error", "This skill already exists.");
      return;
    }

    // Create new skill
    const newSkill: Skill = {
      id: generateId(),
      name: newSkillName.trim(),
      description: newSkillDescription.trim() || "Custom skill",
      level: 1, // Start at level 1
    };

    // Calculate cost
    const cost = calculateTotalSkillCost(newSkill.level);

    // Check if enough build points are available
    if (base.buildPointsRemaining < cost) {
      Alert.alert("Not Enough Build Points", `You need ${cost} build points to add this skill. You have ${base.buildPointsRemaining} remaining.`);
      return;
    }

    // Add skill and update build points
    dispatch(addSkill(newSkill));
    dispatch(
      updateMultipleFields([
        { field: "buildPointsRemaining", value: base.buildPointsRemaining - cost },
        { field: "buildPointsSpent", value: base.buildPointsSpent + cost },
      ])
    );

    // Reset form and close modal
    setNewSkillName("");
    setNewSkillDescription("");
    setAddModalVisible(false);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle skill level change
  const handleLevelChange = (skill: Skill, increase: boolean) => {
    // Calculate current and new level
    const currentLevel = skill.level;
    const newLevel = increase ? currentLevel + 1 : currentLevel - 1;

    // Validate new level (between 1 and 10)
    if (newLevel < 1 || newLevel > 10) return;

    // Calculate cost difference
    const currentCost = calculateTotalSkillCost(currentLevel);
    const newCost = calculateTotalSkillCost(newLevel);
    const costDifference = newCost - currentCost;

    // Check if enough build points are available for increase
    if (increase && base.buildPointsRemaining < costDifference) {
      Alert.alert("Not Enough Build Points", `You need ${costDifference} more build points to upgrade this skill. You have ${base.buildPointsRemaining} remaining.`);
      return;
    }

    // Update skill level
    dispatch(updateSkillLevel({ id: skill.id, level: newLevel }));

    // Update build points
    dispatch(
      updateMultipleFields([
        { field: "buildPointsRemaining", value: base.buildPointsRemaining - costDifference },
        { field: "buildPointsSpent", value: base.buildPointsSpent + costDifference },
      ])
    );
  };

  // Handle skill deletion
  const handleDeleteSkill = (skill: Skill) => {
    // Calculate refund amount
    const refundAmount = calculateTotalSkillCost(skill.level);

    // Confirm deletion
    Alert.alert("Delete Skill", `Are you sure you want to delete ${skill.name}? You will be refunded ${refundAmount} build points.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // Remove the skill and refund build points
          dispatch(removeSkill(skill.id));

          // Update build points (refund)
          dispatch(
            updateMultipleFields([
              { field: "buildPointsRemaining", value: base.buildPointsRemaining + refundAmount },
              { field: "buildPointsSpent", value: base.buildPointsSpent - refundAmount },
            ])
          );
        },
      },
    ]);
  };

  const renderSkillItem = ({ item }: { item: Skill }) => {
    const nextLevelCost = item.level < 10 ? calculateSkillCost(item.level + 1) : null;

    return (
      <View style={styles.skillItem}>
        <View style={styles.skillHeader}>
          <View style={styles.skillNameContainer}>
            <ThemedText style={styles.skillName} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </ThemedText>
            {item.description && (
              <ThemedText style={styles.skillDescription} numberOfLines={1} ellipsizeMode="tail">
                {item.description}
              </ThemedText>
            )}
          </View>
          <View style={styles.levelContainer}>
            <Pressable style={[styles.levelButton, styles.decreaseButton]} onPress={() => handleLevelChange(item, false)} disabled={item.level <= 1}>
              <ThemedText style={styles.levelButtonText}>-</ThemedText>
            </Pressable>
            <View style={styles.levelDisplay}>
              <ThemedText style={styles.levelValue}>{item.level}</ThemedText>
            </View>
            <Pressable style={[styles.levelButton, styles.increaseButton]} onPress={() => handleLevelChange(item, true)} disabled={item.level >= 10}>
              <ThemedText style={styles.levelButtonText}>+</ThemedText>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => handleDeleteSkill(item)}>
              <FontAwesome name="trash" size={14} color="#F44336" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.sectionTitle}>Skills</ThemedText>
        <View style={styles.costInfoContainer}>
          <ThemedText style={styles.costInfo}>Build Points Remaining: {base.buildPointsRemaining}</ThemedText>
          <ThemedText style={styles.costInfo}>Build Points Spent on Skills: {totalSkillPoints}</ThemedText>
        </View>
      </View>

      {skills && skills.length > 0 ? (
        <FlatList data={skills} renderItem={renderSkillItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.skillsList} />
      ) : (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>No skills added yet. Add your first skill!</ThemedText>
        </ThemedView>
      )}

      <Pressable style={styles.addButton} onPress={() => setAddModalVisible(true)}>
        <FontAwesome name="plus" size={20} color="#FFFFFF" />
        <ThemedText style={styles.addButtonText}>Add Skill</ThemedText>
      </Pressable>

      {/* Add Skill Modal */}
      <Modal animationType="slide" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add New Skill</ThemedText>
              {isOnline ? <ThemedText style={styles.onlineIndicator}>Online</ThemedText> : <ThemedText style={styles.offlineIndicator}>Offline</ThemedText>}
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Skill Name</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={newSkillName} onChangeText={setNewSkillName} placeholder="Enter skill name" placeholderTextColor="#999" />
                {loadingSuggestions && <ActivityIndicator size="small" color="#007AFF" style={styles.inputIndicator} />}
              </View>

              {isOnline && showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <ThemedText style={styles.suggestionsTitle}>Suggestions ({suggestions.length}):</ThemedText>
                  <ScrollView style={styles.suggestionsScrollView} showsVerticalScrollIndicator={true}>
                    {suggestions.map((suggestion, index) => (
                      <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => selectSuggestion(suggestion.skill)}>
                        <ThemedText>{suggestion.skill}</ThemedText>
                        <ThemedText style={styles.similarityText}>{Math.round(suggestion.similarity * 100)}% match</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Description (Optional)</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newSkillDescription}
                onChangeText={setNewSkillDescription}
                placeholder="Enter skill description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.costInfoContainer}>
              <ThemedText>Cost: {calculateSkillCost(1)} BP</ThemedText>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewSkillName("");
                  setNewSkillDescription("");
                  setAddModalVisible(false);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddCustomSkill} disabled={!newSkillName.trim() || base.buildPointsRemaining < 1}>
                <ThemedText style={styles.buttonText}>Add Skill</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pointsSpent: {
    fontSize: 14,
    color: "#666",
  },
  skillsList: {
    paddingBottom: 80, // Space for add button
  },
  skillItem: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillNameContainer: {
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  skillName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  decreaseButton: {
    backgroundColor: "#F44336",
  },
  increaseButton: {
    backgroundColor: "#4CAF50",
  },
  levelButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  levelDisplay: {
    alignItems: "center",
    marginHorizontal: 4,
    width: 20,
  },
  levelValue: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  skillDescription: {
    fontSize: 12,
    color: "#666",
  },
  skillFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  costInfo: {
    fontSize: 12,
    color: "#666",
  },
  costInfoContainer: {
    marginBottom: 16,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
  emptyStateText: {
    color: "#666",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#007AFF",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxWidth: 500,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dropdown: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#CCCCCC",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  onlineIndicator: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
  },
  offlineIndicator: {
    color: "#F44336",
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIndicator: {
    position: "absolute",
    right: 10,
  },
  suggestionsContainer: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    maxHeight: 200,
  },
  suggestionsScrollView: {
    maxHeight: 180,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },
  similarityText: {
    fontSize: 12,
    color: "#666",
  },
});
