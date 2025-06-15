import { cssStyle } from "@/app/styles/phone";
import { RootState } from "@/store/rootReducer";
import { updateGold } from "@/store/slices/inventorySlice";
import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
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
        <ThemedView style={cssStyle.container}>
            <View style={[cssStyle.row, cssStyle.card, { backgroundColor: "rgba(255, 215, 0, 0.1)" }]}>
                <Gp size={50} />

                <Pressable onPress={() => setShowAdjustment(true)} style={{ flex: 1, marginLeft: 10 }}>
                    <ThemedText style={cssStyle.largeValue}>{formattedGold}</ThemedText>
                    <ThemedText style={cssStyle.smallText}>Tap to adjust</ThemedText>
                </Pressable>

                <Pressable
                    style={cssStyle.centered}
                    onPress={() => setShowAdjustment(!showAdjustment)}
                    accessibilityLabel={showAdjustment ? "Hide gold adjustment panel" : "Show gold adjustment panel"}
                >
                    <IconSymbol name={showAdjustment ? "minus.circle" : "plus.circle"} size={24} color="#FFD700" />
                </Pressable>
            </View>

            {showAdjustment ? (
                <ThemedView style={cssStyle.card}>
                    <ThemedText style={cssStyle.subtitle}>Adjust Gold</ThemedText>

                    <View style={cssStyle.inputContainer}>
                        <TextInput
                            style={cssStyle.input}
                            keyboardType="numeric"
                            value={adjustmentAmount}
                            onChangeText={setAdjustmentAmount}
                            placeholder="Amount"
                            placeholderTextColor="#999"
                            accessibilityLabel="Gold adjustment amount"
                        />
                    </View>

                    <View style={cssStyle.modalButtons}>
                        <Pressable
                            style={cssStyle.primaryButton}
                            onPress={() => handleAdjustGold(true)}
                            accessibilityLabel={`Add ${adjustmentAmount || "amount"} gold`}
                        >
                            <ThemedText style={cssStyle.buttonText}>Add</ThemedText>
                        </Pressable>

                        <Pressable
                            style={cssStyle.secondaryButton}
                            onPress={() => handleAdjustGold(false)}
                            accessibilityLabel={`Subtract ${adjustmentAmount || "amount"} gold`}
                        >
                            <ThemedText style={cssStyle.buttonText}>Subtract</ThemedText>
                        </Pressable>
                    </View>

                    <View style={cssStyle.adjustmentRow}>
                        {[1, 10, 25, 100].map((amount) => (
                            <Pressable
                                key={amount}
                                style={[cssStyle.centered, { backgroundColor: "rgba(255, 215, 0, 0.2)" }]}
                                onPress={() => {
                                    setAdjustmentAmount(amount.toString());
                                }}
                                accessibilityLabel={`Set amount to ${amount}`}
                            >
                                <ThemedText style={cssStyle.label}>{amount}</ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </ThemedView>
            ) : null}
        </ThemedView>
    );
}
