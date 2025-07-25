import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { eItemClassifications, Equipment } from "@/constants/Item";
import { ePlayerStat, pStatOptions } from "@/constants/Stats";
import { addEquipment } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch } from "react-redux";
import { default as VersatileInput } from "../../Input";
export function AddEquipment() {
    const theme = useTheme();
    const styles = useResponsiveStyles();

    const dispatch = useDispatch();

    const [equipment, setEquipment] = useState<Equipment>({
        id: "0",
        class: eItemClassifications.equipment,
        name: "",
        qty: 1,
        value: 0,
        requiresAttunement: false,
        attunement: false,
        statEffected: ePlayerStat.evasion,
        statModifier: 0,
        charges: 0,
        maxCharges: 0,
        recharge: false,
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <ThemedText type="title" style={{ marginBottom: 16 }}>
                Equipment Details
            </ThemedText>

            {/* Basic Info Section */}
            <View style={styles.card}>
                <ThemedText type="defaultSemiBold" style={{ marginBottom: 12 }}>
                    Basic Information
                </ThemedText>

                <View style={[styles.row, { marginBottom: 12 }]}>
                    <View style={{}}>
                        <VersatileInput
                            label="Name"
                            type="string"
                            value={equipment.name || ""}
                            onChangeText={(text) => setEquipment({ ...equipment, name: text })}
                            placeholder="Enter equipment name"
                        />
                    </View>
                </View>

                <View style={[styles.row, { marginBottom: 12 }]}>
                    <View style={{ marginRight: 8 }}>
                        <VersatileInput
                            label="Quantity"
                            type="number"
                            value={equipment.qty !== undefined ? equipment.qty.toString() : "1"}
                            onChangeText={(text) => setEquipment({ ...equipment, qty: parseInt(text) || 0 })}
                            placeholder="1"
                        />
                    </View>
                    <View style={{}}>
                        <VersatileInput
                            label="Value (gold)"
                            type="number"
                            value={equipment.value !== undefined ? equipment.value.toString() : "0"}
                            onChangeText={(text) => setEquipment({ ...equipment, value: parseInt(text) || 0 })}
                            placeholder="0"
                        />
                    </View>
                </View>
            </View>

            {/* Stat Effects Section */}
            <View style={[styles.card, { marginBottom: 16 }]}>
                <ThemedText type="defaultSemiBold" style={{ marginBottom: 12 }}>
                    Stat Effects
                </ThemedText>

                <View style={[styles.row, { marginBottom: 12 }]}>
                    <View style={{ marginRight: 8 }}>
                        <ThemedText style={[styles.label, { marginBottom: 4 }]}>Affects Stat</ThemedText>
                        <View style={styles.inputContainer}>
                            <Dropdown
                                data={pStatOptions}
                                labelField="name"
                                valueField="value"
                                value={equipment.statEffected}
                                onChange={(item) => setEquipment({ ...equipment, statEffected: item.value as ePlayerStat })}
                                style={styles.inputContainer}
                                placeholderStyle={{ color: theme.colors.text, fontSize: 16 }}
                                selectedTextStyle={{ color: theme.colors.text, fontSize: 16 }}
                                placeholder="Select stat"
                                search={false}
                                renderLeftIcon={() => (
                                    <FontAwesome name="shield" size={16} color={theme.colors.text} style={{ marginRight: 10, opacity: 0.7 }} />
                                )}
                            />
                        </View>
                    </View>
                    <View style={{}}>
                        <VersatileInput
                            label="Stat Modifier"
                            type="number"
                            value={equipment.statModifier !== undefined ? equipment.statModifier.toString() : "0"}
                            onChangeText={(text) => setEquipment({ ...equipment, statModifier: parseInt(text) || 0 })}
                            placeholder="0"
                        />
                    </View>
                </View>
            </View>

            {/* Magic Properties Section */}
            <View style={[styles.card, { marginBottom: 16 }]}>
                <ThemedText type="defaultSemiBold" style={{ marginBottom: 12 }}>
                    Magic Properties
                </ThemedText>

                <View style={[styles.row, { marginBottom: 12, flexWrap: "wrap" }]}>
                    <View style={{ marginRight: 16, marginBottom: 8 }}>
                        <BouncyCheckbox
                            isChecked={equipment.requiresAttunement}
                            onPress={(isChecked) => setEquipment({ ...equipment, requiresAttunement: isChecked })}
                            fillColor={theme.colors.primary}
                            text="Requires Attunement"
                            textStyle={{ textDecorationLine: "none", color: theme.colors.text }}
                            iconStyle={{ borderRadius: 4 }}
                            innerIconStyle={{ borderRadius: 4 }}
                        />
                    </View>

                    <View style={{ marginBottom: 8 }}>
                        <BouncyCheckbox
                            isChecked={equipment.attunement}
                            onPress={(isChecked) => setEquipment({ ...equipment, attunement: isChecked })}
                            fillColor={theme.colors.primary}
                            text="Currently Attuned"
                            textStyle={{
                                textDecorationLine: "none",
                                color: equipment.requiresAttunement ? theme.colors.text : theme.colors.border,
                            }}
                            iconStyle={{ borderRadius: 4 }}
                            innerIconStyle={{ borderRadius: 4 }}
                            disabled={!equipment.requiresAttunement}
                        />
                    </View>
                </View>

                <View style={[styles.row, { marginBottom: 12 }]}>
                    <View style={{ marginRight: 8 }}>
                        <VersatileInput
                            label="Charges"
                            type="number"
                            value={equipment.charges !== undefined ? equipment.charges.toString() : "0"}
                            onChangeText={(text) => setEquipment({ ...equipment, charges: parseInt(text) || 0 })}
                            placeholder="0"
                        />
                    </View>
                    <View style={{}}>
                        <VersatileInput
                            label="Max Charges"
                            type="number"
                            value={equipment.maxCharges !== undefined ? equipment.maxCharges.toString() : "0"}
                            onChangeText={(text) => setEquipment({ ...equipment, maxCharges: parseInt(text) || 0 })}
                            placeholder="0"
                        />
                    </View>
                </View>

                <View style={[styles.row, { marginBottom: 12 }]}>
                    <View style={{ marginBottom: 8 }}>
                        <BouncyCheckbox
                            isChecked={equipment.recharge}
                            onPress={(isChecked) => setEquipment({ ...equipment, recharge: isChecked })}
                            fillColor={theme.colors.primary}
                            text="Can Recharge"
                            textStyle={{
                                textDecorationLine: "none",
                                color: equipment.maxCharges > 0 ? theme.colors.text : theme.colors.border,
                            }}
                            iconStyle={{ borderRadius: 4 }}
                            innerIconStyle={{ borderRadius: 4 }}
                            disabled={equipment.maxCharges === 0}
                        />
                    </View>
                </View>
            </View>
            <Pressable onPress={() => dispatch(addEquipment(equipment))} style={[styles.primaryButton, { marginBottom: 16 }]}>
                Add Item
            </Pressable>
        </ScrollView>
    );
}
