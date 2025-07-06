import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateGold } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { Gp } from "../ui/Gp";

export function CompactGoldManager() {
    const cssStyle = useResponsiveStyles();
    const character = useSelector((state: RootState) => state.character);
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [adjustmentAmount, setAdjustmentAmount] = useState("");

    // Format gold with commas for thousands
    const formattedGold = character.inventory?.gold?.toLocaleString() || "0";

    const handleAdjustGold = (isAdd: boolean) => {
        const amount = parseInt(adjustmentAmount);
        if (isNaN(amount) || amount <= 0) return;

        const currentGold = character.inventory?.gold || 0;
        const newGold = isAdd ? currentGold + amount : Math.max(0, currentGold - amount);

        dispatch(updateGold(newGold));
        setAdjustmentAmount("");
        setModalVisible(false);
    };

    const handleQuickAdjust = (amount: number, isAdd: boolean) => {
        const currentGold = character.inventory?.gold || 0;
        const newGold = isAdd ? currentGold + amount : Math.max(0, currentGold - amount);
        dispatch(updateGold(newGold));
    };

    return (
        <>
            <Pressable
                style={[
                    cssStyle.row,
                    {
                        backgroundColor: "rgba(255, 215, 0, 0.1)",
                        padding: 12,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "space-between",
                    },
                ]}
                onPress={() => setModalVisible(true)}
            >
                <View style={[cssStyle.row, { alignItems: "center", gap: 8 }]}>
                    <Gp size={24} />
                    <ThemedText style={[cssStyle.subtitle, { fontSize: 18, marginBottom: 0 }]}>{formattedGold}</ThemedText>
                </View>
                <ThemedText style={[cssStyle.hint, { fontSize: 12 }]}>Tap to edit</ThemedText>
            </Pressable>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={cssStyle.modalOverlay}>
                    <View style={[cssStyle.modalView, { width: "95%", maxWidth: 350 }]}>
                        <View style={[cssStyle.modalHeader]}>
                            <ThemedText style={cssStyle.modalTitle}>Adjust Gold</ThemedText>
                            <Pressable style={{ justifyContent: "flex-end" }} onPress={() => setModalVisible(false)}>
                                <FontAwesome name="times" size={20} color="#666" />
                            </Pressable>
                        </View>

                        <View style={[cssStyle.row, { alignItems: "center", marginBottom: 16, gap: 8, paddingTop: 8 }]}>
                            <Gp size={32} />
                            <ThemedText style={[cssStyle.largeValue, { fontSize: 24 }]}>{formattedGold}</ThemedText>
                        </View>

                        {/* Quick adjustment buttons */}
                        <View style={[cssStyle.row, { justifyContent: "space-around", marginBottom: 16 }]}>
                            {[10, 50, 100].map((amount) => (
                                <View key={amount} style={{ alignItems: "center", gap: 4 }}>
                                    <Pressable
                                        style={[cssStyle.condensedButton, cssStyle.primaryButton, { minWidth: 40, height: 32 }]}
                                        onPress={() => handleQuickAdjust(amount, true)}
                                    >
                                        <ThemedText style={[cssStyle.buttonText, { fontSize: 12 }]}>+{amount}</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[cssStyle.condensedButton, cssStyle.secondaryButton, { minWidth: 40, height: 32 }]}
                                        onPress={() => handleQuickAdjust(amount, false)}
                                    >
                                        <ThemedText style={[cssStyle.buttonText, { fontSize: 12 }]}>-{amount}</ThemedText>
                                    </Pressable>
                                </View>
                            ))}
                        </View>

                        <View style={[cssStyle.row, { marginTop: 16, gap: 8 }]}>
                            <Pressable
                                style={[cssStyle.defaultButton, cssStyle.secondaryColors, {}]}
                                onPress={() => handleAdjustGold(false)}
                                disabled={!adjustmentAmount}
                            >
                                <ThemedText style={cssStyle.buttonText}>Subtract</ThemedText>
                            </Pressable>
                            {/* Custom amount input */}
                            <View style={{ top: -10 }}>
                                <ThemedText style={[cssStyle.label, { marginBottom: 8 }]}>Custom Amount</ThemedText>
                                <TextInput
                                    style={[cssStyle.input, { height: 40, width: 120 }]}
                                    keyboardType="numeric"
                                    value={adjustmentAmount}
                                    onChangeText={setAdjustmentAmount}
                                    placeholder="Enter amount"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <Pressable
                                style={[cssStyle.defaultButton, cssStyle.primaryColors, {}]}
                                onPress={() => handleAdjustGold(true)}
                                disabled={!adjustmentAmount}
                            >
                                <ThemedText style={cssStyle.buttonText}>Add</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
