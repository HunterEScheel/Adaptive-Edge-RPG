import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
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
    <ThemedView style={[styles.container, compact && styles.compactContainer]}>
      {compact ? (
        <>
          <Pressable style={styles.compactPointsDisplay} onPress={openModal} accessibilityLabel="Manage build points">
            <View style={styles.compactPointsContent}>
              <ThemedText style={styles.compactPointsValue}>{buildPoints}</ThemedText>
              <ThemedText style={styles.compactPointsLabel}>BP</ThemedText>
            </View>
          </Pressable>

          {/* Build Points Modal */}
          <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.centeredView}>
              <ThemedView style={styles.modalView}>
                <ThemedText style={styles.modalTitle}>Manage Build Points</ThemedText>

                {/* Current BP Display */}
                <View style={styles.currentBPContainer}>
                  <Pressable style={[styles.quickAdjustButton, styles.decrementButton]} onPress={() => setPointsInput((parseInt(pointsInput) - 1).toString())}>
                    <IconSymbol name="minus" size={16} color="#FFFFFF" />
                  </Pressable>
                  <TextInput style={styles.currentBPValue} keyboardType="numeric" value={pointsInput} onChangeText={setPointsInput} placeholder="Enter build points" placeholderTextColor="#999" />{" "}
                  <Pressable style={[styles.quickAdjustButton, styles.incrementButton]} onPress={() => setPointsInput((parseInt(pointsInput) + 1).toString())}>
                    <IconSymbol name="plus" size={16} color="#FFFFFF" />
                  </Pressable>
                </View>

                {/* Quick Adjust Buttons */}
                <View style={styles.quickAdjustContainer}></View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                  <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                    <ThemedText>Cancel</ThemedText>
                  </Pressable>

                  <Pressable style={[styles.actionButton, styles.saveButton]} onPress={handleSetPoints}>
                    <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                  </Pressable>
                </View>
              </ThemedView>
            </View>
          </Modal>
        </>
      ) : (
        <>
          <Pressable style={styles.pointsDisplay} onPress={openModal} accessibilityLabel="Manage build points">
            <View style={styles.pointsContent}>
              <ThemedText style={styles.pointsValue}>{buildPoints}</ThemedText>
              <ThemedText style={styles.pointsLabel}>Build Points</ThemedText>
            </View>
          </Pressable>

          {/* Build Points Modal */}
          <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.centeredView}>
              <ThemedView style={styles.modalView}>
                <ThemedText style={styles.modalTitle}>Manage Build Points</ThemedText>

                {/* Current BP Display */}
                <View style={styles.currentBPContainer}>
                  <ThemedText style={styles.currentBPLabel}>Current BP:</ThemedText>
                  <ThemedText style={styles.currentBPValue}>{buildPoints}</ThemedText>
                </View>

                {/* Quick Adjust Buttons */}
                <View style={styles.quickAdjustContainer}>
                  <Pressable style={[styles.quickAdjustButton, styles.decrementButton]} onPress={() => handleDirectUpdate(-1)}>
                    <IconSymbol name="minus" size={20} color="#FFFFFF" />
                  </Pressable>

                  <Pressable style={[styles.quickAdjustButton, styles.incrementButton]} onPress={() => handleDirectUpdate(1)}>
                    <IconSymbol name="plus" size={20} color="#FFFFFF" />
                  </Pressable>
                </View>

                {/* Manual Input */}
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Set BP Value:</ThemedText>
                  <TextInput style={styles.input} keyboardType="numeric" value={pointsInput} onChangeText={setPointsInput} placeholder="Enter build points" placeholderTextColor="#999" />
                </View>

                {/* Increment/Decrement for Input */}
                <View style={styles.adjustButtonsContainer}>
                  <Pressable style={[styles.adjustButton, styles.decrementButton]} onPress={handleDecrement}>
                    <ThemedText style={styles.adjustButtonText}>-</ThemedText>
                  </Pressable>

                  <Pressable style={[styles.adjustButton, styles.incrementButton]} onPress={handleIncrement}>
                    <ThemedText style={styles.adjustButtonText}>+</ThemedText>
                  </Pressable>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                  <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                    <ThemedText>Cancel</ThemedText>
                  </Pressable>

                  <Pressable style={[styles.actionButton, styles.saveButton]} onPress={handleSetPoints}>
                    <ThemedText style={styles.saveButtonText}>Save</ThemedText>
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  incrementButton: {
    backgroundColor: "#34C759",
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
  compactContainer: {
    marginVertical: 0,
  },
  pointsDisplay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "space-between",
  },
  compactPointsDisplay: {
    padding: 5,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
  },
  pointsContent: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  compactPointsContent: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  compactPointsValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  pointsLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  compactPointsLabel: {
    fontSize: 12,
    marginTop: 0,
    fontWeight: "bold",
    color: "#007AFF",
  },
  buttonContainer: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  compactButtonContainer: {
    width: 22,
    height: 22,
    marginHorizontal: 3,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  compactButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  compactButtonText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  subtractButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
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
    textAlign: "center",
  },
  currentBPContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
  currentBPLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  currentBPValue: {
    padding: 30,
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  quickAdjustContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  quickAdjustButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  adjustButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  adjustButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  adjustButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  decrementButton: {
    backgroundColor: "#FF3B30",
  },
  buttonSave: {
    backgroundColor: "#007AFF",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
