import { RootState } from "@/store/rootReducer";
import { updateField } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";

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
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText style={styles.modalTitle}>Adjust Current {statName}</ThemedText>

            <View style={styles.statInfoContainer}>
              <ThemedText style={styles.statInfoText}>
                Current {statName}: {currentValue}/{maxValue}
              </ThemedText>
            </View>

            {/* Quick Adjustment Buttons */}
            <View style={styles.quickAdjustContainer}>
              <ThemedText style={styles.sectionTitle}>Quick Adjust</ThemedText>

              <View style={styles.quickAdjustRow}>
                <Pressable style={[styles.quickAdjustButton, styles.decrementButton]} onPress={() => handleAdjustValue(-10)}>
                  <ThemedText style={styles.quickAdjustButtonText}>-10</ThemedText>
                </Pressable>

                <Pressable style={[styles.quickAdjustButton, styles.decrementButton]} onPress={() => handleAdjustValue(-5)}>
                  <ThemedText style={styles.quickAdjustButtonText}>-5</ThemedText>
                </Pressable>

                <Pressable style={[styles.quickAdjustButton, styles.decrementButton]} onPress={() => handleAdjustValue(-1)}>
                  <ThemedText style={styles.quickAdjustButtonText}>-1</ThemedText>
                </Pressable>

                <Pressable style={[styles.quickAdjustButton, styles.incrementButton]} onPress={() => handleAdjustValue(1)}>
                  <ThemedText style={styles.quickAdjustButtonText}>+1</ThemedText>
                </Pressable>

                <Pressable style={[styles.quickAdjustButton, styles.incrementButton]} onPress={() => handleAdjustValue(5)}>
                  <ThemedText style={styles.quickAdjustButtonText}>+5</ThemedText>
                </Pressable>

                <Pressable style={[styles.quickAdjustButton, styles.incrementButton]} onPress={() => handleAdjustValue(10)}>
                  <ThemedText style={styles.quickAdjustButtonText}>+10</ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Manual Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.sectionTitle}>Set Exact Value</ThemedText>
              <TextInput style={styles.input} keyboardType="numeric" value={valueInput} onChangeText={setValueInput} placeholder={`Enter ${statName} value`} placeholderTextColor="#999" />
            </View>

            {/* Common Value Buttons */}
            <View style={styles.commonValuesContainer}>
              <ThemedText style={styles.sectionTitle}>Common Values</ThemedText>
              <View style={styles.commonValuesRow}>
                <Pressable
                  style={styles.commonValueButton}
                  onPress={() => {
                    setValueInput("0");
                  }}
                >
                  <ThemedText style={styles.commonValueText}>0</ThemedText>
                </Pressable>

                <Pressable
                  style={styles.commonValueButton}
                  onPress={() => {
                    setValueInput(Math.floor(maxValue / 2).toString());
                  }}
                >
                  <ThemedText style={styles.commonValueText}>Half</ThemedText>
                </Pressable>

                <Pressable
                  style={styles.commonValueButton}
                  onPress={() => {
                    setValueInput(maxValue.toString());
                  }}
                >
                  <ThemedText style={styles.commonValueText}>Max</ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <ThemedText>Cancel</ThemedText>
              </Pressable>

              <Pressable style={[styles.actionButton, styles.saveButton]} onPress={handleSetValue}>
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
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
        <Pressable style={styles.compactButton} onPress={openModal} accessibilityLabel={`Adjust current ${statName}`}>
          <IconSymbol name="pencil" size={12} color="#555" />
        </Pressable>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <Pressable style={[styles.button, { backgroundColor: statColor }]} onPress={openModal} accessibilityLabel={`Adjust current ${statName}`}>
        <View style={styles.buttonContent}>
          <IconSymbol name={icon} size={20} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>Adjust {statName}</ThemedText>
        </View>
      </Pressable>
      {renderModal()}
    </>
  );
}

const styles = StyleSheet.create({
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
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginLeft: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
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
  statInfoContainer: {
    width: "100%",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    alignItems: "center",
  },
  statInfoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  quickAdjustContainer: {
    width: "100%",
    marginBottom: 15,
  },
  quickAdjustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  quickAdjustButton: {
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
  },
  quickAdjustButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  decrementButton: {
    backgroundColor: "#e74c3c",
  },
  incrementButton: {
    backgroundColor: "#2ecc71",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  commonValuesContainer: {
    width: "100%",
    marginBottom: 20,
  },
  commonValuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commonValueButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  commonValueText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E5E5EA",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
