import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { DELETE_PRESET, FETCH_PRESETS, SAVE_PRESET, LOAD_PRESET } from "@/store/actions";
import { RootState } from "@/store/rootReducer";
import { Character } from "@/store/slices/characterSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import VersatileInput from "../Input";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

const CharacterPresetManager = () => {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const presets = useSelector((state: RootState) => state.presets);

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<Character | null>(null);

    // Save form state
    const [presetName, setPresetName] = useState("");
    const [presetDescription, setPresetDescription] = useState("");
    const [presetTags, setPresetTags] = useState("");

    // Load presets on component mount
    useEffect(() => {
        dispatch({ type: FETCH_PRESETS });
    }, [dispatch]);

    // Save current character as a preset
    const handleSavePreset = () => {
        const tags = presetTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);

        dispatch({ type: SAVE_PRESET, payload: character });

        setShowSaveModal(false);
        resetForm();
    };

    // Load a character preset
    const handleLoadPreset = (selection: Character) => {
        dispatch({ type: LOAD_PRESET, payload: selection.base.id });
        setShowLoadModal(false);
    };

    // Delete a preset
    const handleDeletePreset = (preset: Character) => {
        dispatch({ type: DELETE_PRESET, payload: preset });
    };

    // Reset form fields
    const resetForm = () => {
        setPresetName("");
        setPresetDescription("");
        setPresetTags("");
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    // Render preset item in list
    const renderPresetItem = ({ item }: { item: Character }) => (
        <View style={cssStyle.card}>
            <TouchableOpacity
                style={{ flex: 1, padding: 12 }}
                onPress={() => {
                    setSelectedPreset(item);
                    setShowLoadModal(true);
                }}
            >
                <View style={cssStyle.row}>
                    <ThemedText style={cssStyle.title}>{item.base.name}</ThemedText>
                </View>

                <ThemedText style={cssStyle.subtitle} numberOfLines={2}></ThemedText>

                <View style={{ marginVertical: 8 }}>
                    <ThemedText style={cssStyle.bodyText}>
                        {item.base.name} ({item.base.buildPointsSpent} BP)
                    </ThemedText>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleDeletePreset(item)}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <ThemedView style={cssStyle.container}>
            <View style={cssStyle.headerRow}>
                <ThemedText style={cssStyle.title}>Character Presets</ThemedText>
                <TouchableOpacity style={cssStyle.primaryButton} onPress={() => setShowSaveModal(true)}>
                    <ThemedText style={cssStyle.buttonText}>Save Current Character</ThemedText>
                </TouchableOpacity>
            </View>

            {presets.length > 0 ? (
                <FlatList
                    data={presets}
                    renderItem={renderPresetItem}
                    keyExtractor={(item) => item.base.id.toString()}
                    contentContainerStyle={{ paddingBottom: 16 }}
                />
            ) : (
                <View style={cssStyle.emptyState}>
                    <Ionicons name="save-outline" size={50} />
                    <ThemedText style={cssStyle.emptyStateText}>No character presets yet</ThemedText>
                    <ThemedText style={cssStyle.subtitle}>Save your current character to create your first preset</ThemedText>
                </View>
            )}

            {/* Save Modal */}
            <Modal animationType="slide" transparent={true} visible={showSaveModal} onRequestClose={() => setShowSaveModal(false)}>
                <View style={cssStyle.modalOverlay}>
                    <ThemedView style={cssStyle.modalView}>
                        <View style={cssStyle.modalHeader}>
                            <ThemedText style={cssStyle.modalTitle}>Save Character Preset</ThemedText>
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Preset Name</ThemedText>
                            <VersatileInput type="string" value={presetName} onChangeText={setPresetName} placeholder="Enter preset name" />
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Description</ThemedText>
                            <TextInput
                                style={cssStyle.textArea}
                                value={presetDescription}
                                onChangeText={setPresetDescription}
                                placeholder="Enter description (optional)"
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.label}>Tags</ThemedText>
                            <VersatileInput type="string" value={presetTags} onChangeText={setPresetTags} placeholder="Enter tags separated by commas" />
                        </View>

                        <View style={cssStyle.modalButtons}>
                            <TouchableOpacity style={cssStyle.secondaryButton} onPress={() => setShowSaveModal(false)}>
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={cssStyle.primaryButton} onPress={handleSavePreset}>
                                <ThemedText style={cssStyle.buttonText}>Save Preset</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>
                </View>
            </Modal>

            {/* Load Modal */}
            <Modal animationType="slide" transparent={true} visible={showLoadModal} onRequestClose={() => setShowLoadModal(false)}>
                <View style={cssStyle.modalOverlay}>
                    <ThemedView style={cssStyle.modalView}>
                        {selectedPreset && (
                            <>
                                <View style={cssStyle.modalHeader}>
                                    <ThemedText style={cssStyle.modalTitle}>Load Character Preset</ThemedText>
                                </View>

                                <View style={{ marginVertical: 12 }}>
                                    <ThemedText style={cssStyle.title}>{selectedPreset.base.name}</ThemedText>
                                    <ThemedText style={cssStyle.subtitle}>Build Points Spent: {selectedPreset.base.buildPointsSpent}</ThemedText>
                                </View>

                                <ThemedText style={cssStyle.bodyText}>
                                    Loading this preset will replace your current character. This action cannot be undone.
                                </ThemedText>

                                <View style={cssStyle.modalButtons}>
                                    <TouchableOpacity style={cssStyle.secondaryButton} onPress={() => setShowLoadModal(false)}>
                                        <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={cssStyle.primaryButton} onPress={() => handleLoadPreset(selectedPreset)}>
                                        <ThemedText style={cssStyle.buttonText}>Load Character</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </ThemedView>
                </View>
            </Modal>
        </ThemedView>
    );
};

export default CharacterPresetManager;
