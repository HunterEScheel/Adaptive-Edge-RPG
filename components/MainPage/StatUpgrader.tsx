import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
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
        <Pressable style={[styles.compactButton, { backgroundColor: statColor }]} onPress={openModal} accessibilityLabel={`Upgrade max ${statName}`}>
          <IconSymbol name={icon} size={16} color="#FFFFFF" />
          <ThemedText style={styles.compactButtonText}>+</ThemedText>
        </Pressable>

        {renderModal()}
      </>
    );
  }

  return renderModal();

  function renderModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleClose}>
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <View style={styles.centeredView}>
            <Pressable>
              <ThemedView style={styles.modalView}>
                <ThemedText style={styles.modalTitle}>Upgrade Max {statName}</ThemedText>

                <View style={styles.upgradeInfoContainer}>
                  <ThemedText style={styles.upgradeInfoText}>
                    Adjust your maximum {statName.toLowerCase()}. Each point costs {costPerPoint} BP. You'll get a refund when decreasing the value.
                  </ThemedText>
                </View>

                <View style={styles.buttonRow}>
                  <Pressable style={[styles.button, styles.cancelButton]} onPress={handleClose}>
                    <ThemedText>Cancel</ThemedText>
                  </Pressable>

                  <View style={styles.upgradeControls}>
                    <View style={styles.divider} />

                    <View style={styles.adjustRow}>
                      <View style={styles.decrementButtons}>
                        <Pressable style={[styles.quickButton, styles.decrementButton]} onPress={() => handleAdjust(-5)} disabled={currentValue <= 10}>
                          <ThemedText style={styles.buttonText}>-5</ThemedText>
                        </Pressable>
                        <Pressable style={[styles.quickButton, styles.decrementButton]} onPress={() => handleAdjust(-1)} disabled={currentValue <= 10}>
                          <ThemedText style={styles.buttonText}>-1</ThemedText>
                        </Pressable>
                      </View>

                      <View style={styles.currentValueContainer}>
                        <ThemedText style={styles.statLabel}>Max {statName}</ThemedText>
                        <ThemedText style={styles.currentValue}>{currentValue}</ThemedText>
                      </View>

                      <View style={styles.incrementButtons}>
                        <Pressable style={[styles.quickButton, styles.incrementButton]} onPress={() => handleAdjust(1)} disabled={character.base.buildPointsRemaining < costPerPoint}>
                          <ThemedText style={styles.buttonText}>+1</ThemedText>
                        </Pressable>
                        <Pressable style={[styles.quickButton, styles.incrementButton]} onPress={() => handleAdjust(5)} disabled={character.base.buildPointsRemaining < costPerPoint * 5}>
                          <ThemedText style={styles.buttonText}>+5</ThemedText>
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

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  availableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 16,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  costLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  costValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 16,
  },
  adjustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  decrementButtons: {
    flexDirection: "row",
    gap: 8,
  },
  incrementButtons: {
    flexDirection: "row",
    gap: 8,
  },
  currentValueContainer: {
    alignItems: "center",
    minWidth: 80,
  },
  currentValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  upgradeControls: {
    width: "100%",
    padding: 16,
  },

  quickButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 48,
  },
  quickButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  costText: {
    color: "white",
    opacity: 0.8,
    fontSize: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  compactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  compactButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    maxWidth: 400,
    borderRadius: 12,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    padding: 8,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  statInfoContainer: {
    width: "100%",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
  statInfoText: {
    fontSize: 16,
    marginVertical: 3,
  },
  upgradeInfoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  upgradeInfoText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 16,
    gap: 8,
  },

  cancelButton: {
    backgroundColor: "#666",
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 5,
  },
  incrementButton: {
    backgroundColor: "#4CAF50",
  },
  decrementButton: {
    backgroundColor: "#e74c3c",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});
