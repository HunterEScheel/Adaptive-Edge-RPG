import { cssStyle } from "@/app/styles/phone";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";

type BuildPointManagerProps = {
    compact?: boolean;
};

export function BuildPointManager({ compact = false }: BuildPointManagerProps) {
    const dispatch = useDispatch();
    const base = useSelector((state: RootState) => state.character.base);
    const buildPoints = base.buildPointsRemaining;
    const [modalVisible, setModalVisible] = useState(false);
    const [pointsInput, setPointsInput] = useState("");

    const openModal = () => {
        setPointsInput(buildPoints.toString());
        setModalVisible(true);
    };

    const handleIncrement = () => {
        const newPoints = buildPoints + 1;
        setPointsInput(newPoints.toString());
    };

    const handleDecrement = () => {
        if (buildPoints > 0) {
            const newPoints = buildPoints - 1;
            setPointsInput(newPoints.toString());
        } else {
            Alert.alert("Error", "Build points cannot be negative.");
        }
    };

    const handleSetPoints = () => {
        const newPoints = parseInt(pointsInput);
        if (!isNaN(newPoints) && newPoints >= 0) {
            // Calculate the difference to update buildPointsSpent accordingly
            const pointsDifference = newPoints - buildPoints;

            // If adding points (pointsDifference > 0), decrease buildPointsSpent
            // If removing points (pointsDifference < 0), increase buildPointsSpent
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
        const newPoints = buildPoints + amount;
        if (newPoints >= 0) {
            // If adding points (amount > 0), decrease buildPointsSpent
            // If removing points (amount < 0), increase buildPointsSpent
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
        <ThemedView style={[cssStyle.container, compact && { marginVertical: 0 }]}>
            {compact ? (
                <>
                    <Pressable
                        style={[cssStyle.centered, { backgroundColor: "rgba(0, 122, 255, 0.1)", borderWidth: 1, borderColor: "rgba(0, 122, 255, 0.3)" }]}
                        onPress={openModal}
                        accessibilityLabel="Manage build points"
                    >
                        <View style={cssStyle.row}>
                            <ThemedText style={[cssStyle.valueText, { color: "#007AFF" }]}>{buildPoints}</ThemedText>
                            <ThemedText style={[cssStyle.smallText, { color: "#007AFF", fontWeight: "bold" }]}>BP</ThemedText>
                        </View>
                    </Pressable>

                    {/* Build Points Modal */}
                    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                        <View style={cssStyle.centered}>
                            <ThemedView style={cssStyle.modalView}>
                                <ThemedText style={cssStyle.title}>Manage Build Points</ThemedText>

                                {/* Current BP Display */}
                                <View style={[cssStyle.row, cssStyle.card, { backgroundColor: "rgba(0, 122, 255, 0.1)" }]}>
                                    <Pressable
                                        style={[cssStyle.centered, cssStyle.secondaryButton]}
                                        onPress={() => setPointsInput((parseInt(pointsInput) - 1).toString())}
                                    >
                                        <IconSymbol name="minus" size={16} color="#FFFFFF" />
                                    </Pressable>

                                    <ThemedText style={[cssStyle.largeValue, { color: "#007AFF", padding: 30 }]}>{pointsInput}</ThemedText>

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

                                {/* Manual Input */}
                                <View style={cssStyle.inputContainer}>
                                    <ThemedText style={cssStyle.label}>Set Exact Value</ThemedText>
                                    <TextInput
                                        style={cssStyle.input}
                                        onChangeText={setPointsInput}
                                        value={pointsInput}
                                        placeholder="Enter build points"
                                        keyboardType="numeric"
                                        placeholderTextColor="#999"
                                        accessibilityLabel="Enter build points value"
                                    />
                                </View>

                                {/* Action Buttons */}
                                <View style={cssStyle.modalButtons}>
                                    <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                                        <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                                    </Pressable>
                                    <Pressable style={cssStyle.primaryButton} onPress={handleSetPoints}>
                                        <ThemedText style={cssStyle.buttonText}>Save</ThemedText>
                                    </Pressable>
                                </View>
                            </ThemedView>
                        </View>
                    </Modal>
                </>
            ) : (
                <>
                    <Pressable style={[cssStyle.card, { backgroundColor: "rgba(0, 0, 0, 0.05)" }]} onPress={openModal} accessibilityLabel="Manage build points">
                        <View style={cssStyle.centered}>
                            <ThemedText style={cssStyle.largeValue}>{buildPoints}</ThemedText>
                            <ThemedText style={cssStyle.label}>Build Points</ThemedText>
                        </View>
                        <View style={cssStyle.row}>
                            <Pressable style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={handleDecrement}>
                                <IconSymbol name="minus" size={16} color="#FFFFFF" />
                            </Pressable>
                            <Pressable style={[cssStyle.centered, cssStyle.primaryButton]} onPress={handleIncrement}>
                                <IconSymbol name="plus" size={16} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    </Pressable>

                    {/* Build Points Modal */}
                    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                        <View style={cssStyle.centered}>
                            <ThemedView style={cssStyle.modalView}>
                                <ThemedText style={cssStyle.title}>Manage Build Points</ThemedText>

                                {/* Current BP Display */}
                                <View style={[cssStyle.row, cssStyle.card, { backgroundColor: "rgba(0, 122, 255, 0.1)" }]}>
                                    <Pressable
                                        style={[cssStyle.centered, cssStyle.secondaryButton]}
                                        onPress={() => setPointsInput((parseInt(pointsInput) - 1).toString())}
                                    >
                                        <IconSymbol name="minus" size={16} color="#FFFFFF" />
                                    </Pressable>

                                    <ThemedText style={[cssStyle.largeValue, { color: "#007AFF", padding: 30 }]}>{pointsInput}</ThemedText>

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

                                {/* Manual Input */}
                                <View style={cssStyle.inputContainer}>
                                    <ThemedText style={cssStyle.label}>Set Exact Value</ThemedText>
                                    <TextInput
                                        style={cssStyle.input}
                                        onChangeText={setPointsInput}
                                        value={pointsInput}
                                        placeholder="Enter build points"
                                        keyboardType="numeric"
                                        placeholderTextColor="#999"
                                        accessibilityLabel="Enter build points value"
                                    />
                                </View>

                                {/* Action Buttons */}
                                <View style={cssStyle.modalButtons}>
                                    <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                                        <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                                    </Pressable>
                                    <Pressable style={cssStyle.primaryButton} onPress={handleSetPoints}>
                                        <ThemedText style={cssStyle.buttonText}>Save</ThemedText>
                                    </Pressable>
                                </View>
                            </ThemedView>
                        </View>
                    </Modal>
                </>
            )}
        </ThemedView>
    );
}
