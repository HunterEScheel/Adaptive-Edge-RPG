import { RootState } from "@/store/rootReducer";
import { updateField, updateMultipleFields } from "@/store/slices/baseSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface StatAdjusterProps {
  statName: string;
  fieldName: string;
  icon?: string;
  minValue?: number;
  maxValue?: number;
  showBy5?: boolean;
  compact?: boolean;
}

export function StatAdjuster({ statName, fieldName, icon, minValue = 0, maxValue = 999, showBy5 = false, compact = false }: StatAdjusterProps) {
  // Check if there are any equipped items affecting this stat
  const base = useSelector((state: RootState) => state.character.base);
  const inventory = useSelector((state: RootState) => state.character.inventory);
  const equipment = inventory.equipment || [];
  const equippedItemsAffectingStat = equipment.filter((item) => item.equipped && item.statEffected && item.statEffected.toString().toLowerCase().includes(fieldName.toLowerCase()));
  const hasEquipmentBonus = equippedItemsAffectingStat.length > 0;
  const equipmentBonus = equippedItemsAffectingStat.reduce((total, item) => total + item.statModifier, 0);

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [newValue, setNewValue] = useState("");

  // Get the current value from the base state
  const currentValue = base[fieldName as keyof typeof base] as number;

  const handleSave = () => {
    const parsedValue = parseInt(newValue);
    if (!isNaN(parsedValue)) {
      // Ensure the value is within bounds
      const boundedValue = Math.max(minValue, Math.min(maxValue, parsedValue));

      // Calculate the change amount
      const changeAmount = boundedValue - currentValue;

      // Use the increment handler to apply the change with BP calculations
      handleIncrement(changeAmount);
    }
    setModalVisible(false);
    setNewValue("");
  };

  const handleIncrement = (amount: number) => {
    // Handle movement in 5ft increments
    let adjustedAmount = amount;
    if (fieldName === "movement") {
      // Ensure movement changes in 5ft increments
      adjustedAmount = amount * 5;
    }

    // Calculate the new value within bounds
    const oldValue = currentValue;
    const newVal = Math.max(minValue, Math.min(maxValue, currentValue + adjustedAmount));

    // If no change, exit early
    if (newVal === oldValue) return;

    // Special handling for stats that cost build points
    if (fieldName === "energy" || fieldName === "hitPoints" || fieldName === "str" || fieldName === "dex" || fieldName === "con" || fieldName === "int" || fieldName === "wis" || fieldName === "cha") {
      const actualChange = newVal - oldValue;
      let buildPointCost = 0;

      // Calculate build point cost
      if (fieldName === "energy") {
        // 2 BP per Energy point
        buildPointCost = actualChange * 2;
      } else if (fieldName === "hitPoints") {
        // 2 BP per 3 HP (rounded up)
        buildPointCost = Math.ceil((actualChange * 2) / 3);
      } else if (["str", "dex", "con", "int", "wis", "cha"].includes(fieldName)) {
        // 50 BP per ability score point
        buildPointCost = actualChange * 50;
      }

      // Only allow the change if there are enough build points or if reducing the stat
      if (buildPointCost <= 0 || base.buildPointsRemaining >= buildPointCost) {
        // Update both the stat and build points
        const newBuildPoints = Math.max(0, base.buildPointsRemaining - buildPointCost);
        // Also update buildPointsSpent (increase when spending, decrease when refunding)
        const newBuildPointsSpent = Math.max(0, base.buildPointsSpent + buildPointCost);

        // Create updates array with stat and build points
        const updates = [
          { field: fieldName as keyof typeof base, value: newVal },
          { field: "buildPointsRemaining" as keyof typeof base, value: newBuildPoints },
          { field: "buildPointsSpent" as keyof typeof base, value: newBuildPointsSpent },
        ];

        // If changing energy, also update maxEnergy if needed
        if (fieldName === "energy" && newVal > base.maxEnergy) {
          updates.push({ field: "maxEnergy" as keyof typeof base, value: newVal });
        }
        // If changing hitPoints, also update maxHitPoints if needed
        else if (fieldName === "hitPoints" && newVal > base.maxHitPoints) {
          updates.push({ field: "maxHitPoints" as keyof typeof base, value: newVal });
        }

        dispatch(updateMultipleFields(updates));
      } else {
        // Not enough build points, show alert or feedback
        alert(`Not enough build points! Need ${buildPointCost} but have ${base.buildPointsRemaining}`);
      }
    } else {
      // For stats that don't cost build points, just update the stat directly
      dispatch(updateField({ field: fieldName as keyof typeof base, value: newVal }));
    }
  };

  return (
    <>
      <Pressable style={[styles.statContainer, compact ? styles.compactContainer : null]} onPress={() => setModalVisible(true)}>
        {icon ? <ThemedText style={[styles.statIcon, compact ? styles.compactIcon : null]}>{icon}</ThemedText> : null}
        <View style={styles.valueContainer}>
          <ThemedText style={[styles.statValue, compact ? styles.compactValue : null]}>{currentValue}</ThemedText>
          {hasEquipmentBonus && (
            <View style={styles.bonusIndicator}>
              <FontAwesome name="shield" size={compact ? 8 : 10} color="#4CAF50" />
              <ThemedText style={styles.bonusText}>+{equipmentBonus}</ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={[styles.statName, compact ? styles.compactName : null]}>{statName}</ThemedText>
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText style={styles.modalTitle}>Adjust {statName}</ThemedText>

            <View style={styles.quickAdjustRow}>
              {fieldName === "movement" ? (
                // For speed, show buttons that increment by 1 (which will be multiplied by 5 internally)
                <>
                  <Pressable style={[styles.quickButton, styles.decrementButton]} onPress={() => handleIncrement(-1)}>
                    <ThemedText style={styles.quickButtonText}>-5</ThemedText>
                  </Pressable>
                  <Pressable style={[styles.quickButton, styles.incrementButton]} onPress={() => handleIncrement(1)}>
                    <ThemedText style={styles.quickButtonText}>+5</ThemedText>
                  </Pressable>
                </>
              ) : (
                // For other stats, show the standard increment buttons
                <>
                  <Pressable style={[styles.quickButton, styles.decrementButton]} onPress={() => handleIncrement(-5)}>
                    <ThemedText style={styles.quickButtonText}>-5</ThemedText>
                  </Pressable>
                  <Pressable style={[styles.quickButton, styles.decrementButton]} onPress={() => handleIncrement(-1)}>
                    <ThemedText style={styles.quickButtonText}>-1</ThemedText>
                  </Pressable>
                  <Pressable style={[styles.quickButton, styles.incrementButton]} onPress={() => handleIncrement(1)}>
                    <ThemedText style={styles.quickButtonText}>+1</ThemedText>
                  </Pressable>
                  <Pressable style={[styles.quickButton, styles.incrementButton]} onPress={() => handleIncrement(5)}>
                    <ThemedText style={styles.quickButtonText}>+5</ThemedText>
                  </Pressable>
                </>
              )}
            </View>

            <View style={styles.inputRow}>
              <ThemedText style={styles.currentValue}>Current: {currentValue}</ThemedText>
              <TextInput
                style={styles.input}
                onChangeText={setNewValue}
                value={newValue}
                placeholder="New value"
                keyboardType="numeric"
                placeholderTextColor="#999"
                accessibilityLabel="Enter new value"
              />
            </View>

            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => setModalVisible(false)}>
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonSave]} onPress={handleSave}>
                <ThemedText style={styles.buttonText}>Save</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    padding: 8,
    minWidth: 70,
    height: 70,
  },
  compactIcon: {
    fontSize: 16,
  },
  compactValue: {
    fontSize: 18,
  },
  compactName: {
    fontSize: 12,
  },
  statContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bonusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderRadius: 2,
    paddingHorizontal: 2,
  },
  bonusText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "bold",
    marginLeft: 1,
  },
  statName: {
    fontSize: 14,
    marginTop: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  quickAdjustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  quickButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
  },
  decrementButton: {
    backgroundColor: "#F44336",
  },
  incrementButton: {
    backgroundColor: "#4CAF50",
  },
  quickButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  currentValue: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#ccc",
  },
  buttonSave: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
