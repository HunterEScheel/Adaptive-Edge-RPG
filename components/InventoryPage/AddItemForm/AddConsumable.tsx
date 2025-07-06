import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { Consumable, eItemClassifications, iItem } from "@/constants/Item";
import { ePlayerStat, pStatOptions } from "@/constants/Stats";
import { addConsumable } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch } from "react-redux";
import { default as VersatileInput } from "../../Input";

type AddConsumableProps = {
    onChange?: (item: Partial<iItem>) => void;
};

// Get screen dimensions for responsive layout
const { width } = Dimensions.get("window");

export function AddConsumable() {
    const cssStyle = useResponsiveStyles();
    const [consumable, setConsumable] = useState<Consumable>({
        class: eItemClassifications.consumable,
        name: "",
        qty: 1,
        value: 0,
        statEffected: ePlayerStat.hp,
        statModifier: 0,
        id: "",
    });
    const dispatch = useDispatch();
    return (
        <ScrollView style={cssStyle.container} contentContainerStyle={cssStyle.container}>
            <ThemedText style={cssStyle.title}>Consumable Details</ThemedText>

            {/* Basic Info Section */}
            <View style={cssStyle.card}>
                <ThemedText style={cssStyle.subtitle}>Basic Information</ThemedText>
                <View style={cssStyle.formRow}>
                    <VersatileInput
                        label="Name"
                        type="string"
                        value={consumable.name || ""}
                        onChangeText={(text) => setConsumable({ ...consumable, name: text })}
                        style={cssStyle.input}
                        placeholder="Enter consumable name"
                    />
                </View>

                <View style={cssStyle.formRow}>
                    <VersatileInput
                        label="Quantity"
                        type="number"
                        value={consumable.qty !== undefined ? consumable.qty.toString() : "1"}
                        onChangeText={(text) => setConsumable({ ...consumable, qty: parseInt(text) || 0 })}
                        style={cssStyle.input}
                        placeholder="1"
                    />
                    <VersatileInput
                        label="Value (gold)"
                        type="number"
                        value={consumable.value !== undefined ? consumable.value.toString() : "0"}
                        onChangeText={(text) => setConsumable({ ...consumable, value: parseInt(text) || 0 })}
                        style={cssStyle.input}
                        placeholder="0"
                    />
                </View>
            </View>

            {/* Effect Section */}
            <View style={cssStyle.card}>
                <ThemedText style={cssStyle.subtitle}>Consumable Effects</ThemedText>
                <View style={cssStyle.formRow}>
                    <View style={cssStyle.container}>
                        <ThemedText style={cssStyle.label}>Affects Stat</ThemedText>
                        <Dropdown
                            data={pStatOptions}
                            labelField="name"
                            valueField="value"
                            value={consumable.statEffected}
                            onChange={(item) => setConsumable({ ...consumable, statEffected: item.value })}
                            style={cssStyle.container}
                            placeholderStyle={cssStyle.smallText}
                            selectedTextStyle={cssStyle.valueText}
                            placeholder="Select stat"
                            search={false}
                            renderLeftIcon={() => <FontAwesome name="flask" size={16} color="#555" style={{ marginRight: 10 }} />}
                        />
                    </View>
                    <VersatileInput
                        label="Modifier Value"
                        type="number"
                        value={consumable.statModifier !== undefined ? consumable.statModifier.toString() : "0"}
                        onChangeText={(text) => setConsumable({ ...consumable, statModifier: parseInt(text) || 0 })}
                        style={cssStyle.input}
                        placeholder="0"
                    />
                </View>
                <Pressable style={[cssStyle.primaryButton]} onPress={() => dispatch(addConsumable(consumable))}>
                    Add Consumable
                </Pressable>
            </View>
        </ScrollView>
    );
}
