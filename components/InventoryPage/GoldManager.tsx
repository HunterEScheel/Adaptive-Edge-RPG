import { RootState } from "@/store/rootReducer";
import { updateGold } from "@/store/slices/inventorySlice";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Gp } from "../ui/Gp";
import { IconSymbol } from "../ui/IconSymbol";

export function GoldManager() {
  const character = useSelector((state: RootState) => state.character);
  const dispatch = useDispatch();
  const [showAdjustment, setShowAdjustment] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");

  // Format gold with commas for thousands
  const formattedGold = character.inventory?.gold?.toLocaleString() || "0";

  const handleAdjustGold = (isAdd: boolean) => {
    const amount = parseInt(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newGold = isAdd ? character.inventory?.gold + amount : Math.max(0, character.inventory?.gold - amount);

    dispatch(updateGold(newGold));
    setAdjustmentAmount("");
    setShowAdjustment(false);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.goldDisplay}>
        <Gp size={50} />

        <Pressable onPress={() => setShowAdjustment(true)} style={styles.goldAmountContainer}>
          <ThemedText style={styles.goldAmount}>{formattedGold}</ThemedText>
          <ThemedText style={styles.tapToEditHint}>Tap to adjust</ThemedText>
        </Pressable>

        <Pressable style={styles.adjustButton} onPress={() => setShowAdjustment(!showAdjustment)} accessibilityLabel={showAdjustment ? "Hide gold adjustment panel" : "Show gold adjustment panel"}>
          <IconSymbol name={showAdjustment ? "minus.circle" : "plus.circle"} size={24} color="#FFD700" />
        </Pressable>
      </View>

      {showAdjustment ? (
        <ThemedView style={styles.adjustmentPanel}>
          <ThemedText style={styles.adjustmentTitle}>Adjust Gold</ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={adjustmentAmount}
              onChangeText={setAdjustmentAmount}
              placeholder="Amount"
              placeholderTextColor="#999"
              accessibilityLabel="Gold adjustment amount"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.addButton]} onPress={() => handleAdjustGold(true)} accessibilityLabel={`Add ${adjustmentAmount || "amount"} gold`}>
              <ThemedText style={styles.buttonText}>Add</ThemedText>
            </Pressable>

            <Pressable style={[styles.button, styles.subtractButton]} onPress={() => handleAdjustGold(false)} accessibilityLabel={`Subtract ${adjustmentAmount || "amount"} gold`}>
              <ThemedText style={styles.buttonText}>Subtract</ThemedText>
            </Pressable>
          </View>

          <View style={styles.quickAmountContainer}>
            {[1, 10, 25, 100].map((amount) => (
              <Pressable
                key={amount}
                style={styles.quickAmountButton}
                onPress={() => {
                  setAdjustmentAmount(amount.toString());
                }}
                accessibilityLabel={`Set amount to ${amount}`}
              >
                <ThemedText style={styles.quickAmountText}>{amount}</ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  goldDisplay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
  },
  goldAmountContainer: {
    flex: 1,
    marginLeft: 10,
  },
  goldAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tapToEditHint: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },

  adjustButton: {
    padding: 8,
    borderRadius: 20,
  },
  adjustmentPanel: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  adjustmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  subtractButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  quickAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  quickAmountButton: {
    width: "22%",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 8,
  },
  quickAmountText: {
    fontWeight: "bold",
    color: "#333",
  },
});
