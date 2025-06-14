import { findMatchingSkills } from "@/components/ai/compareEmbedding";
import { ListManager } from "@/components/Common/ListManager";
import { Skill, calculateSkillCost, calculateTotalSkillCost } from "@/constants/Skills";
import embeddingDatabase from "@/services/embeddingDatabase";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { addSkill, removeSkill, updateSkillLevel } from "@/store/slices/skillsSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { cssStyle } from "../../app/styles/phone";
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

    // New skill form state
    const [newSkillName, setNewSkillName] = useState("");
    const [newSkillDescription, setNewSkillDescription] = useState("");

    // Online/offline state
    const [isOnline, setIsOnline] = useState(true); // Default to true, will be updated on mount
    const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(false);

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
            // Use a simple GET request to a reliable endpoint with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            try {
                const response = await fetch("https://www.google.com/favicon.ico", {
                    method: "GET",
                    signal: controller.signal,
                    cache: "no-cache",
                });

                clearTimeout(timeoutId);
                const connected = response.ok;

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
            } catch (fetchError) {
                clearTimeout(timeoutId);
                throw fetchError;
            }
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
            Alert.alert(
                "Not Enough Build Points",
                `You need ${costDifference} more build points to upgrade this skill. You have ${base.buildPointsRemaining} remaining.`
            );
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
            <View style={cssStyle.skillItem}>
                <View style={cssStyle.headerRow}>
                    <View style={cssStyle.skillNameContainer}>
                        <ThemedText style={cssStyle.skillName} numberOfLines={1} ellipsizeMode="tail">
                            {item.name}
                        </ThemedText>
                        {item.description && (
                            <ThemedText style={cssStyle.skillDescription} numberOfLines={1} ellipsizeMode="tail">
                                {item.description}
                            </ThemedText>
                        )}
                    </View>
                    <View style={cssStyle.levelContainer}>
                        <TouchableOpacity
                            style={[cssStyle.levelButton, cssStyle.dangerButton]}
                            onPress={() => handleLevelChange(item, false)}
                            disabled={item.level <= 1}
                        >
                            <ThemedText style={cssStyle.smallButtonText}>-</ThemedText>
                        </TouchableOpacity>
                        <View style={cssStyle.levelDisplay}>
                            <ThemedText style={cssStyle.valueText}>{item.level}</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={[cssStyle.levelButton, cssStyle.successButton]}
                            onPress={() => handleLevelChange(item, true)}
                            disabled={item.level >= 10}
                        >
                            <ThemedText style={cssStyle.smallButtonText}>+</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[cssStyle.compactButton, cssStyle.dangerButton]}
                            onPress={() => handleDeleteSkill(item)}
                        >
                            <FontAwesome name="trash" size={14} color="#F44336" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <ListManager<Skill>
                title="Skills"
                description={`${skills.length} skill${skills.length !== 1 ? "s" : ""} • ${totalSkillPoints} BP spent`}
                data={skills}
                renderItem={renderSkillItem}
                keyExtractor={(item) => item.id}
                onAddPress={() => setAddModalVisible(true)}
                addButtonText="Add Skill"
                emptyStateText="No skills added yet. Add your first skill!"
            />

            {/* Add Skill Modal */}
            <Modal animationType="slide" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
                <View style={cssStyle.modalOverlay}>
                    <View style={cssStyle.modalView}>
                        <View style={cssStyle.modalHeader}>
                            <ThemedText style={cssStyle.modalTitle}>Add New Skill</ThemedText>
                            {isOnline ? (
                                <ThemedText style={cssStyle.onlineIndicator}>Online</ThemedText>
                            ) : (
                                <ThemedText style={cssStyle.offlineIndicator}>Offline</ThemedText>
                            )}
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Skill Name</ThemedText>
                            <View style={cssStyle.inputContainer}>
                                <TextInput
                                    style={cssStyle.input}
                                    value={newSkillName}
                                    onChangeText={setNewSkillName}
                                    placeholder="Enter skill name"
                                    placeholderTextColor="#999"
                                />
                                {loadingSuggestions && <ActivityIndicator size="small" color="#007AFF" style={cssStyle.inputIndicator} />}
                            </View>

                            {isOnline && showSuggestions && suggestions.length > 0 && (
                                <View style={cssStyle.suggestionsContainer}>
                                    <ThemedText style={cssStyle.suggestionsTitle}>Suggestions ({suggestions.length}):</ThemedText>
                                    <ScrollView style={cssStyle.suggestionsScrollView} showsVerticalScrollIndicator={true}>
                                        {suggestions.map((suggestion, index) => (
                                            <TouchableOpacity key={index} style={cssStyle.suggestionItem} onPress={() => selectSuggestion(suggestion.skill)}>
                                                <ThemedText>{suggestion.skill}</ThemedText>
                                                <ThemedText style={cssStyle.smallText}>{Math.round(suggestion.similarity * 100)}% match</ThemedText>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Description (Optional)</ThemedText>
                            <TextInput
                                style={[cssStyle.input, cssStyle.textArea]}
                                value={newSkillDescription}
                                onChangeText={setNewSkillDescription}
                                placeholder="Enter skill description"
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={cssStyle.costInfoContainer}>
                            <ThemedText>Cost: {calculateSkillCost(1)} BP</ThemedText>
                        </View>

                        <View style={cssStyle.modalButtons}>
                            <TouchableOpacity
                                style={[cssStyle.secondaryButton]}
                                onPress={() => {
                                    setNewSkillName("");
                                    setNewSkillDescription("");
                                    setAddModalVisible(false);
                                    setSuggestions([]);
                                    setShowSuggestions(false);
                                }}
                            >
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[cssStyle.actionButton]}
                                onPress={handleAddCustomSkill}
                                disabled={!newSkillName.trim() || base.buildPointsRemaining < 1}
                            >
                                <ThemedText style={cssStyle.buttonText}>Add Skill</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
