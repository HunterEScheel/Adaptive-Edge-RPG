import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FETCH_PRESETS, LOAD_PRESET } from "@/store/actions";
import { BaseState } from "@/store/slices/baseSlice";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface Preset {
    id: string;
    name: string;
    description: string;
    tags: string[];
    buildPointsSpent: number;
    characterName?: string;
}

interface TemplateSelectorProps {
    onSelectTemplate: () => void;
    onBack: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, onBack }) => {
    const dispatch = useDispatch();
    const cssStyle = useResponsiveStyles();
    const [loading, setLoading] = useState(true);
    const [selectedPreset, setSelectedPreset] = useState<BaseState | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const presets = useSelector((state: any) => state.presets) || [];

    useEffect(() => {
        dispatch({ type: FETCH_PRESETS });
        setLoading(false);
    }, [dispatch]);

    const handleSelectPreset = (preset: BaseState) => {
        setSelectedPreset(preset);
        setShowConfirmModal(true);
    };

    const handleConfirmSelection = () => {
        if (selectedPreset) {
            dispatch({
                type: LOAD_PRESET,
                payload: selectedPreset.id,
            });
            setShowConfirmModal(false);
            onSelectTemplate();
        }
    };

    if (loading) {
        return (
            <View style={[cssStyle.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" />
                <ThemedText>Loading templates...</ThemedText>
            </View>
        );
    }

    return (
        <ThemedView style={cssStyle.container}>
            <ThemedText style={[cssStyle.headerText, { marginBottom: 20 }]}>Select a Character Template</ThemedText>

            {presets.length === 0 ? (
                <View style={{ padding: 20 }}>
                    <ThemedText style={{ textAlign: "center", marginBottom: 20 }}>
                        No templates available. Create a character from scratch or ask your GM for template files.
                    </ThemedText>
                </View>
            ) : (
                <FlatList
                    data={presets}
                    renderItem={(preset) => (
                        <Pressable
                            key={preset.item.id}
                            style={[
                                cssStyle.card,
                                {
                                    marginVertical: 8,
                                    marginHorizontal: 16,
                                    padding: 16,
                                    borderRadius: 8,
                                },
                            ]}
                            onPress={() => handleSelectPreset(preset.item)}
                        >
                            <ThemedText style={[cssStyle.sectionHeader, { marginBottom: 8 }]}>{preset.item.name}</ThemedText>
                            <ThemedText style={{ fontSize: 12 }}>Build Points: {preset.item.buildPointsSpent || 0}</ThemedText>
                        </Pressable>
                    )}
                />
            )}

            <View style={{ marginTop: 20, marginHorizontal: 16 }}>
                <TouchableOpacity style={[cssStyle.secondaryButton, { padding: 12 }]} onPress={onBack}>
                    <ThemedText style={{ textAlign: "center" }}>Back</ThemedText>
                </TouchableOpacity>
            </View>

            <Modal animationType="fade" transparent={true} visible={showConfirmModal} onRequestClose={() => setShowConfirmModal(false)}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <ThemedView
                        style={[
                            cssStyle.card,
                            {
                                padding: 20,
                                margin: 20,
                                borderRadius: 8,
                                maxWidth: 400,
                            },
                        ]}
                    >
                        <ThemedText style={[cssStyle.sectionHeader, { marginBottom: 16 }]}>Confirm Template Selection</ThemedText>
                        <ThemedText style={{ marginBottom: 20 }}>Are you sure you want to use the "{selectedPreset?.name}" template?</ThemedText>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <TouchableOpacity style={[cssStyle.secondaryButton, { marginHorizontal: 10 }]} onPress={() => setShowConfirmModal(false)}>
                                <ThemedText>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[cssStyle.primaryButton, { marginHorizontal: 10 }]} onPress={handleConfirmSelection}>
                                <ThemedText>Confirm</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </ThemedView>
    );
};
