import { getResponsiveStyles } from "@/app/styles/responsive";
import { initializeOpenAI } from "@/components/ai/compareEmbedding";
import { ThemedText } from "@/components/ThemedText";
import { initializeSupabase } from "@/services/supabase";
import { RootState } from "@/store/rootReducer";
import {
    loadSettingsFromStorage,
    loadSettingsFromStorageAsync,
    saveSettingsToStorage,
    setOpenaiApiKey,
    setSupabaseServiceKey,
    setSupabaseUrl,
} from "@/store/slices/settingsSlice";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Modal, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.settings);
    const styles = getResponsiveStyles();

    const [supabaseUrl, setLocalSupabaseUrl] = useState(settings.supabaseUrl);
    const [supabaseKey, setLocalSupabaseKey] = useState(settings.supabaseServiceKey);
    const [openaiKey, setLocalOpenaiKey] = useState(settings.openaiApiKey);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Load settings from AsyncStorage on mount
        loadSettingsFromStorageAsync().then((savedSettings) => {
            if (savedSettings) {
                dispatch(loadSettingsFromStorage(savedSettings));
                setLocalSupabaseUrl(savedSettings.supabaseUrl || "");
                setLocalSupabaseKey(savedSettings.supabaseServiceKey || "");
                setLocalOpenaiKey(savedSettings.openaiApiKey || "");

                // Initialize services if settings exist
                if (savedSettings.supabaseUrl && savedSettings.supabaseServiceKey) {
                    initializeSupabase(savedSettings.supabaseUrl, savedSettings.supabaseServiceKey);
                }
                if (savedSettings.openaiApiKey) {
                    initializeOpenAI(savedSettings.openaiApiKey);
                }
            }
            setIsLoading(false);
        });
    }, [dispatch]);

    const handleSave = async () => {
        setIsSaving(true);

        try {
            // Update Redux store
            dispatch(setSupabaseUrl(supabaseUrl));
            dispatch(setSupabaseServiceKey(supabaseKey));
            dispatch(setOpenaiApiKey(openaiKey));

            // Save to AsyncStorage
            await saveSettingsToStorage({
                supabaseUrl,
                supabaseServiceKey: supabaseKey,
                openaiApiKey: openaiKey,
            });

            // Initialize services with new settings
            if (supabaseUrl && supabaseKey) {
                initializeSupabase(supabaseUrl, supabaseKey);
            }
            if (openaiKey) {
                initializeOpenAI(openaiKey);
            }

            Alert.alert("Success", "Settings saved successfully!");
            onClose();
        } catch (error) {
            Alert.alert("Error", "Failed to save settings");
            console.error("Failed to save settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalView, { maxHeight: "80%" }]}>
                    {isLoading ? (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size="large" />
                        </View>
                    ) : (
                        <>
                            <View style={styles.modalHeader}>
                                <ThemedText type="subtitle" style={styles.modalTitle}>
                                    API Configuration
                                </ThemedText>
                                <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                                    <ThemedText>✕</ThemedText>
                                </TouchableOpacity>
                            </View>

                            <ScrollView>
                                <View style={styles.inputContainer}>
                                    <ThemedText style={styles.label}>Supabase URL</ThemedText>
                                    <TextInput
                                        style={[styles.input, { color: "#fff", backgroundColor: "#333" }]}
                                        value={supabaseUrl}
                                        onChangeText={setLocalSupabaseUrl}
                                        placeholder="https://your-project.supabase.co"
                                        placeholderTextColor="#666"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <ThemedText style={styles.label}>Supabase Service Key</ThemedText>
                                    <TextInput
                                        style={[styles.input, { color: "#fff", backgroundColor: "#333" }]}
                                        value={supabaseKey}
                                        onChangeText={setLocalSupabaseKey}
                                        placeholder="Your service key"
                                        placeholderTextColor="#666"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <ThemedText style={styles.label}>OpenAI API Key (Optional)</ThemedText>
                                    <TextInput
                                        style={[styles.input, { color: "#fff", backgroundColor: "#333" }]}
                                        value={openaiKey}
                                        onChangeText={setLocalOpenaiKey}
                                        placeholder="sk-..."
                                        placeholderTextColor="#666"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>

                                {settings.isConfigured && (
                                    <ThemedText style={[styles.hint, { color: "green", textAlign: "center", marginTop: 10 }]}>✓ Supabase configured</ThemedText>
                                )}
                            </ScrollView>

                            <View style={styles.modalFooter}>
                                <Button title={isSaving ? "Saving..." : "Save Settings"} onPress={handleSave} disabled={isSaving} />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}
