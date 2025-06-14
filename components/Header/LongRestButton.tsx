import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconSymbol } from "../ui/IconSymbol";
import { cssStyle } from "@/app/styles/phone";

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
        <Pressable style={[cssStyle.compactButton, { backgroundColor: "#6C3483" }]} onPress={handleLongRest} accessibilityLabel="Take a long rest">
          <IconSymbol name="moon.stars.fill" size={18} color="#6C3483" />
        </Pressable>

        {/* Rest Duration Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={cssStyle.centeredView}>
            <ThemedView style={cssStyle.modalView}>
              <ThemedText style={cssStyle.title}>Rest Duration</ThemedText>
              <ThemedText style={[cssStyle.bodyText, { textAlign: "center", marginBottom: 15 }]}>
                Enter how many hours you want to rest.{"\n"}
                (Recover {HP_PER_HOUR} HP and {ENERGY_PER_HOUR} Energy per hour)
              </ThemedText>

              <TextInput style={cssStyle.input} keyboardType="numeric" value={restHours} onChangeText={setRestHours} placeholder="Hours" placeholderTextColor="#999" />

              <View style={cssStyle.modalButtons}>
                <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                  <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                </Pressable>

                <Pressable style={[cssStyle.actionButton, { backgroundColor: "#6C3483" }]} onPress={processRest}>
                  <ThemedText style={cssStyle.buttonText}>Rest</ThemedText>
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
      <Pressable style={[cssStyle.actionButton, { backgroundColor: "#6C3483" }]} onPress={handleLongRest} accessibilityLabel="Take a long rest">
        <View style={cssStyle.row}>
          <IconSymbol name="moon.stars.fill" size={24} color="#FFFFFF" />
          <ThemedText style={cssStyle.buttonText}>Long Rest</ThemedText>
        </View>
      </Pressable>

      {/* Rest Duration Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={cssStyle.centeredView}>
          <ThemedView style={cssStyle.modalView}>
            <ThemedText style={cssStyle.title}>Rest Duration</ThemedText>
            <ThemedText style={[cssStyle.bodyText, { textAlign: "center", marginBottom: 15 }]}>
              Enter how many hours you want to rest.{"\n"}
              (Recover {HP_PER_HOUR} HP and {ENERGY_PER_HOUR} Energy per hour)
            </ThemedText>

            <TextInput style={cssStyle.input} keyboardType="numeric" value={restHours} onChangeText={setRestHours} placeholder="Hours" placeholderTextColor="#999" />

            <View style={cssStyle.modalButtons}>
              <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
              </Pressable>

              <Pressable style={[cssStyle.actionButton, { backgroundColor: "#6C3483" }]} onPress={processRest}>
                <ThemedText style={cssStyle.buttonText}>Rest</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}
