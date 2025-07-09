import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { AddArmor } from "./AddItemForm/AddArmor";
import { AddShield } from "./AddItemForm/AddShield";

interface ArmorModalProps {
    visible: boolean;
    onClose: () => void;
}

export function ArmorModal({ visible, onClose }: ArmorModalProps) {
    const cssStyle = useResponsiveStyles();

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={cssStyle.modalOverlay}>
                <View style={cssStyle.modalView}>
                    <ScrollView style={cssStyle.modalContent}>
                        {/* Add/Change Armor Section */}
                        <AddArmor />

                        {/* Add/Change Shield Section */}
                        <View style={{ marginTop: 20 }}>
                            <AddShield />
                        </View>
                    </ScrollView>

                    <View style={cssStyle.modalButtons}>
                        <Pressable style={cssStyle.primaryButton} onPress={onClose}>
                            <ThemedText style={cssStyle.buttonText}>Close</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
