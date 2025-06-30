import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "../ui/IconSymbol";

// Cost per point of increase
const HP_COST = 2; // 2 build points per 1 HP
const ENERGY_COST_RATIO = 2 / 3; // 2 build points per 3 Energy (0.667 BP per EP)

type StatUpgraderProps = {
    statType: "hp" | "energy";
    compact?: boolean;
    visible?: boolean;
    onClose?: () => void;
};

export function StatUpgrader({ statType, compact = false, visible, onClose }: StatUpgraderProps) {
    const cssStyle = useResponsiveStyles();
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
    const statName = statType === "hp" ? "HP" : "Energy";
    const statColor = statType === "hp" ? "#e74c3c" : "#3498db";
    const icon = statType === "hp" ? "heart.fill" : "bolt.fill";

    const handleAdjust = (amount: number) => {
        const newStatValue = currentValue + amount;

        // Don't allow reducing below initial value (10)
        if (newStatValue < 10) return;

        // Calculate cost or refund based on stat type
        let totalPoints: number;
        if (statType === "hp") {
            totalPoints = HP_COST * Math.abs(amount);
        } else {
            // For energy: 2 BP per 3 EP
            totalPoints = Math.ceil(Math.abs(amount) * ENERGY_COST_RATIO);
        }

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
                <Pressable style={[cssStyle.primaryButton, { backgroundColor: statColor }]} onPress={openModal} accessibilityLabel={`Upgrade max ${statName}`}>
                    <IconSymbol name={icon} size={16} color="#FFFFFF" />
                    <ThemedText style={cssStyle.buttonText}>+</ThemedText>
                </Pressable>

                {renderModal()}
            </>
        );
    }

    return renderModal();

    function renderModal() {
        const smallIncrement = statType === "hp" ? 1 : 3;
        const largeIncrement = statType === "hp" ? 5 : 15;
        const smallCost = statType === "hp" ? HP_COST : 2;
        const largeCost = statType === "hp" ? HP_COST * 5 : 10;

        return (
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleClose}>
                <Pressable style={cssStyle.modalOverlay} onPress={handleClose}>
                    <View style={cssStyle.modalView} onStartShouldSetResponder={() => true}>
                        {/* Header */}
                        <View style={cssStyle.modalHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <IconSymbol name={icon} size={24} color={statColor} style={{ marginRight: 8 }} />
                                <ThemedText style={cssStyle.modalTitle}>Upgrade Max {statName}</ThemedText>
                            </View>
                            <Pressable onPress={handleClose} style={{ padding: 8 }}>
                                <IconSymbol name="xmark" size={20} color="#666" />
                            </Pressable>
                        </View>

                        {/* Current Stats Display */}
                        <View style={[cssStyle.card, { backgroundColor: statColor + "15", borderColor: statColor, borderWidth: 1, marginBottom: 16 }]}>
                            <View style={{ alignItems: 'center' }}>
                                <ThemedText style={[cssStyle.label, { marginBottom: 4 }]}>Current Maximum</ThemedText>
                                <ThemedText style={[cssStyle.largeValue, { color: statColor, fontSize: 48 }]}>{currentValue}</ThemedText>
                                <ThemedText style={[cssStyle.label, { marginTop: 4 }]}>
                                    {statType === "hp" ? "Hit Points" : "Energy Points"}
                                </ThemedText>
                            </View>
                        </View>

                        {/* Build Points Info */}
                        <View style={[cssStyle.sectionContainer, { backgroundColor: '#f0f0f0', padding: 12, marginBottom: 16 }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <ThemedText style={cssStyle.label}>Available Build Points</ThemedText>
                                    <ThemedText style={[cssStyle.subtitle, { color: '#2196F3' }]}>{character.base.buildPointsRemaining} BP</ThemedText>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <ThemedText style={cssStyle.label}>Cost Rate</ThemedText>
                                    <ThemedText style={cssStyle.subtitle}>
                                        {statType === "hp" ? `${HP_COST} BP per HP` : "2 BP per 3 EP"}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>

                        {/* Adjustment Buttons */}
                        <View>
                            <ThemedText style={[cssStyle.label, { textAlign: 'center', marginBottom: 12 }]}>Adjust Value</ThemedText>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                {/* Decrease Buttons */}
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <Pressable
                                        style={[
                                            cssStyle.secondaryButton,
                                            { minWidth: 60, opacity: currentValue <= (statType === "hp" ? 14 : 24) ? 0.5 : 1 }
                                        ]}
                                        onPress={() => handleAdjust(-largeIncrement)}
                                        disabled={currentValue <= (statType === "hp" ? 14 : 24)}
                                    >
                                        <ThemedText style={cssStyle.buttonText}>-{largeIncrement}</ThemedText>
                                        <ThemedText style={[cssStyle.smallText, { fontSize: 10 }]}>+{largeCost} BP</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[
                                            cssStyle.secondaryButton,
                                            { minWidth: 60, opacity: currentValue <= (statType === "hp" ? 10 : 12) ? 0.5 : 1 }
                                        ]}
                                        onPress={() => handleAdjust(-smallIncrement)}
                                        disabled={currentValue <= (statType === "hp" ? 10 : 12)}
                                    >
                                        <ThemedText style={cssStyle.buttonText}>-{smallIncrement}</ThemedText>
                                        <ThemedText style={[cssStyle.smallText, { fontSize: 10 }]}>+{smallCost} BP</ThemedText>
                                    </Pressable>
                                </View>

                                {/* Increase Buttons */}
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <Pressable
                                        style={[
                                            cssStyle.primaryButton,
                                            { 
                                                minWidth: 60, 
                                                backgroundColor: character.base.buildPointsRemaining < smallCost ? '#ccc' : statColor,
                                                opacity: character.base.buildPointsRemaining < smallCost ? 0.5 : 1
                                            }
                                        ]}
                                        onPress={() => handleAdjust(smallIncrement)}
                                        disabled={character.base.buildPointsRemaining < smallCost}
                                    >
                                        <ThemedText style={[cssStyle.buttonText, { color: 'white' }]}>+{smallIncrement}</ThemedText>
                                        <ThemedText style={[cssStyle.smallText, { fontSize: 10, color: 'white' }]}>-{smallCost} BP</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[
                                            cssStyle.primaryButton,
                                            { 
                                                minWidth: 60, 
                                                backgroundColor: character.base.buildPointsRemaining < largeCost ? '#ccc' : statColor,
                                                opacity: character.base.buildPointsRemaining < largeCost ? 0.5 : 1
                                            }
                                        ]}
                                        onPress={() => handleAdjust(largeIncrement)}
                                        disabled={character.base.buildPointsRemaining < largeCost}
                                    >
                                        <ThemedText style={[cssStyle.buttonText, { color: 'white' }]}>+{largeIncrement}</ThemedText>
                                        <ThemedText style={[cssStyle.smallText, { fontSize: 10, color: 'white' }]}>-{largeCost} BP</ThemedText>
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                            <Pressable 
                                style={[cssStyle.secondaryButton, { flex: 1 }]} 
                                onPress={handleClose}
                            >
                                <ThemedText style={cssStyle.buttonText}>Done</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        );
    }
}
