import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { calculateTotalMaxHP } from "../Utility/CalculateTotals";

export function LongRestButton() {
  const cssStyle = useResponsiveStyles();
  const dispatch = useDispatch();
  const base = useSelector((state: RootState) => state.character.base);
  const character = useSelector((state: RootState) => state.character);
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
    const totalMaxHP = calculateTotalMaxHP(character);
    const newHP = Math.min(totalMaxHP, base.hitPoints + hpRecovered);
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

  return (
    <>
      <Pressable style={[cssStyle.defaultButton, { backgroundColor: "#6C3483" }]} onPress={handleLongRest} accessibilityLabel="Take a long rest">
        <FontAwesome name="bed" size={15} color="#fff" />
      </Pressable>

      {/* Rest Duration Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={cssStyle.centered}>
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

              <Pressable style={[cssStyle.primaryButton, { backgroundColor: "#6C3483" }]} onPress={processRest}>
                <ThemedText style={cssStyle.buttonText}>Rest</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}
