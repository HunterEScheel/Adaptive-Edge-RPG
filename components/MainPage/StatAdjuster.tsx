import { RootState } from "@/store/rootReducer";
import { updateField, updateMultipleFields } from "@/store/slices/baseSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { cssStyle } from "@/app/styles/phone";

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

  if (compact) {
    return (
      <>
        <Pressable
          style={[cssStyle.statContainer, { minWidth: 70, height: 70, padding: 8 }]}
          onPress={() => setModalVisible(true)}
          accessibilityLabel={`Adjust ${statName}`}
        >
          {icon && <FontAwesome name={icon as any} style={{ fontSize: 16, marginBottom: 4 }} />}
          <View style={cssStyle.row}>
            <ThemedText style={[cssStyle.valueText, { fontSize: 18 }]}>{currentValue}</ThemedText>
            {hasEquipmentBonus && (
              <View style={cssStyle.bonusIndicator}>
                <FontAwesome name="plus" size={6} color="#4CAF50" />
                <ThemedText style={cssStyle.bonusText}>{equipmentBonus}</ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={[cssStyle.smallText, { fontSize: 12, marginTop: 4 }]}>{statName}</ThemedText>
        </Pressable>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <Pressable style={cssStyle.statContainer} onPress={() => setModalVisible(true)} accessibilityLabel={`Adjust ${statName}`}>
        {icon && <FontAwesome name={icon as any} style={{ fontSize: 20, marginBottom: 4 }} />}
        <View style={cssStyle.row}>
          <ThemedText style={cssStyle.valueText}>{currentValue}</ThemedText>
          {hasEquipmentBonus && (
            <View style={cssStyle.bonusIndicator}>
              <FontAwesome name="plus" size={8} color="#4CAF50" />
              <ThemedText style={cssStyle.bonusText}>{equipmentBonus}</ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={[cssStyle.label, { fontSize: 14, marginTop: 4 }]}>{statName}</ThemedText>
      </Pressable>
      {renderModal()}
    </>
  );

  function renderModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={cssStyle.centeredView}>
          <ThemedView style={cssStyle.modalView}>
            <ThemedText style={cssStyle.title}>Adjust {statName}</ThemedText>

            <View style={cssStyle.adjustmentRow}>
              {showBy5 && (
                <>
                  <Pressable style={[cssStyle.compactButton, cssStyle.dangerButton]} onPress={() => handleIncrement(-5)}>
                    <ThemedText style={cssStyle.smallButtonText}>-5</ThemedText>
                  </Pressable>
                </>
              )}
              <Pressable style={[cssStyle.compactButton, cssStyle.dangerButton]} onPress={() => handleIncrement(-1)}>
                <ThemedText style={cssStyle.smallButtonText}>-1</ThemedText>
              </Pressable>
              <Pressable style={[cssStyle.compactButton, cssStyle.successButton]} onPress={() => handleIncrement(1)}>
                <ThemedText style={cssStyle.smallButtonText}>+1</ThemedText>
              </Pressable>
              {showBy5 && (
                <>
                  <Pressable style={[cssStyle.compactButton, cssStyle.successButton]} onPress={() => handleIncrement(5)}>
                    <ThemedText style={cssStyle.smallButtonText}>+5</ThemedText>
                  </Pressable>
                </>
              )}
            </View>

            <View style={cssStyle.formRow}>
              <ThemedText style={cssStyle.valueText}>Current: {currentValue}</ThemedText>
              <TextInput
                style={cssStyle.input}
                onChangeText={setNewValue}
                value={newValue}
                placeholder="New value"
                keyboardType="numeric"
                placeholderTextColor="#999"
                accessibilityLabel="Enter new value"
              />
            </View>

            <View style={cssStyle.modalButtons}>
              <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={cssStyle.actionButton} onPress={handleSave}>
                <ThemedText style={cssStyle.buttonText}>Save</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    );
  }
}
