import { ThemedText } from "@/components/ThemedText";
import { Armor } from "@/constants/Item";
import { addArmor } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch } from "react-redux";
import { cssStyle } from "@/app/styles/phone";

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
        <View style={cssStyle.container}>
            <ThemedText style={cssStyle.title}>Add Armor</ThemedText>

            <View style={cssStyle.formRow}>
                <ThemedText style={cssStyle.label}>Armor Type</ThemedText>
                <Dropdown
                    data={armorOptions.map((option) => ({
                        label: option.name,
                        value: option.id,
                    }))}
                    labelField="label"
                    valueField="value"
                    value={armor.id}
                    onChange={(item) => setArmor(armorOptions.find((option) => option.id === item.value) || armor)}
                    style={cssStyle.dropdown}
                    placeholder="Select armor type"
                />
            </View>

            <View style={cssStyle.formRow}>
                <ThemedText style={cssStyle.label}>Custom Name (Optional)</ThemedText>
                <TextInput
                    style={cssStyle.input}
                    value={armor.name}
                    onChangeText={(text) => setArmor({ ...armor, name: text })}
                    placeholder="Enter custom name or leave blank for default"
                />
                <ThemedText style={cssStyle.smallText}>
                    Classification: <ThemedText style={cssStyle.valueText}>{armor.armorClassification}</ThemedText>
                </ThemedText>
                <ThemedText style={cssStyle.smallText}>
                    AC Bonus: <ThemedText style={cssStyle.valueText}>+{armor.bonus}</ThemedText>
                </ThemedText>
                <ThemedText style={cssStyle.smallText}>Enchantment Bonus?</ThemedText>
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
                    style={cssStyle.dropdown}
                    placeholder="Select enchantment bonus"
                />
            </View>

            <Pressable style={cssStyle.primaryButton} onPress={handleAddArmor}>
                <FontAwesome name="plus" size={16} color="white" />
                <ThemedText style={cssStyle.buttonText}>Add Armor</ThemedText>
            </Pressable>
        </View>
    );
}
