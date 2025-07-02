import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { findMatchingSkills } from "@/components/ai/compareEmbedding";
import { CompactListManager } from "@/components/Common/CompactListManager";
import { Skill, calculateSkillCost, calculateTotalSkillCost } from "@/constants/Skills";
import embeddingDatabase from "@/services/embeddingDatabase";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { addSkill, removeSkill, updateSkillLevel } from "@/store/slices/skillsSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ListManagerDesktop } from "../Common/ListManager.desktop";
import { ThemedText } from "../ThemedText";

// Simple ID generator function
const generateId = () => Math.random().toString(36).substring(2, 15);

export function SkillManager() {
    const cssStyle = useResponsiveStyles();
    const { isMobile } = useResponsive();
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
        setIsCheckingConnectivity(true);
        try {
            // Try multiple endpoints to ensure we're not blocked by firewalls
            const endpoints = [
                "https://api.github.com",
                "https://jsonplaceholder.typicode.com/posts/1",
                "https://httpbin.org/get",
                "https://www.google.com/favicon.ico",
            ];

            let connected = false;

            // Try each endpoint until one succeeds
            for (const endpoint of endpoints) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

                    const response = await fetch(endpoint, {
                        method: "GET",
                        signal: controller.signal,
                        cache: "no-cache",
                        mode: "no-cors", // Allow cross-origin requests
                    });

                    clearTimeout(timeoutId);

                    // For no-cors mode, we can't read the response but if fetch succeeds, we're online
                    connected = true;
                    break;
                } catch (err) {
                    continue;
                }
            }
            setIsOnline(connected);

            // Update offline mode in embedding database
            if (embeddingDatabase && typeof embeddingDatabase.setOfflineMode === "function") {
                await embeddingDatabase.setOfflineMode(!connected);
            }

            // Initialize the embedding database if online
            if (connected) {
                try {
                    await embeddingDatabase.syncFromCloud();
                } catch (error) {
                    console.error("Error syncing embeddings:", error);
                }
            }

            return connected;
        } catch (error) {
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
        if (!skillName.trim()) return;

        // Still try to get suggestions even if offline - the embedding database might have cached data
        if (!isOnline) {
        }

        try {
            setLoadingSuggestions(true);
            const matchingSkills = await findMatchingSkills(skillName, false);

            // Show all matches with at least 35% similarity
            setSuggestions(matchingSkills.filter((match: { skill: string; similarity: number }) => match.similarity > 0.35));
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
            if (newSkillName.trim().length > 2) {
                getSuggestions(newSkillName);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [newSkillName]);

    // Select a suggested skill
    const selectSuggestion = (suggestion: string) => {
        // Calculate cost for level 1
        const cost = calculateTotalSkillCost(1);

        // Check if enough build points are available
        if (base.buildPointsRemaining < cost) {
            Alert.alert("Not Enough Build Points", `You need ${cost} build points to add this skill. You have ${base.buildPointsRemaining} remaining.`);
            return;
        }

        // Create the new skill
        const newSkill: Skill = {
            id: generateId(),
            name: suggestion.trim(),
            description: newSkillDescription.trim() || "Skill from suggestion",
            level: 1,
        };

        // Add skill and update build points
        dispatch(addSkill(newSkill));
        dispatch(
            updateMultipleFields([
                { field: "buildPointsRemaining", value: base.buildPointsRemaining - cost },
                { field: "buildPointsSpent", value: base.buildPointsSpent + cost },
            ])
        );

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

        // For web compatibility, use a simple confirm dialog
        const confirmMessage = `Delete ${skill.name}? You will be refunded ${refundAmount} build points.`;

        if (typeof window !== "undefined" && window.confirm) {
            // Web environment
            if (window.confirm(confirmMessage)) {
                // Remove the skill and refund build points
                dispatch(removeSkill(skill.id));

                // Update build points (refund)
                dispatch(
                    updateMultipleFields([
                        { field: "buildPointsRemaining", value: base.buildPointsRemaining + refundAmount },
                        { field: "buildPointsSpent", value: base.buildPointsSpent - refundAmount },
                    ])
                );
            }
        } else {
            // Mobile environment
            Alert.alert("Delete Skill", confirmMessage, [
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
        }
    };

    // Mobile render function - compact style
    const renderSkillItemMobile = ({ item }: { item: Skill }) => {
        const nextLevelCost = item.level < 10 ? calculateSkillCost(item.level + 1) : null;

        return (
            <View style={[cssStyle.compactCard, { marginBottom: 8, padding: 12 }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Skill info */}
                    <View style={{ marginRight: 8 }}>
                        <ThemedText style={{ fontSize: 14, fontWeight: "600", color: "#f0f0f0" }} numberOfLines={1}>
                            {item.name}
                        </ThemedText>
                        {item.description && (
                            <ThemedText style={{ fontSize: 11, color: "#999", marginTop: 2 }} numberOfLines={1}>
                                {item.description}
                            </ThemedText>
                        )}
                    </View>

                    {/* Controls */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <TouchableOpacity
                            style={[
                                cssStyle.condensedButton,
                                cssStyle.secondaryColors,
                                { width: 28, height: 28, padding: 0 },
                                item.level <= 1 && cssStyle.disabledButton,
                            ]}
                            onPress={() => handleLevelChange(item, false)}
                            disabled={item.level <= 1}
                        >
                            <ThemedText style={{ fontSize: 14, color: "#fff" }}>-</ThemedText>
                        </TouchableOpacity>

                        <View style={{ minWidth: 20, alignItems: "center" }}>
                            <ThemedText style={{ fontSize: 16, fontWeight: "bold", color: "#f0f0f0" }}>{item.level}</ThemedText>
                        </View>

                        <TouchableOpacity
                            style={[
                                cssStyle.condensedButton,
                                cssStyle.primaryColors,
                                { width: 28, height: 28, padding: 0 },
                                item.level >= 10 && cssStyle.disabledButton,
                            ]}
                            onPress={() => handleLevelChange(item, true)}
                            disabled={item.level >= 10}
                        >
                            <ThemedText style={{ fontSize: 14, color: "#fff" }}>+</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[cssStyle.condensedButton, { width: 28, height: 28, padding: 0, backgroundColor: "#dc3545" }]}
                            onPress={() => handleDeleteSkill(item)}
                        >
                            <FontAwesome name="trash" size={12} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    // Desktop render function - full style
    const renderSkillItemDesktop = ({ item }: { item: Skill }) => {
        const nextLevelCost = item.level < 10 ? calculateSkillCost(item.level + 1) : null;

        return (
            <View style={cssStyle.skillItem}>
                <View style={cssStyle.headerRow}>
                    <View style={cssStyle.contentContainer}>
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
                            style={[cssStyle.centered, cssStyle.secondaryButton]}
                            onPress={() => handleLevelChange(item, false)}
                            disabled={item.level <= 1}
                        >
                            <ThemedText style={cssStyle.smallButtonText}>-</ThemedText>
                        </TouchableOpacity>
                        <View style={cssStyle.levelDisplay}>
                            <ThemedText style={cssStyle.valueText}>{item.level}</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={[cssStyle.centered, cssStyle.primaryButton]}
                            onPress={() => handleLevelChange(item, true)}
                            disabled={item.level >= 10}
                        >
                            <ThemedText style={cssStyle.smallButtonText}>+</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleDeleteSkill(item)}>
                            <FontAwesome name="trash" size={14} color="#F44336" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            {isMobile ? (
                <CompactListManager<Skill>
                    title={`Skills (${totalSkillPoints} BP)`}
                    data={skills}
                    renderItem={renderSkillItemMobile}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setAddModalVisible(true)}
                    addButtonText="Add"
                    emptyStateText="No skills added yet"
                />
            ) : (
                <ListManagerDesktop<Skill>
                    title="Skills"
                    description={`${skills.length} skill${skills.length !== 1 ? "s" : ""} • ${totalSkillPoints} BP spent`}
                    data={skills}
                    renderItem={renderSkillItemDesktop}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setAddModalVisible(true)}
                    addButtonText="Add Skill"
                    emptyStateText="No skills added yet. Add your first skill!"
                />
            )}

            {/* Add Skill Modal */}
            <Modal animationType="slide" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
                <View style={cssStyle.modalOverlay}>
                    <View style={cssStyle.modalView}>
                        <View style={cssStyle.modalHeader}>
                            <ThemedText style={cssStyle.modalTitle}>Add New Skill</ThemedText>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsOnline(!isOnline);
                                    if (embeddingDatabase && typeof embeddingDatabase.setOfflineMode === "function") {
                                        embeddingDatabase.setOfflineMode(isOnline);
                                    }
                                }}
                                style={{ padding: 4 }}
                            >
                                {isOnline ? (
                                    <View style={cssStyle.onlineIndicator}>
                                        <ThemedText>Online ⟳</ThemedText>
                                    </View>
                                ) : (
                                    <View style={cssStyle.offlineIndicator}>
                                        <ThemedText>Offline ⟳</ThemedText>
                                    </View>
                                )}
                            </TouchableOpacity>
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

                            {showSuggestions && suggestions.length > 0 && (
                                <View style={cssStyle.suggestionsContainer}>
                                    <ThemedText style={cssStyle.suggestionsTitle}>Suggestions ({suggestions.length}):</ThemedText>
                                    <FlatList
                                        data={suggestions}
                                        renderItem={(suggestion) => (
                                            <TouchableOpacity
                                                key={suggestion.index}
                                                style={cssStyle.suggestionItem}
                                                onPress={() => selectSuggestion(suggestion.item.skill)}
                                            >
                                                <ThemedText>{suggestion.item.skill}</ThemedText>
                                                <ThemedText style={cssStyle.smallText}>{Math.round(suggestion.item.similarity * 100)}% match</ThemedText>
                                            </TouchableOpacity>
                                        )}
                                        style={cssStyle.suggestionsScrollView}
                                        showsVerticalScrollIndicator={true}
                                    />
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
                                style={[cssStyle.primaryButton]}
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
