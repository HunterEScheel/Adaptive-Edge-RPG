import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { calculateTotalDamageReduction } from "@/components/Utility/CalculateTotals";
import { RootState } from "@/store/rootReducer";
import { removeArmor, removeShield } from "@/store/slices/inventorySlice";
import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AddArmor } from "./AddItemForm/AddArmor";
import { AddShield } from "./AddItemForm/AddShield";

interface ArmorModalProps {
    visible: boolean;
    onClose: () => void;
}

export function ArmorModal({ visible, onClose }: ArmorModalProps) {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const currentArmor = character.inventory?.armor;
    const totalDR = calculateTotalDamageReduction(character);

    const handleRemoveArmor = () => {
        dispatch(removeArmor());
    };

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
