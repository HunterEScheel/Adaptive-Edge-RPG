import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { setCharacter } from "@/store/slices/characterSlice";
import { setCharacterLoaded } from "@/store/characterAuthSlice";
import { FETCH_PRESETS, LOAD_PRESET } from "@/store/actions";

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
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    const presets = useSelector((state: any) => state.presets) || [];

    useEffect(() => {
        dispatch({ type: FETCH_PRESETS });
        setLoading(false);
    }, [dispatch]);

    const handleSelectPreset = (preset: Preset) => {
        setSelectedPreset(preset);
        setShowConfirmModal(true);
    };

    const handleConfirmSelection = () => {
        if (selectedPreset) {
            dispatch({ 
                type: LOAD_PRESET, 
                payload: { presetId: selectedPreset.id }
            });
            setShowConfirmModal(false);
            onSelectTemplate();
        }
    };

    const templatePresets = presets.filter((preset: Preset) => 
        preset.tags?.includes('template') || preset.tags?.includes('starter')
    );

    if (loading) {
        return (
            <View style={[cssStyle.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
                <ThemedText>Loading templates...</ThemedText>
            </View>
        );
    }

    return (
        <ThemedView style={cssStyle.container}>
            <ThemedText style={[cssStyle.h1, { marginBottom: 20 }]}>Select a Character Template</ThemedText>
            
            {templatePresets.length === 0 ? (
                <View style={{ padding: 20 }}>
                    <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>
                        No templates available. Create a character from scratch or ask your GM for template files.
                    </ThemedText>
                </View>
            ) : (
                <ScrollView style={{ flex: 1 }}>
                    {templatePresets.map((preset: Preset) => (
                        <TouchableOpacity
                            key={preset.id}
                            style={[
                                cssStyle.card,
                                { 
                                    marginVertical: 8, 
                                    marginHorizontal: 16,
                                    padding: 16,
                                    borderRadius: 8
                                }
                            ]}
                            onPress={() => handleSelectPreset(preset)}
                        >
                            <ThemedText style={[cssStyle.h3, { marginBottom: 8 }]}>
                                {preset.name}
                            </ThemedText>
                            {preset.characterName && (
                                <ThemedText style={{ marginBottom: 4 }}>
                                    Character: {preset.characterName}
                                </ThemedText>
                            )}
                            {preset.description && (
                                <ThemedText style={{ marginBottom: 8, fontStyle: 'italic' }}>
                                    {preset.description}
                                </ThemedText>
                            )}
                            <ThemedText style={{ fontSize: 12 }}>
                                Build Points: {preset.buildPointsSpent || 0}
                            </ThemedText>
                            {preset.tags && preset.tags.length > 0 && (
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                                    {preset.tags.map((tag, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: '#333',
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 4,
                                                marginRight: 4,
                                                marginBottom: 4
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 12 }}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <View style={{ marginTop: 20, marginHorizontal: 16 }}>
                <TouchableOpacity
                    style={[cssStyle.button, { padding: 12 }]}
                    onPress={onBack}
                >
                    <ThemedText style={{ textAlign: 'center' }}>Back</ThemedText>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={showConfirmModal}
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={{ 
                    flex: 1, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <ThemedView style={[
                        cssStyle.card,
                        { 
                            padding: 20, 
                            margin: 20,
                            borderRadius: 8,
                            maxWidth: 400
                        }
                    ]}>
                        <ThemedText style={[cssStyle.h2, { marginBottom: 16 }]}>
                            Confirm Template Selection
                        </ThemedText>
                        <ThemedText style={{ marginBottom: 20 }}>
                            Are you sure you want to use the "{selectedPreset?.name}" template?
                        </ThemedText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity
                                style={[cssStyle.button, { marginHorizontal: 10 }]}
                                onPress={() => setShowConfirmModal(false)}
                            >
                                <ThemedText>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[cssStyle.button, cssStyle.buttonPrimary, { marginHorizontal: 10 }]}
                                onPress={handleConfirmSelection}
                            >
                                <ThemedText>Confirm</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </ThemedView>
    );
};