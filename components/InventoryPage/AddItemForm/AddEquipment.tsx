import { ThemedText } from "@/components/ThemedText";
import { eItemClassifications, Equipment, iItem } from "@/constants/Item";
import { ePlayerStat, pStatOptions } from "@/constants/Stats";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { default as VersatileInput } from "../../Input";

type AddEquipmentProps = {
    onChange: (item: Partial<iItem>) => void;
};

// Get screen dimensions for responsive layout
const { width } = Dimensions.get("window");

export function AddEquipment({ onChange }: AddEquipmentProps) {
    const [equipment, setEquipment] = useState<Equipment>({
        id: "0",
        class: eItemClassifications.equipment,
        name: "",
        qty: 1,
        value: 0,
        requiresAttunement: false,
        attunement: false,
        statEffected: ePlayerStat.ac,
        statModifier: 0,
        charges: 0,
        maxCharges: 0,
        recharge: false,
    });

    // Update parent component when equipment state changes
    // Use a ref to track if this is the first render
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip the first render to prevent initial state update loop
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        onChange(equipment);
    }, [equipment]);

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
            <ThemedText style={styles.sectionTitle}>Equipment Details</ThemedText>

            {/* Basic Info Section */}
            <View style={styles.sectionContainer}>
                <ThemedText style={styles.sectionSubtitle}>Basic Information</ThemedText>

                <View style={styles.formRow}>
                    <VersatileInput
                        label="Name"
                        type="string"
                        value={equipment.name || ""}
                        onChangeText={(text) => setEquipment({ ...equipment, name: text })}
                        style={styles.fullWidth}
                        placeholder="Enter equipment name"
                    />
                </View>

                <View style={styles.formRow}>
                    <VersatileInput
                        label="Quantity"
                        type="number"
                        value={equipment.qty !== undefined ? equipment.qty.toString() : "1"}
                        onChangeText={(text) => setEquipment({ ...equipment, qty: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="1"
                    />
                    <VersatileInput
                        label="Value (gold)"
                        type="number"
                        value={equipment.value !== undefined ? equipment.value.toString() : "0"}
                        onChangeText={(text) => setEquipment({ ...equipment, value: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="0"
                    />
                </View>
            </View>

            {/* Stat Effects Section */}
            <View style={styles.sectionContainer}>
                <ThemedText style={styles.sectionSubtitle}>Stat Effects</ThemedText>

                <View style={styles.formRow}>
                    <View style={styles.halfWidth}>
                        <ThemedText style={styles.label}>Affects Stat</ThemedText>
                        <Dropdown
                            data={pStatOptions}
                            labelField="name"
                            valueField="value"
                            value={equipment.statEffected}
                            onChange={(item) => setEquipment({ ...equipment, statEffected: item.value })}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholder="Select stat"
                            search={false}
                            renderLeftIcon={() => <FontAwesome name="shield" size={16} color="#555" style={{ marginRight: 10 }} />}
                        />
                    </View>
                    <VersatileInput
                        label="Stat Modifier"
                        type="number"
                        value={equipment.statModifier !== undefined ? equipment.statModifier.toString() : "0"}
                        onChangeText={(text) => setEquipment({ ...equipment, statModifier: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="0"
                    />
                </View>
            </View>

            {/* Magic Properties Section */}
            <View style={styles.sectionContainer}>
                <ThemedText style={styles.sectionSubtitle}>Magic Properties</ThemedText>

                <View style={styles.formRow}>
                    <View style={styles.checkboxContainer}>
                        <BouncyCheckbox
                            isChecked={equipment.requiresAttunement}
                            onPress={(isChecked) => setEquipment({ ...equipment, requiresAttunement: isChecked })}
                            fillColor="#3498db"
                            text="Requires Attunement"
                            textStyle={styles.checkboxText}
                            iconStyle={styles.checkboxIcon}
                        />
                    </View>

                    <View style={styles.checkboxContainer}>
                        <BouncyCheckbox
                            isChecked={equipment.attunement}
                            onPress={(isChecked) => setEquipment({ ...equipment, attunement: isChecked })}
                            fillColor="#3498db"
                            text="Currently Attuned"
                            textStyle={styles.checkboxText}
                            iconStyle={styles.checkboxIcon}
                            disabled={!equipment.requiresAttunement}
                        />
                    </View>
                </View>

                <View style={styles.formRow}>
                    <VersatileInput
                        label="Charges"
                        type="number"
                        value={equipment.charges !== undefined ? equipment.charges.toString() : "0"}
                        onChangeText={(text) => setEquipment({ ...equipment, charges: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="0"
                    />
                    <VersatileInput
                        label="Max Charges"
                        type="number"
                        value={equipment.maxCharges !== undefined ? equipment.maxCharges.toString() : "0"}
                        onChangeText={(text) => setEquipment({ ...equipment, maxCharges: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="0"
                    />
                </View>

                <View style={styles.formRow}>
                    <View style={styles.checkboxContainer}>
                        <BouncyCheckbox
                            isChecked={equipment.recharge}
                            onPress={(isChecked) => setEquipment({ ...equipment, recharge: isChecked })}
                            fillColor="#3498db"
                            text="Can Recharge"
                            textStyle={styles.checkboxText}
                            iconStyle={styles.checkboxIcon}
                            disabled={equipment.maxCharges === 0}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
