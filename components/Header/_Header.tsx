import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StatAdjuster } from "../MainPage/StatAdjuster";
import { StatUpgrader } from "../MainPage/StatUpgrader";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { calculateTotalDamageReduction, calculateTotalEvasion } from "../Utility/CalculateTotals";
import { BuildPointManager } from "./BuildPointManager";
import { EvasionBreakdownModal } from "./EvasionBreakdownModal";
import { LongRestButton } from "./LongRestButton";
import { PresetManagerButton } from "./PresetManagerButton";
import { SaveButton } from "./SaveButton";

// Local styles specific to the Header component
const localStyles = StyleSheet.create({
    statContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    centered: {
        alignItems: "center",
        justifyContent: "center",
    },
    // Add other local styles as needed
});

export function CharacterHeader() {
    const styles = useResponsiveStyles();
    const { isPhone, isTablet, isDesktop, responsiveStyle } = useResponsive();
    const character = useSelector((state: RootState) => state.character);
    const base = useSelector((state: RootState) => state.character.base);
    const dispatch = useDispatch();
    const [hpModalVisible, setHpModalVisible] = useState(false);
    const [energyModalVisible, setEnergyModalVisible] = useState(false);
    const [evasionBreakdownModalVisible, setEvasionBreakdownModalVisible] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(base?.name || "");

    // Sync nameValue with base.name when it changes
    useEffect(() => {
        if (base?.name) {
            setNameValue(base.name);
        }
    }, [base?.name]);

    const handleHeal = (statType: "hp" | "energy") => {
        const currentValue = statType === "hp" ? base.hitPoints : base.energy;
        const maxValue = statType === "hp" ? base.maxHitPoints : base.maxEnergy;
        const fieldName = statType === "hp" ? "hitPoints" : "energy";

        if (currentValue < maxValue) {
            dispatch(updateMultipleFields([{ field: fieldName, value: Math.min(currentValue + 1, maxValue) }]));
        }
    };

    const handleDamage = (statType: "hp" | "energy") => {
        const currentValue = statType === "hp" ? base.hitPoints : base.energy;
        const fieldName = statType === "hp" ? "hitPoints" : "energy";

        if (currentValue > 0) {
            dispatch(updateMultipleFields([{ field: fieldName, value: currentValue - 1 }]));
        }
    };

    const handleNameEdit = () => {
        dispatch(updateMultipleFields([{ field: "name", value: nameValue }]));
        setIsEditingName(false);
    };

    const handleNameClick = () => {
        setIsEditingName(true);
    };

    if (!base) {
        return (
            <View style={styles.sectionHeaderContainer}>
                <ThemedText>Loading...</ThemedText>
            </View>
        );
    }

    return (
        <ThemedView>
            <View style={[styles.row, isPhone && { flexDirection: "column", alignItems: "stretch" }]}>
                {/* Character Name (Editable) */}
                <View style={[styles.sectionContainer, styles.row]}>
                    {isEditingName ? (
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} value={nameValue} onChangeText={setNameValue} autoFocus onBlur={handleNameEdit} />
                        </View>
                    ) : (
                        <View style={{ display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-between", width: "100%" }}>
                            <Pressable onPress={handleNameClick}>
                                <ThemedText type="subtitle" style={styles.input}>
                                    {base.name || "Unnamed Character"}
                                    <ThemedText style={styles.primaryText}> ✎</ThemedText>
                                </ThemedText>
                            </Pressable>
                            <LongRestButton />
                            <SaveButton />
                            <PresetManagerButton />
                            <BuildPointManager />
                        </View>
                    )}
                </View>
            </View>
            <ThemedView style={[styles.sectionHeaderContainer, !isPhone && { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
                {/* Attributes Section */}
                <ThemedView style={[styles.attributeSectionContainer, isPhone && { paddingVertical: 4 }, !isPhone && { flex: 1 }]}>
                    <ThemedView style={[styles.attributeRowContainer, isPhone && { paddingHorizontal: 2, marginVertical: 1 }]}>
                        <StatAdjuster statName="STR" fieldName="str" minValue={-4} maxValue={5} compact={true} isAttribute />
                        <StatAdjuster statName="DEX" fieldName="dex" minValue={-4} maxValue={5} compact={true} isAttribute />
                        <StatAdjuster statName="CON" fieldName="con" minValue={-4} maxValue={5} compact={true} isAttribute />
                    </ThemedView>
                    <ThemedView style={[styles.attributeRowContainer, isPhone && { paddingHorizontal: 2, marginVertical: 1 }]}>
                        <StatAdjuster statName="INT" fieldName="int" minValue={-4} maxValue={5} compact={true} isAttribute />
                        <StatAdjuster statName="FOC" fieldName="foc" minValue={-4} maxValue={5} compact={true} isAttribute />
                        <StatAdjuster statName="CHA" fieldName="cha" minValue={-4} maxValue={5} compact={true} isAttribute />
                    </ThemedView>
                </ThemedView>

                {/* Stats Section - Only wrap in separate container for tablet/desktop */}
                {!isPhone && (
                    <ThemedView style={{ flex: 1 }}>
                        <View style={styles.statRow}>
                            <View style={[styles.sectionContainer, { flex: 1, width: isTablet ? 100 : 120, margin: 4 }]}>
                                <View style={[styles.row, { justifyContent: "center" }]}>
                                    <Pressable
                                        style={[styles.condensedButton, styles.secondaryColors, { width: 30, height: 30, padding: 4, marginHorizontal: 8 }]}
                                        onPress={() => handleDamage("hp")}
                                        disabled={base.hitPoints <= 0}
                                    >
                                        <ThemedText style={[styles.description, styles.secondaryText, { fontSize: 12 }]}>
                                            <FaMinus />
                                        </ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.condensedButton, styles.primaryColors, { width: 30, height: 30, padding: 4, marginHorizontal: 8 }]}
                                        onPress={() => handleHeal("hp")}
                                        disabled={base.hitPoints >= base.maxHitPoints}
                                    >
                                        <ThemedText style={[styles.description, styles.primaryText, { fontSize: 12 }]}>
                                            <FaPlus />
                                        </ThemedText>
                                    </Pressable>
                                </View>
                                <Pressable style={[styles.sectionHeaderContainer, { paddingHorizontal: 4 }]} onPress={() => setHpModalVisible(true)}>
                                    <ThemedText style={[styles.description, styles.defaultBold, { fontSize: 16 }]}>HP</ThemedText>
                                    <ThemedText style={[styles.description, { fontSize: 16 }]}>
                                        {base.hitPoints}/{base.maxHitPoints}
                                    </ThemedText>
                                </Pressable>
                                <StatUpgrader statType="hp" visible={hpModalVisible} onClose={() => setHpModalVisible(false)} />
                            </View>
                            <View style={[styles.sectionContainer, { flex: 1, width: isTablet ? 100 : 120, margin: 4 }]}>
                                <View style={[styles.row, { justifyContent: "center" }]}>
                                    <Pressable
                                        style={[styles.condensedButton, styles.secondaryColors, { width: 30, height: 30, padding: 4, marginHorizontal: 8 }]}
                                        onPress={() => handleDamage("energy")}
                                        disabled={base.hitPoints <= 0}
                                    >
                                        <ThemedText style={[styles.description, styles.secondaryText, { fontSize: 12 }]}>
                                            <FaMinus />
                                        </ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.condensedButton, styles.primaryColors, { width: 30, height: 30, padding: 4, marginHorizontal: 8 }]}
                                        onPress={() => handleHeal("energy")}
                                        disabled={base.energy >= base.maxEnergy}
                                    >
                                        <ThemedText style={[styles.description, styles.primaryText, { fontSize: 12 }]}>
                                            <FaPlus />
                                        </ThemedText>
                                    </Pressable>
                                </View>
                                <View>
                                    <Pressable style={[styles.sectionHeaderContainer, { paddingHorizontal: 4 }]} onPress={() => setEnergyModalVisible(true)}>
                                        <ThemedText style={[styles.description, styles.defaultBold, { fontSize: 16 }]}>EP</ThemedText>
                                        <ThemedText style={[styles.description, { fontSize: 16 }]}>
                                            {base.energy}/{base.maxEnergy}
                                        </ThemedText>
                                    </Pressable>
                                </View>
                                <StatUpgrader statType="energy" visible={energyModalVisible} onClose={() => setEnergyModalVisible(false)} />
                            </View>
                            <View style={[styles.sectionContainer, { flex: 1, width: isTablet ? 90 : 100, margin: 4 }]}>
                                <Pressable onPress={() => setEvasionBreakdownModalVisible(true)} style={{ alignItems: "center" }}>
                                    <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>Evasion: {calculateTotalEvasion(character)}</ThemedText>
                                    <ThemedText style={{ fontSize: 14 }}>DR: {calculateTotalDamageReduction(character)}</ThemedText>
                                </Pressable>
                                <ThemedText style={{ fontSize: 12, textAlign: "center" }}>
                                    {character.inventory.armor?.armorClassification ? character.inventory.armor.armorClassification : "No Armor"}
                                </ThemedText>
                            </View>
                            <View style={[styles.sectionContainer, { flex: 1, width: isTablet ? 90 : 100, margin: 4 }]}>
                                <EvasionBreakdownModal
                                    visible={evasionBreakdownModalVisible}
                                    onClose={() => setEvasionBreakdownModalVisible(false)}
                                    character={character}
                                />
                                <StatAdjuster statName="Speed" fieldName="movement" compact={true} />
                            </View>
                        </View>
                    </ThemedView>
                )}
            </ThemedView>

            {/* Mobile Stats Section - Keep existing mobile layout */}
            {isPhone && (
                <ThemedView style={styles.sectionHeaderContainer}>
                    <ThemedView style={styles.sectionHeaderContainer}>
                        {/* Compact Stats Row - HP, EP, AC, Speed */}
                        <View style={styles.statRow}>
                            <View style={[styles.sectionContainer, { flex: 1, width: 60, margin: 4 }]}>
                                <View style={[styles.row, { justifyContent: "center" }]}>
                                    <Pressable
                                        style={[
                                            styles.condensedButton,
                                            styles.secondaryColors,
                                            isPhone && { width: 20, height: 20, padding: 2, marginHorizontal: 2 },
                                        ]}
                                        onPress={() => handleDamage("hp")}
                                        disabled={base.hitPoints <= 0}
                                    >
                                        <ThemedText style={[styles.description, styles.secondaryText, isPhone && { fontSize: 10 }]}>
                                            <FaMinus />
                                        </ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.condensedButton, styles.primaryColors, { width: 20, height: 20, padding: 2, marginHorizontal: 2 }]}
                                        onPress={() => handleHeal("hp")}
                                        disabled={base.hitPoints >= base.maxHitPoints}
                                    >
                                        <ThemedText style={[styles.description, styles.primaryText, isPhone && { fontSize: 10 }]}>
                                            <FaPlus />
                                        </ThemedText>
                                    </Pressable>
                                </View>
                                <Pressable style={[styles.sectionHeaderContainer, { paddingHorizontal: 4 }]} onPress={() => setHpModalVisible(true)}>
                                    <ThemedText style={[styles.description, styles.defaultBold, { fontSize: 10 }]}>HP</ThemedText>
                                    <ThemedText style={[styles.description, { fontSize: 10 }]}>
                                        {base.hitPoints}/{base.maxHitPoints}
                                    </ThemedText>
                                </Pressable>
                                <StatUpgrader statType="hp" visible={hpModalVisible} onClose={() => setHpModalVisible(false)} />
                            </View>
                            <View style={[styles.sectionContainer, { flex: 1, width: 60, margin: 4 }]}>
                                <View style={[styles.row, { justifyContent: "center" }]}>
                                    <Pressable
                                        style={[styles.condensedButton, styles.secondaryColors, { width: 20, height: 20, padding: 2, marginHorizontal: 2 }]}
                                        onPress={() => handleDamage("energy")}
                                        disabled={base.hitPoints <= 0}
                                    >
                                        <ThemedText style={[styles.description, styles.secondaryText, isPhone && { fontSize: 10 }]}>
                                            <FaMinus />
                                        </ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[
                                            styles.condensedButton,
                                            styles.primaryColors,
                                            isPhone && { width: 20, height: 20, padding: 2, marginHorizontal: 2 },
                                        ]}
                                        onPress={() => handleHeal("energy")}
                                        disabled={base.energy >= base.maxEnergy}
                                    >
                                        <ThemedText style={[styles.description, styles.primaryText, isPhone && { fontSize: 10 }]}>
                                            <FaPlus />
                                        </ThemedText>
                                    </Pressable>
                                </View>{" "}
                                <View>
                                    <Pressable style={[styles.sectionHeaderContainer, { paddingHorizontal: 4 }]} onPress={() => setEnergyModalVisible(true)}>
                                        <ThemedText style={[styles.description, styles.defaultBold, { fontSize: 10 }]}>EP</ThemedText>
                                        <ThemedText style={[styles.description, { fontSize: 10 }]}>
                                            {base.energy}/{base.maxEnergy}
                                        </ThemedText>
                                    </Pressable>
                                </View>
                                <StatUpgrader statType="energy" visible={energyModalVisible} onClose={() => setEnergyModalVisible(false)} />
                            </View>
                            {/* Energy with current/max display */}
                            <View style={[styles.sectionContainer, { flex: 1, width: 80, margin: 2 }]}>
                                {/* AC */}
                                <Pressable onPress={() => setEvasionBreakdownModalVisible(true)} style={{ alignItems: "center" }}>
                                    <ThemedText style={{ fontSize: 12, fontWeight: "bold" }}>Evade: {calculateTotalEvasion(character)}</ThemedText>
                                    <ThemedText style={{ fontSize: 12 }}>DR: {calculateTotalDamageReduction(character)}</ThemedText>
                                </Pressable>
                            </View>
                            <View style={[styles.sectionContainer, { flex: 1, width: 80, margin: 2 }]}>
                                <EvasionBreakdownModal
                                    visible={evasionBreakdownModalVisible}
                                    onClose={() => setEvasionBreakdownModalVisible(false)}
                                    character={character}
                                />
                                <StatAdjuster statName="Speed" fieldName="movement" compact={true} />
                            </View>
                        </View>
                    </ThemedView>
                </ThemedView>
            )}
        </ThemedView>
    );
}
