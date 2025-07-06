import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function BuildPointManagerMobile() {
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
        const newPoints = parseInt(pointsInput) + amount;
        if (newPoints >= 0) {
            setPointsInput(newPoints.toString());
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
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            minWidth: 50,
                        },
                    ]}
                    onPress={openModal}
                    accessibilityLabel="Manage build points"
                >
                    <View style={[cssStyle.row, { alignItems: "baseline" }]}>
                        <ThemedText style={[cssStyle.valueText, { color: "#007AFF", fontSize: 14, fontWeight: "600" }]}>{base.buildPointsRemaining}</ThemedText>
                        <ThemedText style={[cssStyle.smallText, { color: "#007AFF", fontWeight: "600", fontSize: 11, marginLeft: 3 }]}>BP</ThemedText>
                    </View>
                </Pressable>

                {/* Build Points Modal */}
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View style={cssStyle.modalOverlay}>
                        <View style={[cssStyle.modalView, { width: "85%", maxWidth: 320, paddingHorizontal: 20, paddingVertical: 24 }]}>
                            <View style={[cssStyle.modalHeader, { marginBottom: 20 }]}>
                                <ThemedText style={[cssStyle.modalTitle, { fontSize: 20, fontWeight: "600" }]}>Build Points</ThemedText>
                            </View>

                            {/* Main Input Section */}
                            <View style={{ alignItems: "center", marginBottom: 24 }}>
                                <TextInput
                                    style={[
                                        {
                                            color: "#007AFF",
                                            fontSize: 48,
                                            fontWeight: "700",
                                            textAlign: "center",
                                            backgroundColor: "rgba(0, 122, 255, 0.08)",
                                            borderRadius: 12,
                                            paddingHorizontal: 32,
                                            paddingVertical: 16,
                                            borderWidth: 2,
                                            borderColor: "rgba(0, 122, 255, 0.2)",
                                        },
                                    ]}
                                    value={pointsInput}
                                    onChangeText={setPointsInput}
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                />
                                <ThemedText style={{ color: "#666", fontSize: 12, marginTop: 8 }}>Tap to edit directly</ThemedText>
                            </View>

                            {/* Quick Adjustment Grid */}
                            <View style={{ marginBottom: 24 }}>
                                <ThemedText
                                    style={{
                                        fontSize: 12,
                                        color: "#888",
                                        marginBottom: 12,
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Quick Adjust
                                </ThemedText>
                                <View style={{ flexDirection: "row", gap: 8 }}>
                                    <Pressable
                                        style={[
                                            cssStyle.centered,
                                            {
                                                backgroundColor: "#dc3545",
                                                borderRadius: 8,
                                                paddingVertical: 14,
                                            },
                                        ]}
                                        onPress={() => handleDirectUpdate(-10)}
                                    >
                                        <ThemedText style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>-10</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[
                                            cssStyle.centered,
                                            {
                                                backgroundColor: "#fd7e14",
                                                borderRadius: 8,
                                                paddingVertical: 14,
                                            },
                                        ]}
                                        onPress={() => handleDirectUpdate(-1)}
                                    >
                                        <ThemedText style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>-1</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[
                                            cssStyle.centered,
                                            {
                                                backgroundColor: "#20c997",
                                                borderRadius: 8,
                                                paddingVertical: 14,
                                            },
                                        ]}
                                        onPress={() => handleDirectUpdate(1)}
                                    >
                                        <ThemedText style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>+1</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[
                                            cssStyle.centered,
                                            {
                                                backgroundColor: "#28a745",
                                                borderRadius: 8,
                                                paddingVertical: 14,
                                            },
                                        ]}
                                        onPress={() => handleDirectUpdate(10)}
                                    >
                                        <ThemedText style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>+10</ThemedText>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View style={{ flexDirection: "row", gap: 12 }}>
                                <Pressable
                                    style={[
                                        cssStyle.centered,
                                        {
                                            backgroundColor: "#f8f9fa",
                                            borderRadius: 8,
                                            paddingVertical: 14,
                                            borderWidth: 1,
                                            borderColor: "#dee2e6",
                                        },
                                    ]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <ThemedText style={{ color: "#495057", fontSize: 16, fontWeight: "500" }}>Cancel</ThemedText>
                                </Pressable>
                                <Pressable
                                    style={[
                                        cssStyle.centered,
                                        {
                                            flex: 2,
                                            backgroundColor: "#007AFF",
                                            borderRadius: 8,
                                            paddingVertical: 14,
                                        },
                                    ]}
                                    onPress={handleSetPoints}
                                >
                                    <ThemedText style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Save Changes</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        </ThemedView>
    );
}
