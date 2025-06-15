import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import CharacterPresetManager from "./CharacterPresetManager";
import { cssStyle } from "@/app/styles/phone";

interface PresetManagerButtonProps {
    compact?: boolean;
}

/**
 * A button component that opens the Character Preset Manager in a modal
 */
export function PresetManagerButton({ compact = false }: PresetManagerButtonProps) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <TouchableOpacity style={[cssStyle.primaryButton, compact ? cssStyle.centered : null]} onPress={() => setModalVisible(true)}>
                {compact ? (
                    <Ionicons name="save-outline" size={20} color="#fff" />
                ) : (
                    <>
                        <Ionicons name="save-outline" size={20} color="#fff" style={cssStyle.buttonText} />
                        <ThemedText style={cssStyle.buttonText}>Character Presets</ThemedText>
                    </>
                )}
            </TouchableOpacity>

            {/* Full-screen modal for the preset manager */}
            <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={cssStyle.container}>
                    <View style={cssStyle.headerRow}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={cssStyle.centered}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                        <ThemedText style={cssStyle.modalTitle}>Character Presets</ThemedText>
                    </View>

                    {/* Include the full CharacterPresetManager component */}
                    <CharacterPresetManager />
                </View>
            </Modal>
        </>
    );
}
