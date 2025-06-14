import { cssStyle } from "@/app/styles/phone";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";

// Cost per point of increase
const HP_COST = 2; // 2 build points per 1 HP
const ENERGY_COST = 3; // 3 build points per 1 Energy

type StatUpgraderProps = {
    statType: "hp" | "energy";
    compact?: boolean;
    visible?: boolean;
    onClose?: () => void;
};

export function StatUpgrader({ statType, compact = false, visible, onClose }: StatUpgraderProps) {
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);

    // Determine which stat we're working with
    const currentValue = statType === "hp" ? character.base.maxHitPoints : character.base.maxEnergy;
    const modalVisible = visible ?? false;
    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            setModalVisible(false);
        }
    };
    const [internalModalVisible, setModalVisible] = useState(false);

    const fieldName = statType === "hp" ? "maxHitPoints" : "maxEnergy";
    const costPerPoint = statType === "hp" ? HP_COST : ENERGY_COST;
    const statName = statType === "hp" ? "HP" : "Energy";
    const statColor = statType === "hp" ? "#e74c3c" : "#3498db";
    const icon = statType === "hp" ? "heart.fill" : "bolt.fill";

    const handleAdjust = (amount: number) => {
        // Calculate cost or refund
        const totalPoints = costPerPoint * Math.abs(amount);
        const newStatValue = currentValue + amount;

        // Don't allow reducing below initial value (10)
        if (newStatValue < 10) return;

        // For decrements, we get a refund. For increments, we need to check if we have enough points
        if (amount > 0 && character.base.buildPointsRemaining < totalPoints) {
            return;
        }

        // Calculate new build points (add for refund, subtract for cost)
        const newBuildPoints = character.base.buildPointsRemaining + (amount < 0 ? totalPoints : -totalPoints);

        // Need to use type assertion to ensure TypeScript recognizes these as valid keys of Character
        const updates: Array<{ field: keyof typeof character.base; value: any }> = [
            { field: fieldName as keyof typeof character.base, value: newStatValue },
            { field: "buildPointsRemaining", value: newBuildPoints },
        ];

        // If current HP/Energy is at max, also adjust the current value
        if (statType === "hp" && character.base.hitPoints === character.base.maxHitPoints) {
            updates.push({ field: "hitPoints", value: newStatValue });
        } else if (statType === "energy" && character.base.energy === character.base.maxEnergy) {
            updates.push({ field: "energy", value: newStatValue });
        }

        // Update character
        dispatch(updateMultipleFields(updates));
    };

    const openModal = () => {
        setModalVisible(true);
    };

    if (compact) {
        return (
            <>
                <Pressable style={[cssStyle.addButton, { backgroundColor: statColor }]} onPress={openModal} accessibilityLabel={`Upgrade max ${statName}`}>
                    <IconSymbol name={icon} size={16} color="#FFFFFF" />
                    <ThemedText style={cssStyle.addButtonText}>+</ThemedText>
                </Pressable>

                {renderModal()}
            </>
        );
    }

    return renderModal();

    function renderModal() {
        return (
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleClose}>
                <Pressable style={cssStyle.modalOverlay} onPress={handleClose}>
                    <View style={cssStyle.centeredView}>
                        <Pressable>
                            <ThemedView style={cssStyle.modalView}>
                                <ThemedText style={cssStyle.modalTitle}>Upgrade Max {statName}</ThemedText>

                                <View style={cssStyle.container}>
                                    <ThemedText style={cssStyle.skillDescription}>
                                        Adjust your maximum {statName.toLowerCase()}. Each point costs {costPerPoint} BP. You'll get a refund when decreasing
                                        the value.
                                    </ThemedText>
                                </View>

                                <View style={cssStyle.adjustmentRow}>
                                    <Pressable style={[cssStyle.cancelButton]} onPress={handleClose}>
                                        <ThemedText>Cancel</ThemedText>
                                    </Pressable>

                                    <View style={cssStyle.upgradeControls}>
                                        <View style={cssStyle.divider} />

                                        <View style={cssStyle.adjustRow}>
                                            <View style={cssStyle.decrementButtons}>
                                                <Pressable
                                                    style={[cssStyle.quickButton, cssStyle.decrementButton]}
                                                    onPress={() => handleAdjust(-5)}
                                                    disabled={currentValue <= 10}
                                                >
                                                    <ThemedText style={cssStyle.buttonText}>-5</ThemedText>
                                                </Pressable>
                                                <Pressable
                                                    style={[cssStyle.quickButton, cssStyle.decrementButton]}
                                                    onPress={() => handleAdjust(-1)}
                                                    disabled={currentValue <= 10}
                                                >
                                                    <ThemedText style={cssStyle.buttonText}>-1</ThemedText>
                                                </Pressable>
                                            </View>

                                            <View style={cssStyle.currentValueContainer}>
                                                <ThemedText style={cssStyle.statLabel}>Max {statName}</ThemedText>
                                                <ThemedText style={cssStyle.currentValue}>{currentValue}</ThemedText>
                                            </View>

                                            <View style={cssStyle.increaseButton}>
                                                <Pressable
                                                    style={[cssStyle.quickButton, cssStyle.increaseButton]}
                                                    onPress={() => handleAdjust(1)}
                                                    disabled={character.base.buildPointsRemaining < costPerPoint}
                                                >
                                                    <ThemedText style={cssStyle.buttonText}>+1</ThemedText>
                                                </Pressable>
                                                <Pressable
                                                    style={[cssStyle.quickButton, cssStyle.increaseButton]}
                                                    onPress={() => handleAdjust(5)}
                                                    disabled={character.base.buildPointsRemaining < costPerPoint * 5}
                                                >
                                                    <ThemedText style={cssStyle.buttonText}>+5</ThemedText>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ThemedView>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        );
    }
}
