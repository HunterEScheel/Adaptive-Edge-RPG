import { RootState } from "@/store/rootReducer";
import { updateField } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";
import { cssStyle } from "@/app/styles/phone";

type CurrentStatAdjusterProps = {
  statType: "hp" | "energy";
  compact?: boolean;
};

export function CurrentStatAdjuster({ statType, compact = false }: CurrentStatAdjusterProps) {
  const dispatch = useDispatch();
  const base = useSelector((state: RootState) => state.character.base);
  const [modalVisible, setModalVisible] = useState(false);
  const [valueInput, setValueInput] = useState("");

  // Determine which stat we're working with
  const currentValue = statType === "hp" ? base.hitPoints : base.energy;
  const maxValue = statType === "hp" ? base.maxHitPoints : base.maxEnergy;
  const fieldName = statType === "hp" ? "hitPoints" : "energy";
  const statName = statType === "hp" ? "HP" : "Energy";
  const statColor = statType === "hp" ? "#e74c3c" : "#3498db";
  const icon = statType === "hp" ? "heart.fill" : "bolt.fill";

  const openModal = () => {
    setValueInput(currentValue.toString());
    setModalVisible(true);
  };

  const handleSetValue = () => {
    const newValue = parseInt(valueInput);
    if (isNaN(newValue)) {
      Alert.alert("Invalid Input", "Please enter a valid number.");
      return;
    }

    // Ensure value doesn't exceed maximum
    const boundedValue = Math.min(maxValue, Math.max(0, newValue));

    dispatch(updateField({ field: fieldName, value: boundedValue }));
    setModalVisible(false);

    if (boundedValue !== newValue) {
      Alert.alert("Value Adjusted", `${statName} has been set to ${boundedValue} (maximum: ${maxValue}).`);
    }
  };

  const handleAdjustValue = (amount: number) => {
    const newValue = Math.min(maxValue, Math.max(0, currentValue + amount));
    dispatch(updateField({ field: fieldName, value: newValue }));
  };

  const renderModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={cssStyle.centeredView}>
          <ThemedView style={cssStyle.modalView}>
            <ThemedText style={cssStyle.title}>Adjust Current {statName}</ThemedText>

            <View style={cssStyle.container}>
              <ThemedText style={cssStyle.valueText}>
                Current {statName}: {currentValue}/{maxValue}
              </ThemedText>
            </View>

            {/* Quick Adjustment Buttons */}
            <View style={cssStyle.inputContainer}>
              <ThemedText style={cssStyle.subtitle}>Quick Adjust</ThemedText>

              <View style={cssStyle.adjustmentRow}>
                <Pressable style={[cssStyle.compactButton, cssStyle.dangerButton]} onPress={() => handleAdjustValue(-10)}>
                  <ThemedText style={cssStyle.smallButtonText}>-10</ThemedText>
                </Pressable>

                <Pressable style={[cssStyle.compactButton, cssStyle.dangerButton]} onPress={() => handleAdjustValue(-5)}>
                  <ThemedText style={cssStyle.smallButtonText}>-5</ThemedText>
                </Pressable>

                <Pressable style={[cssStyle.compactButton, cssStyle.dangerButton]} onPress={() => handleAdjustValue(-1)}>
                  <ThemedText style={cssStyle.smallButtonText}>-1</ThemedText>
                </Pressable>

                <Pressable style={[cssStyle.compactButton, cssStyle.successButton]} onPress={() => handleAdjustValue(1)}>
                  <ThemedText style={cssStyle.smallButtonText}>+1</ThemedText>
                </Pressable>

                <Pressable style={[cssStyle.compactButton, cssStyle.successButton]} onPress={() => handleAdjustValue(5)}>
                  <ThemedText style={cssStyle.smallButtonText}>+5</ThemedText>
                </Pressable>

                <Pressable style={[cssStyle.compactButton, cssStyle.successButton]} onPress={() => handleAdjustValue(10)}>
                  <ThemedText style={cssStyle.smallButtonText}>+10</ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Manual Input */}
            <View style={cssStyle.inputContainer}>
              <ThemedText style={cssStyle.subtitle}>Set Exact Value</ThemedText>
              <TextInput
                style={cssStyle.input}
                onChangeText={setValueInput}
                value={valueInput}
                placeholder={`Enter ${statName.toLowerCase()}`}
                keyboardType="numeric"
                placeholderTextColor="#999"
                accessibilityLabel={`Enter new ${statName} value`}
              />
            </View>

            {/* Common Values */}
            <View style={cssStyle.inputContainer}>
              <ThemedText style={cssStyle.subtitle}>Common Values</ThemedText>
              <View style={cssStyle.adjustmentRow}>
                <Pressable style={cssStyle.secondaryButton} onPress={() => setValueInput("0")}>
                  <ThemedText style={cssStyle.label}>0</ThemedText>
                </Pressable>
                <Pressable style={cssStyle.secondaryButton} onPress={() => setValueInput(Math.floor(maxValue / 2).toString())}>
                  <ThemedText style={cssStyle.label}>Half</ThemedText>
                </Pressable>
                <Pressable style={cssStyle.secondaryButton} onPress={() => setValueInput(maxValue.toString())}>
                  <ThemedText style={cssStyle.label}>Max</ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={cssStyle.modalButtons}>
              <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={cssStyle.actionButton} onPress={handleSetValue}>
                <ThemedText style={cssStyle.buttonText}>Save</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    );
  };

  if (compact) {
    return (
      <>
        <Pressable style={[cssStyle.compactButton, { backgroundColor: "#f0f0f0" }]} onPress={openModal} accessibilityLabel={`Adjust current ${statName}`}>
          <IconSymbol name="pencil" size={12} color="#555" />
        </Pressable>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <Pressable style={[cssStyle.primaryButton, { backgroundColor: statColor }]} onPress={openModal} accessibilityLabel={`Adjust current ${statName}`}>
        <View style={cssStyle.row}>
          <IconSymbol name={icon} size={20} color="#FFFFFF" />
          <ThemedText style={cssStyle.buttonText}>Adjust {statName}</ThemedText>
        </View>
      </Pressable>
      {renderModal()}
    </>
  );
}
