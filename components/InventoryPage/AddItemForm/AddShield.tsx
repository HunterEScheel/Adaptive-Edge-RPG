import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { Input } from "@/components/Input";
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
        durability: 10,
        maxDurability: 10,
        value: 50,
    });

    const handleAddShield = () => {
        if (newShield.name) {
            dispatch(addShield(newShield));
            setNewShield({
                name: "",
                parryBonus: 2,
                durability: 10,
                maxDurability: 10,
                value: 50,
            });
        }
    };

    return (
        <ThemedView style={cssStyle.container}>
            <ThemedText style={cssStyle.sectionTitle}>Add Shield</ThemedText>
            <View style={cssStyle.formGroup}>
                <ThemedText style={cssStyle.label}>Shield Name</ThemedText>
                <Input
                    value={newShield.name}
                    onChangeText={(text) => setNewShield({ ...newShield, name: text })}
                    placeholder="e.g. Wooden Shield"
                    style={cssStyle.input}
                />
            </View>
            <View style={cssStyle.formGroup}>
                <ThemedText style={cssStyle.label}>Parry Bonus</ThemedText>
                <Input
                    value={newShield.parryBonus.toString()}
                    onChangeText={(text) => setNewShield({ ...newShield, parryBonus: parseInt(text) || 0 })}
                    keyboardType="numeric"
                    style={cssStyle.input}
                />
            </View>
            <View style={cssStyle.formGroup}>
                <ThemedText style={cssStyle.label}>Max Durability</ThemedText>
                <Input
                    value={newShield.maxDurability.toString()}
                    onChangeText={(text) => {
                        const maxDur = parseInt(text) || 0;
                        setNewShield({ ...newShield, maxDurability: maxDur, durability: maxDur });
                    }}
                    keyboardType="numeric"
                    style={cssStyle.input}
                />
            </View>
            <View style={cssStyle.formGroup}>
                <ThemedText style={cssStyle.label}>Value (gp)</ThemedText>
                <Input
                    value={newShield.value.toString()}
                    onChangeText={(text) => setNewShield({ ...newShield, value: parseInt(text) || 0 })}
                    keyboardType="numeric"
                    style={cssStyle.input}
                />
            </View>
            <Pressable style={[cssStyle.primaryButton, cssStyle.primaryColors]} onPress={handleAddShield}>
                <ThemedText style={cssStyle.primaryText}>Add Shield</ThemedText>
            </Pressable>
        </ThemedView>
    );
}