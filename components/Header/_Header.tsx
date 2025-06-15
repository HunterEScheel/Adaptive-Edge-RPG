import { useResponsive } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StatAdjuster } from "../MainPage/StatAdjuster";
import { StatUpgrader } from "../MainPage/StatUpgrader";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { calculateTotalAC } from "../Utility/CalculateTotals";
import { ACBreakdownModal } from "./ACBreakdownModal";
import { BuildPointManager } from "./BuildPointManager";
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
    const { styles } = useResponsive();
    const character = useSelector((state: RootState) => state.character);
    const base = useSelector((state: RootState) => state.character.base);
    const dispatch = useDispatch();
    const [hpModalVisible, setHpModalVisible] = useState(false);
    const [energyModalVisible, setEnergyModalVisible] = useState(false);
    const [acBreakdownModalVisible, setAcBreakdownModalVisible] = useState(false);
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
            <View style={styles.container}>
                <ThemedText>Loading...</ThemedText>
            </View>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.row}>
                {/* Character Name (Editable) */}
                <View style={[styles.container, styles.row]}>
                    {isEditingName ? (
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} value={nameValue} onChangeText={setNameValue} autoFocus onBlur={handleNameEdit} />
                        </View>
                    ) : (
                        <Pressable onPress={handleNameClick}>
                            <ThemedText type="subtitle" style={styles.input}>
                                {base.name || "Unnamed Character"}
                                <ThemedText style={styles.primaryText}> ✎</ThemedText>
                            </ThemedText>
                        </Pressable>
                    )}
                </View>

                {/* Header Actions */}
                <View style={styles.row}>
                    <LongRestButton compact={true} />
                    <View style={[styles.defaultButton, styles.primaryColors]}>
                        <SaveButton compact={true} />
                    </View>
                    <PresetManagerButton compact={true} />
                    <BuildPointManager compact={true} />
                </View>
            </View>

            {/* Left Side - Ability Scores */}
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <StatAdjuster statName="STR" fieldName="str" minValue={-4} maxValue={5} compact={true} />
                    <StatAdjuster statName="DEX" fieldName="dex" minValue={-4} maxValue={5} compact={true} />
                    <StatAdjuster statName="CON" fieldName="con" minValue={-4} maxValue={5} compact={true} />
                </View>
                <View style={styles.row}>
                    <StatAdjuster statName="INT" fieldName="int" minValue={-4} maxValue={5} compact={true} />
                    <StatAdjuster statName="WIS" fieldName="wis" minValue={-4} maxValue={5} compact={true} />
                    <StatAdjuster statName="CHA" fieldName="cha" minValue={-4} maxValue={5} compact={true} />
                </View>
            </View>

            {/* Right Side - Character Stats */}
            <View style={styles.container}>
                <View style={styles.row}>
                    {/* HP with current/max display */}
                    <View style={[styles.container, styles.row]}>
                        <ThemedText style={styles.subtitle}>HP</ThemedText>
                        <View style={[styles.container, styles.row]}>
                            <Pressable
                                style={[styles.defaultButton, styles.primaryColors]}
                                onPress={() => handleHeal("hp")}
                                disabled={base.hitPoints >= base.maxHitPoints}
                            >
                                <ThemedText style={[styles.description, styles.primaryText]}>HEAL</ThemedText>
                            </Pressable>
                            <ThemedText style={styles.description}>{base.hitPoints}</ThemedText>
                            <Pressable style={[styles.defaultButton, styles.secondaryColors]} onPress={() => handleDamage("hp")} disabled={base.hitPoints <= 0}>
                                <ThemedText style={[styles.description, styles.secondaryText]}>DAMAGE</ThemedText>
                            </Pressable>
                        </View>
                        <ThemedText style={styles.statLabel}>/</ThemedText>
                        <Pressable onPress={() => setHpModalVisible(true)} style={styles.primaryButton}>
                            <ThemedText style={styles.statLabel}>{base.maxHitPoints}</ThemedText>
                        </Pressable>
                        <StatUpgrader statType="hp" visible={hpModalVisible} onClose={() => setHpModalVisible(false)} />
                    </View>
                </View>
                {/* Energy with current/max display */}
                <View style={[styles.statContainer]}>
                    <ThemedText style={styles.statLabel}>Energy</ThemedText>
                    <View style={styles.currentValueContainer}>
                        <Pressable
                            style={[styles.centered, styles.primaryButton]}
                            onPress={() => handleHeal("energy")}
                            disabled={base.energy >= base.maxEnergy}
                        >
                            <ThemedText style={styles.description}>ABSORB</ThemedText>
                        </Pressable>
                        <ThemedText style={styles.valueText}>{base.energy}</ThemedText>
                        <Pressable style={[styles.centered, styles.secondaryButton]} onPress={() => handleDamage("energy")} disabled={base.energy <= 0}>
                            <ThemedText style={styles.description}>EXPEND</ThemedText>
                        </Pressable>
                        <ThemedText style={styles.description}>/</ThemedText>
                        <Pressable onPress={() => setEnergyModalVisible(true)} style={styles.primaryColors}>
                            <ThemedText style={[styles.primaryText, styles.description]}>{base.maxEnergy}</ThemedText>
                        </Pressable>
                        <StatUpgrader statType="energy" visible={energyModalVisible} onClose={() => setEnergyModalVisible(false)} />
                    </View>
                    {/* AC */}
                    <View style={[styles.statContainer, styles.centered]}>
                        <Pressable onPress={() => setAcBreakdownModalVisible(true)}>
                            <ThemedText>AC: {calculateTotalAC(character)}</ThemedText>
                        </Pressable>
                        <ThemedText>
                            {character.inventory.armor?.armorClassification ? character.inventory.armor.armorClassification + " Armor" : ""}
                        </ThemedText>
                        <ACBreakdownModal visible={acBreakdownModalVisible} onClose={() => setAcBreakdownModalVisible(false)} character={character} />
                    </View>

                    {/* Speed */}
                    <View style={[styles.statContainer, styles.centered]}>
                        <StatAdjuster statName="Speed" fieldName="movement" compact={true} />
                    </View>
                </View>
            </View>
        </ThemedView>
    );
}
