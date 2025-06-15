import { cssStyle } from "@/app/styles/phone";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
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

export function CharacterHeader() {
    const character = useSelector((state: RootState) => state.character);
    const base = useSelector((state: RootState) => state.character.base);
    const dispatch = useDispatch();
    const [hpModalVisible, setHpModalVisible] = useState(false);
    const [energyModalVisible, setEnergyModalVisible] = useState(false);
    const [acBreakdownModalVisible, setAcBreakdownModalVisible] = useState(false);

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState("");

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
            <View style={cssStyle.container}>
                <ThemedText>Loading...</ThemedText>
            </View>
        );
    }

    return (
        <ThemedView style={cssStyle.container}>
            <View style={cssStyle.headerRow}>
                {/* Character Name (Editable) */}
                <View style={[cssStyle.costInfoContainer]}>
                    {isEditingName ? (
                        <View style={cssStyle.skillNameContainer}>
                            <TextInput style={cssStyle.input} value={nameValue} onChangeText={setNameValue} autoFocus onBlur={handleNameEdit} />
                        </View>
                    ) : (
                        <Pressable onPress={handleNameClick}>
                            <ThemedText type="subtitle" style={cssStyle.input}>
                                {base.name || "Unnamed Character"}
                                <ThemedText style={cssStyle.iconStyle}> ✎</ThemedText>
                            </ThemedText>
                        </Pressable>
                    )}
                </View>

                {/* Header Actions */}
                <View style={cssStyle.itemHeader}>
                    <LongRestButton compact={true} />
                    <View style={cssStyle.primaryButton}>
                        <SaveButton compact={true} />
                    </View>
                    <PresetManagerButton compact={true} />
                    <BuildPointManager compact={true} />
                </View>
            </View>

            <View style={cssStyle.container}>
                {/* Left Side - Ability Scores */}
                <View style={cssStyle.formContentContainer}>
                    <View style={cssStyle.attributeRow}>
                        <StatAdjuster statName="STR" fieldName="str" minValue={-4} maxValue={5} compact={true} />
                        <StatAdjuster statName="DEX" fieldName="dex" minValue={-4} maxValue={5} compact={true} />
                        <StatAdjuster statName="CON" fieldName="con" minValue={-4} maxValue={5} compact={true} />
                    </View>
                    <View style={cssStyle.attributeRow}>
                        <StatAdjuster statName="INT" fieldName="int" minValue={-4} maxValue={5} compact={true} />
                        <StatAdjuster statName="WIS" fieldName="wis" minValue={-4} maxValue={5} compact={true} />
                        <StatAdjuster statName="CHA" fieldName="cha" minValue={-4} maxValue={5} compact={true} />
                    </View>
                </View>

                {/* Right Side - Character Stats */}
                <View style={cssStyle.container}>
                    <View style={cssStyle.formRow}>
                        {/* HP with current/max display */}
                        <View style={[cssStyle.statContainer, cssStyle.tableHeader]}>
                            <ThemedText style={cssStyle.statLabel}>HP</ThemedText>
                            <View style={[cssStyle.statContainer, cssStyle.row]}>
                                <View style={cssStyle.currentValueContainer}>
                                    <Pressable
                                        style={[cssStyle.button, cssStyle.primaryButton]}
                                        onPress={() => handleHeal("hp")}
                                        disabled={base.hitPoints >= base.maxHitPoints}
                                    >
                                        <ThemedText style={cssStyle.bodyText}>HEAL</ThemedText>
                                    </Pressable>
                                    <ThemedText style={cssStyle.headerText}>{base.hitPoints}</ThemedText>
                                    <Pressable
                                        style={[cssStyle.button, cssStyle.secondaryButton]}
                                        onPress={() => handleDamage("hp")}
                                        disabled={base.hitPoints <= 0}
                                    >
                                        <ThemedText style={cssStyle.bodyText}>DAMAGE</ThemedText>
                                    </Pressable>
                                </View>
                                <ThemedText style={cssStyle.statLabel}>/</ThemedText>
                                <Pressable onPress={() => setHpModalVisible(true)} style={cssStyle.primaryButton}>
                                    <ThemedText style={cssStyle.statLabel}>{base.maxHitPoints}</ThemedText>
                                </Pressable>
                                <StatUpgrader statType="hp" visible={hpModalVisible} onClose={() => setHpModalVisible(false)} />
                            </View>
                        </View>
                        {/* Energy with current/max display */}
                        <View style={[cssStyle.statContainer]}>
                            <ThemedText style={cssStyle.statLabel}>Energy</ThemedText>
                            <View style={cssStyle.currentValueContainer}>
                                <Pressable
                                    style={[cssStyle.centered, cssStyle.primaryButton]}
                                    onPress={() => handleHeal("energy")}
                                    disabled={base.energy >= base.maxEnergy}
                                >
                                    <ThemedText style={cssStyle.bodyText}>ABSORB</ThemedText>
                                </Pressable>
                                <ThemedText style={cssStyle.valueText}>{base.energy}</ThemedText>
                                <Pressable
                                    style={[cssStyle.centered, cssStyle.secondaryButton]}
                                    onPress={() => handleDamage("energy")}
                                    disabled={base.energy <= 0}
                                >
                                    <ThemedText style={cssStyle.bodyText}>EXPEND</ThemedText>
                                </Pressable>
                            </View>
                            <ThemedText style={cssStyle.bodyText}>/</ThemedText>
                            <Pressable onPress={() => setEnergyModalVisible(true)} style={cssStyle.primaryButton}>
                                <ThemedText style={[cssStyle.valueText]}>{base.maxEnergy}</ThemedText>
                            </Pressable>
                            <StatUpgrader statType="energy" visible={energyModalVisible} onClose={() => setEnergyModalVisible(false)} />
                        </View>
                        {/* AC */}
                        <View style={[cssStyle.statContainer, cssStyle.centered]}>
                            <Pressable onPress={() => setAcBreakdownModalVisible(true)}>
                                <ThemedText>AC: {calculateTotalAC(character)}</ThemedText>
                            </Pressable>
                            <ThemedText>
                                {character.inventory.armor?.armorClassification ? character.inventory.armor.armorClassification + " Armor" : ""}
                            </ThemedText>
                            <ACBreakdownModal visible={acBreakdownModalVisible} onClose={() => setAcBreakdownModalVisible(false)} character={character} />
                        </View>

                        {/* Speed */}
                        <View style={[cssStyle.statContainer, cssStyle.centered]}>
                            <StatAdjuster statName="Speed" fieldName="movement" compact={true} />
                        </View>
                    </View>
                </View>
            </View>
        </ThemedView>
    );
}
