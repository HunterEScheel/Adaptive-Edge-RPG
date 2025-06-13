import { ThemedText } from "@/components/ThemedText";
import { Armor } from "@/constants/Item";
import { addArmor } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch } from "react-redux";

interface AddArmorProps {
    onChange?: (armor: Armor) => void;
}

const armorOptions: Armor[] = [
    {
        name: "Padded Armor",
        armorClassification: "Light",
        bonus: 1,
        id: 1,
    },
    {
        name: "Leather Armor",
        armorClassification: "Light",
        bonus: 2,
        id: 2,
    },
    {
        name: "Hide Armor",
        armorClassification: "Medium",
        bonus: 3,
        id: 3,
    },
    {
        name: "Scale Mail",
        armorClassification: "Medium",
        bonus: 4,
        id: 4,
    },
    {
        name: "Chain Mail",
        armorClassification: "Heavy",
        bonus: 5,
        id: 5,
    },
    {
        name: "Plate Mail",
        armorClassification: "Heavy",
        bonus: 6,
        id: 6,
    },
];

export function AddArmor({ onChange }: AddArmorProps) {
    const dispatch = useDispatch();
    const [armor, setArmor] = useState<Armor>({
        name: "Padded Armor",
        armorClassification: "Light",
        bonus: 1,
        id: 1,
    });

    // Update parent component when armor state changes
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        onChange?.(armor);
    }, [armor, onChange]);

    const handleAddArmor = () => {
        dispatch(addArmor(armor));

        // Reset form
        setArmor({
            name: "Padded Armor",
            armorClassification: "Light",
            bonus: 1,
            id: 1,
        });
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Add Armor</ThemedText>

            <View style={styles.formRow}>
                <ThemedText style={styles.label}>Armor Type</ThemedText>
                <Dropdown
                    data={armorOptions.map((option) => ({
                        label: option.name,
                        value: option.id,
                    }))}
                    labelField="label"
                    valueField="value"
                    value={armor.id}
                    onChange={(item) => setArmor(armorOptions.find((option) => option.id === item.value) || armor)}
                    style={styles.dropdown}
                    placeholder="Select armor type"
                />
            </View>

            <View style={styles.formRow}>
                <ThemedText style={styles.label}>Custom Name (Optional)</ThemedText>
                <TextInput
                    style={styles.textInput}
                    value={armor.name}
                    onChangeText={(text) => setArmor({ ...armor, name: text })}
                    placeholder="Enter custom name or leave blank for default"
                />
                <ThemedText style={styles.detailText}>
                    Classification: <ThemedText style={styles.detailValue}>{armor.armorClassification}</ThemedText>
                </ThemedText>
                <ThemedText style={styles.detailText}>
                    AC Bonus: <ThemedText style={styles.detailValue}>+{armor.bonus}</ThemedText>
                </ThemedText>
                <ThemedText style={styles.detailText}>Enchantment Bonus?</ThemedText>
                <Dropdown
                    data={[
                        { label: "None", value: undefined },
                        { label: "+1", value: 1 },
                        { label: "+2", value: 2 },
                        { label: "+3", value: 3 },
                    ]}
                    labelField="label"
                    valueField="value"
                    value={armor.enchantmentBonus || undefined}
                    onChange={(item) => setArmor({ ...armor, enchantmentBonus: item.value })}
                    style={styles.dropdown}
                    placeholder="Select enchantment bonus"
                />
            </View>

            <Pressable style={styles.addButton} onPress={handleAddArmor}>
                <FontAwesome name="plus" size={16} color="white" />
                <ThemedText style={styles.addButtonText}>Add Armor</ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        margin: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    formRow: {
        marginBottom: 15,
        color: "#333",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 5,
        color: "#333",
    },
    dropdown: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "white",
    },
    textInput: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "white",
        fontSize: 16,
    },
    armorDetails: {
        backgroundColor: "#e9ecef",
        padding: 12,
        borderRadius: 6,
        marginBottom: 15,
    },
    detailText: {
        fontSize: 14,
        marginBottom: 4,
        color: "#333",
    },
    detailValue: {
        fontWeight: "bold",
        color: "#007AFF",
    },
    addButton: {
        backgroundColor: "#007AFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        gap: 8,
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
