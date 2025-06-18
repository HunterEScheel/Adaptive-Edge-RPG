import { ThemedText } from "@/components/ThemedText";
import { eItemClassifications, iItem, Weapon } from "@/constants/Item";
import { eDamageDice } from "@/constants/Stats";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { default as VersatileInput } from "../../Input";
import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";

// Get screen dimensions for responsive layout
const { width, height } = Dimensions.get("window");

// Extended Weapon type with additional properties
interface ExtendedWeapon extends Weapon {
    damageBonus?: number;
    attackBonus?: number;
    damageType?: string;
    properties?: string[];
    weight?: number;
    magical?: boolean;
    rarity?: string;
    weaponHeft?: "Unarmed" | "1-handed" | "2-handed" | "Versatile";
    weaponType?: "Stab" | "Swing" | "Fire" | "Draw";
}

// Damage dice options for dropdown
const damageDiceOptions = Object.entries(eDamageDice).map(([key, value]) => ({
    label: key,
    value: value,
}));

// Attribute options for dropdown
const attributeOptions = [
    { label: "Strength", value: "str" },
    { label: "Dexterity", value: "dex" },
];

// Weapon classification options for dropdowns
const weaponHeftOptions = [
    { label: "Unarmed", value: "Unarmed" },
    { label: "1-handed", value: "1-handed" },
    { label: "2-handed", value: "2-handed" },
    { label: "Versatile", value: "Versatile" },
];

const weaponTypeOptions = [
    { label: "Stab", value: "Stab" },
    { label: "Swing", value: "Swing" },
    { label: "Fire", value: "Fire" },
    { label: "Draw", value: "Draw" },
];

export function AddWeapon({ onChange }: { onChange: (weapon: Partial<iItem>) => void }) {
    const styles = useResponsiveStyles();
    const [weapon, setWeapon] = useState<ExtendedWeapon>({
        id: "",
        name: "",
        value: 0,
        qty: 1,
        class: eItemClassifications.weapon,
        damageDice: eDamageDice.d4,
        damageDiceCount: 1,
        requiresAttunement: false,
        attunement: false,
        charges: 0,
        maxCharges: 0,
        versatile: false,
        twoHanded: false,
        recharge: false,
        // Extended properties
        damageType: "",
        properties: [],
        weight: 0,
        magical: false,
        rarity: "",
        damageBonus: 0,
        attackBonus: 0,
        attribute: "str", // Default to strength
        weaponHeft: "Unarmed",
        weaponType: "Stab",
    });

    // Use ref to prevent infinite update loop on initial render
    const isFirstRender = useRef(true);

    // Update parent component when weapon changes
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        onChange(weapon);
    }, [weapon]);

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <View style={styles.container}>
                <ThemedText style={styles.sectionTitle}>Weapon Details</ThemedText>

                {/* Basic Info Section */}
                <View style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionSubtitle}>Basic Information</ThemedText>
                    <View style={styles.formRow}>
                        <VersatileInput
                            label="Name"
                            type="string"
                            value={weapon.name || ""}
                            onChangeText={(text) => setWeapon({ ...weapon, name: text })}
                            style={styles.fullWidth}
                            placeholder="Enter weapon name"
                        />
                    </View>
                    <View style={styles.formRow}>
                        <VersatileInput
                            label="Quantity"
                            type="number"
                            value={(weapon.qty !== undefined ? weapon.qty : 1).toString()}
                            onChangeText={(text) => setWeapon({ ...weapon, qty: parseInt(text) || 0 })}
                            style={styles.halfWidth}
                            placeholder="1"
                        />
                        <VersatileInput
                            label="Value (gold)"
                            type="number"
                            value={(weapon.value !== undefined ? weapon.value : 0).toString()}
                            onChangeText={(text) => setWeapon({ ...weapon, value: parseInt(text) || 0 })}
                            style={styles.halfWidth}
                            placeholder="0"
                        />
                    </View>
                </View>
            </View>

            {/* Combat Stats Section */}
            <View style={styles.sectionContainer}>
                <ThemedText style={styles.sectionSubtitle}>Combat Statistics</ThemedText>

                <View style={styles.formRow}>
                    <View style={styles.halfWidth}>
                        <ThemedText style={styles.label}>Damage Dice</ThemedText>
                        <Dropdown
                            data={damageDiceOptions}
                            labelField="label"
                            valueField="value"
                            value={weapon.damageDice}
                            onChange={(item) => setWeapon({ ...weapon, damageDice: item.value })}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholder="Select dice"
                            search={false}
                            renderLeftIcon={() => <FontAwesome name="cube" size={16} color="#555" style={{ marginRight: 10 }} />}
                        />
                    </View>

                    <VersatileInput
                        label="Dice Count"
                        type="number"
                        value={(weapon.damageDiceCount || 1).toString()}
                        onChangeText={(text) => setWeapon({ ...weapon, damageDiceCount: parseInt(text) || 1 })}
                        style={styles.halfWidth}
                        placeholder="1"
                    />
                </View>

                <View style={styles.formRow}>
                    <VersatileInput
                        label="Damage Bonus"
                        type="number"
                        value={weapon.damageBonus?.toString() || "0"}
                        onChangeText={(text) => setWeapon({ ...weapon, damageBonus: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="0"
                    />
                    <VersatileInput
                        label="Attack Bonus"
                        type="number"
                        value={weapon.attackBonus?.toString() || "0"}
                        onChangeText={(text) => setWeapon({ ...weapon, attackBonus: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="0"
                    />
                </View>
            </View>

            {/* Weapon Classification Section */}
            <View style={styles.sectionContainer}>
                <ThemedText style={styles.sectionSubtitle}>Weapon Classification</ThemedText>
                <View style={styles.formRow}>
                    <View style={styles.halfWidth}>
                        <ThemedText style={styles.label}>Weapon Heft</ThemedText>
                        <Dropdown
                            data={weaponHeftOptions}
                            labelField="label"
                            valueField="value"
                            value={weapon.weaponHeft}
                            onChange={(item) => setWeapon({ ...weapon, weaponHeft: item.value })}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholder="Select heft"
                            search={false}
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <ThemedText style={styles.label}>Weapon Type</ThemedText>
                        <Dropdown
                            data={weaponTypeOptions}
                            labelField="label"
                            valueField="value"
                            value={weapon.weaponType}
                            onChange={(item) => setWeapon({ ...weapon, weaponType: item.value })}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholder="Select type"
                            search={false}
                        />
                    </View>
                </View>

                <View style={styles.formRow}>
                    <View style={styles.halfWidth}>
                        <ThemedText style={styles.label}>Attribute</ThemedText>
                        <Dropdown
                            data={attributeOptions}
                            labelField="label"
                            valueField="value"
                            value={weapon.attribute}
                            onChange={(item) => setWeapon({ ...weapon, attribute: item.value })}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholder="Select attribute"
                            search={false}
                        />
                    </View>
                    <View style={styles.halfWidth} />
                </View>
            </View>

            {/* Magic Properties Section */}
            <View style={styles.sectionContainer}>
                <ThemedText style={styles.sectionSubtitle}>Magic Properties</ThemedText>
                <View style={styles.formRow}>
                    <View style={styles.checkboxContainer}>
                        <BouncyCheckbox
                            isChecked={weapon.requiresAttunement}
                            onPress={(isChecked) => setWeapon({ ...weapon, requiresAttunement: isChecked })}
                            fillColor="#3498db"
                            text="Requires Attunement"
                            textStyle={styles.checkboxText}
                            iconStyle={styles.checkboxIcon}
                        />
                    </View>

                    <View style={styles.checkboxContainer}>
                        <BouncyCheckbox
                            isChecked={weapon.attunement}
                            onPress={(isChecked) => setWeapon({ ...weapon, attunement: isChecked })}
                            fillColor="#3498db"
                            text="Currently Attuned"
                            textStyle={styles.checkboxText}
                            iconStyle={styles.checkboxIcon}
                            disabled={!weapon.requiresAttunement}
                        />
                    </View>
                </View>

                <View style={styles.formRow}>
                    <VersatileInput
                        label="Charges"
                        type="number"
                        value={(weapon.charges !== undefined ? weapon.charges : 0).toString()}
                        onChangeText={(text) => setWeapon({ ...weapon, charges: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="0"
                    />
                    <VersatileInput
                        label="Max Charges"
                        type="number"
                        value={(weapon.maxCharges !== undefined ? weapon.maxCharges : 0).toString()}
                        onChangeText={(text) => setWeapon({ ...weapon, maxCharges: parseInt(text) || 0 })}
                        style={styles.halfWidth}
                        placeholder="0"
                    />
                </View>

                <View style={styles.formRow}>
                    <View style={styles.checkboxContainer}>
                        <BouncyCheckbox
                            isChecked={weapon.recharge}
                            onPress={(isChecked) => setWeapon({ ...weapon, recharge: isChecked })}
                            fillColor="#3498db"
                            text="Can Recharge"
                            textStyle={styles.checkboxText}
                            iconStyle={styles.checkboxIcon}
                            disabled={weapon.maxCharges === 0}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
