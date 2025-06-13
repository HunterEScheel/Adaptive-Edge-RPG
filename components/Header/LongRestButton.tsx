import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";

type LongRestButtonProps = {
  compact?: boolean;
};

export function LongRestButton({ compact = false }: LongRestButtonProps) {
  const dispatch = useDispatch();
  const base = useSelector((state: RootState) => state.character.base);
  const [modalVisible, setModalVisible] = useState(false);
  const [restHours, setRestHours] = useState("8");

  // Constants for recovery rates
  const HP_PER_HOUR = 5;
  const ENERGY_PER_HOUR = 5;

  const handleLongRest = () => {
    setModalVisible(true);
  };

  const processRest = () => {
    const hours = parseInt(restHours);

    if (isNaN(hours) || hours <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of hours.");
      return;
    }

    // Calculate recovery based on hours rested
    const hpRecovered = hours * HP_PER_HOUR;
    const energyRecovered = hours * ENERGY_PER_HOUR;

    // Apply recovery (don't exceed character maximums)
    const newHP = Math.min(base.maxHitPoints, base.hitPoints + hpRecovered);
    const newEnergy = Math.min(base.maxEnergy, base.energy + energyRecovered);

    // Calculate actual recovery after applying maximums
    const actualHPRecovered = newHP - base.hitPoints;
    const actualEnergyRecovered = newEnergy - base.energy;

    dispatch(
      updateMultipleFields([
        { field: "hitPoints", value: newHP },
        { field: "energy", value: newEnergy },
      ])
    );

    // Close modal and show success message
    setModalVisible(false);
    Alert.alert("Rest Complete", `You've rested for ${hours} hours and recovered ${actualHPRecovered} HP and ${actualEnergyRecovered} Energy.`);
  };

  if (compact) {
    return (
      <>
        <Pressable style={styles.compactButton} onPress={handleLongRest} accessibilityLabel="Take a long rest">
          <IconSymbol name="moon.stars.fill" size={18} color="#6C3483" />
        </Pressable>

        {/* Rest Duration Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <ThemedView style={styles.modalView}>
              <ThemedText style={styles.modalTitle}>Rest Duration</ThemedText>
              <ThemedText style={styles.modalDescription}>
                Enter how many hours you want to rest.{"\n"}
                (Recover {HP_PER_HOUR} HP and {ENERGY_PER_HOUR} Energy per hour)
              </ThemedText>

              <TextInput style={styles.input} keyboardType="numeric" value={restHours} onChangeText={setRestHours} placeholder="Hours" placeholderTextColor="#999" />

              <View style={styles.buttonRow}>
                <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>

                <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={processRest}>
                  <ThemedText style={styles.confirmText}>Rest</ThemedText>
                </Pressable>
              </View>
            </ThemedView>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Pressable style={styles.button} onPress={handleLongRest} accessibilityLabel="Take a long rest">
        <View style={styles.buttonContent}>
          <IconSymbol name="moon.stars.fill" size={24} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>Long Rest</ThemedText>
        </View>
      </Pressable>

      {/* Rest Duration Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText style={styles.modalTitle}>Rest Duration</ThemedText>
            <ThemedText style={styles.modalDescription}>
              Enter how many hours you want to rest.{"\n"}
              (Recover {HP_PER_HOUR} HP and {ENERGY_PER_HOUR} Energy per hour)
            </ThemedText>

            <TextInput style={styles.input} keyboardType="numeric" value={restHours} onChangeText={setRestHours} placeholder="Hours" placeholderTextColor="#999" />

            <View style={styles.buttonRow}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <ThemedText>Cancel</ThemedText>
              </Pressable>

              <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={processRest}>
                <ThemedText style={styles.confirmText}>Rest</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6C3483",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  compactButton: {
    backgroundColor: "#6C3483",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 10,
  },
  modalDescription: {
    textAlign: "center",
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
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#6C3483",
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
  },
});
