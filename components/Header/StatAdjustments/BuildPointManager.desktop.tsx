import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";
import { IconSymbol } from "../../ui/IconSymbol";

export function BuildPointManagerDesktop() {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const base = useSelector((state: RootState) => state.character.base);
    const [modalVisible, setModalVisible] = useState(false);
    const [pointsInput, setPointsInput] = useState("");

    const openModal = () => {
        setPointsInput(base.buildPointsRemaining.toString());
        setModalVisible(true);
    };

    const handleSetPoints = () => {
        const newPoints = parseInt(pointsInput);
        if (!isNaN(newPoints) && newPoints >= 0) {
            const pointsDifference = newPoints - base.buildPointsRemaining;
            const newBuildPointsSpent = Math.max(0, base.buildPointsSpent - pointsDifference);

            dispatch(
                updateMultipleFields([
                    { field: "buildPointsRemaining", value: newPoints },
                    { field: "buildPointsSpent", value: newBuildPointsSpent },
                ])
            );
            setModalVisible(false);
        } else {
            Alert.alert("Error", "Please enter a valid number of build points.");
        }
    };

    const handleDirectUpdate = (amount: number) => {
        const newPoints = base.buildPointsRemaining + amount;
        if (newPoints >= 0) {
            const newBuildPointsSpent = Math.max(0, base.buildPointsSpent - amount);

            dispatch(
                updateMultipleFields([
                    { field: "buildPointsRemaining", value: newPoints },
                    { field: "buildPointsSpent", value: newBuildPointsSpent },
                ])
            );
        } else {
            Alert.alert("Error", "Build points cannot be negative.");
        }
    };

    return (
        <ThemedView style={[cssStyle.container, { marginVertical: 0 }]}>
            <>
                <Pressable
                    style={[
                        cssStyle.centered,
                        {
                            backgroundColor: "rgba(0, 122, 255, 0.1)",
                            borderWidth: 1,
                            borderColor: "rgba(0, 122, 255, 0.3)",
                            borderRadius: 5,
                            padding: 5,
                        },
                    ]}
                    onPress={openModal}
                    accessibilityLabel="Manage build points"
                >
                    <View style={cssStyle.row}>
                        <ThemedText style={[cssStyle.valueText, { color: "#007AFF" }]}>{base.buildPointsRemaining}</ThemedText>
                        <ThemedText style={[cssStyle.smallText, { color: "#007AFF", fontWeight: "bold" }]}>BP</ThemedText>
                    </View>
                </Pressable>

                {/* Build Points Modal */}
                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View style={cssStyle.modalOverlay}>
                        <View style={cssStyle.modalView}>
                            <View style={cssStyle.modalHeader}>
                                <ThemedText style={cssStyle.modalTitle}>Manage Build Points</ThemedText>
                            </View>
                            <View style={cssStyle.modalContent}>
                                {/* Current BP Display with editable input */}
                                <View style={[cssStyle.row, cssStyle.card, { backgroundColor: "rgba(0, 122, 255, 0.1)" }]}>
                                    <Pressable
                                        style={[cssStyle.centered, cssStyle.secondaryButton]}
                                        onPress={() => setPointsInput((parseInt(pointsInput) - 1).toString())}
                                    >
                                        <IconSymbol name="minus" size={16} color="#FFFFFF" />
                                    </Pressable>

                                    <TextInput
                                        style={[
                                            cssStyle.largeValue,
                                            {
                                                color: "#007AFF",
                                                padding: 30,
                                                textAlign: "center",
                                                backgroundColor: "transparent",
                                                borderWidth: 0,
                                            },
                                        ]}
                                        value={pointsInput}
                                        onChangeText={setPointsInput}
                                        keyboardType="numeric"
                                        selectTextOnFocus
                                    />

                                    <Pressable
                                        style={[cssStyle.centered, cssStyle.primaryButton]}
                                        onPress={() => setPointsInput((parseInt(pointsInput) + 1).toString())}
                                    >
                                        <IconSymbol name="plus" size={16} color="#FFFFFF" />
                                    </Pressable>
                                </View>

                                {/* Quick Adjustment Buttons */}
                                <View style={cssStyle.adjustmentRow}>
                                    <Pressable style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleDirectUpdate(-10)}>
                                        <ThemedText style={cssStyle.smallButtonText}>-10</ThemedText>
                                    </Pressable>
                                    <Pressable style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleDirectUpdate(-5)}>
                                        <ThemedText style={cssStyle.smallButtonText}>-5</ThemedText>
                                    </Pressable>
                                    <Pressable style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleDirectUpdate(-1)}>
                                        <ThemedText style={cssStyle.smallButtonText}>-1</ThemedText>
                                    </Pressable>
                                    <Pressable style={[cssStyle.centered, cssStyle.primaryButton]} onPress={() => handleDirectUpdate(1)}>
                                        <ThemedText style={cssStyle.smallButtonText}>+1</ThemedText>
                                    </Pressable>
                                    <Pressable style={[cssStyle.centered, cssStyle.primaryButton]} onPress={() => handleDirectUpdate(5)}>
                                        <ThemedText style={cssStyle.smallButtonText}>+5</ThemedText>
                                    </Pressable>
                                    <Pressable style={[cssStyle.centered, cssStyle.primaryButton]} onPress={() => handleDirectUpdate(10)}>
                                        <ThemedText style={cssStyle.smallButtonText}>+10</ThemedText>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View style={cssStyle.modalButtons}>
                                <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                                    <ThemedText style={cssStyle.secondaryButtonText}>Cancel</ThemedText>
                                </Pressable>
                                <Pressable style={cssStyle.primaryButton} onPress={handleSetPoints}>
                                    <ThemedText style={cssStyle.buttonText}>Save</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        </ThemedView>
    );
}
