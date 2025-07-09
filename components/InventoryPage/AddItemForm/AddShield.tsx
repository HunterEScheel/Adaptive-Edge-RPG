import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import VersatileInput from "@/components/Input";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Shield } from "@/constants/Item";
import { addShield } from "@/store/slices/inventorySlice";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useDispatch } from "react-redux";

export function AddShield() {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const [newShield, setNewShield] = useState<Shield>({
        name: "",
        parryBonus: 2,
    });

    const handleAddShield = () => {
        if (newShield.name) {
            dispatch(addShield(newShield));
            setNewShield({
                name: "",
                parryBonus: 2,
            });
        }
    };

    return (
        <ThemedView style={cssStyle.container}>
            <ThemedText style={cssStyle.sectionTitle}>Add Shield</ThemedText>
            <View style={cssStyle.formGroup}>
                <ThemedText style={cssStyle.label}>Shield Name</ThemedText>
                <VersatileInput
                    type="string"
                    value={newShield.name}
                    onChangeText={(text) => setNewShield({ ...newShield, name: text })}
                    placeholder="e.g. Wooden Shield"
                    style={cssStyle.input}
                />
            </View>
            <View style={cssStyle.formGroup}>
                <ThemedText style={cssStyle.label}>Parry Bonus</ThemedText>
                <VersatileInput
                    value={newShield.parryBonus.toString()}
                    onChangeText={(text) => setNewShield({ ...newShield, parryBonus: parseInt(text) || 0 })}
                    type="number"
                    style={cssStyle.input}
                />
            </View>
            <Pressable style={[cssStyle.primaryButton, cssStyle.primaryColors]} onPress={handleAddShield}>
                <ThemedText style={cssStyle.primaryText}>Add Shield</ThemedText>
            </Pressable>
        </ThemedView>
    );
}
