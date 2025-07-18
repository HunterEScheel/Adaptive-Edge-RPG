import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { resetCharacterLoaded } from "@/store/characterAuthSlice";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StatAdjuster } from "../MainPage/StatAdjuster";
import { StatUpgrader } from "../MainPage/StatUpgrader";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { calculateTotalDamageReduction, calculateTotalEvasion } from "../Utility/CalculateTotals";
import { EvasionBreakdownModal } from "./EvasionBreakdownModal";
import { LongRestButton } from "./LongRestButton";
import { SaveButton } from "./SaveButton";
import { BuildPointManager } from "./StatAdjustments/BuildPointManager";
import { EnergyAdjuster } from "./StatAdjustments/EnergyAdjuster";
import { HitpointAdjuster } from "./StatAdjustments/HitpointAdjuster";

export function CharacterHeaderMobile() {
    const styles = useResponsiveStyles();
    const character = useSelector((state: RootState) => state.character);
    const base = useSelector((state: RootState) => state.character.base);
    const dispatch = useDispatch();
    const [hpMaxModalVisible, setHpMaxModalVisible] = useState(false);
    const [hpModalVisible, setHpModalVisible] = useState(false);
    const [energyMaxModalVisible, setEnergyMaxModalVisible] = useState(false);
    const [energyModalVisible, setEnergyModalVisible] = useState(false);
    const [evasionBreakdownModalVisible, setEvasionBreakdownModalVisible] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(base?.name || "");

    useEffect(() => {
        if (base?.name) {
            setNameValue(base.name);
        }
    }, [base?.name]);

    const totalMaxHP = character.base.maxHitPoints;

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
        <ThemedView style={{ marginTop: 30 }}>
            {/* Character Name (Editable) */}
            <View style={[styles.row]}>
                {isEditingName ? (
                    <View style={[styles.inputContainer, styles.row]}>
                        <TextInput style={styles.input} value={nameValue} onChangeText={setNameValue} autoFocus onBlur={handleNameEdit} />
                        <Pressable onPress={handleNameEdit} style={styles.primaryButton}>
                            <ThemedText style={styles.primaryText}>Save</ThemedText>
                        </Pressable>
                    </View>
                ) : (
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <View style={styles.row}>
                            <Pressable style={[styles.defaultButton, styles.primaryColors]} onPress={() => dispatch(resetCharacterLoaded())}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Pressable>
                            <Pressable onPress={handleNameClick}>
                                <ThemedText type="subtitle" style={[styles.input, { paddingVertical: 10 }]}>
                                    {base.name || "Unnamed Character"}
                                    <ThemedText style={styles.primaryText}> ✎</ThemedText>
                                </ThemedText>
                            </Pressable>
                        </View>
                        <View style={styles.row}>
                            <LongRestButton />
                            <SaveButton />
                            <BuildPointManager />
                        </View>
                    </View>
                )}
            </View>
            <ThemedView style={styles.sectionHeaderContainer}>
                {/* Attributes Section */}
                <ThemedView style={[styles.attributeSectionContainer, { paddingVertical: 4 }]}>
                    <ThemedView style={[styles.attributeRowContainer, { paddingHorizontal: 2, marginVertical: 1 }]}>
                        <StatAdjuster statName="POW" fieldName="pow" minValue={-4} maxValue={5} compact={true} isAttribute />
                        <StatAdjuster statName="AGI" fieldName="agi" minValue={-4} maxValue={5} compact={true} isAttribute />
                        <StatAdjuster statName="LOR" fieldName="lor" minValue={-4} maxValue={5} compact={true} isAttribute />
                        <StatAdjuster statName="INS" fieldName="ins" minValue={-4} maxValue={5} compact={true} isAttribute />
                        <StatAdjuster statName="INF" fieldName="inf" minValue={-4} maxValue={5} compact={true} isAttribute />
                    </ThemedView>
                </ThemedView>
            </ThemedView>

            {/* Mobile Stats Section */}
            <ThemedView style={styles.sectionHeaderContainer}>
                <ThemedView style={styles.sectionHeaderContainer}>
                    {/* Compact Stats Row - HP, EP, AC, Speed */}
                    <View style={styles.statRow}>
                        <Pressable style={[styles.sectionContainer, styles.centered, { width: 60, margin: 4 }]} onPress={() => setHpModalVisible(true)}>
                            <ThemedText style={[styles.tabText, styles.defaultBold]}>HP</ThemedText>
                            <ThemedText style={[styles.description, { fontSize: 12 }]}>
                                {base.hitPoints}/{totalMaxHP}
                            </ThemedText>
                            <HitpointAdjuster
                                setMax={() => {
                                    setHpMaxModalVisible(true);
                                    setHpModalVisible(false);
                                }}
                                open={hpModalVisible}
                                onClose={() => setHpModalVisible(false)}
                            />
                            <StatUpgrader statType="hp" visible={hpMaxModalVisible} onClose={() => setHpMaxModalVisible(false)} />
                        </Pressable>
                        <Pressable style={[styles.sectionContainer, styles.centered, { width: 60, margin: 4 }]} onPress={() => setEnergyModalVisible(true)}>
                            <ThemedText style={[styles.tabText, styles.defaultBold]}>EP</ThemedText>
                            <ThemedText style={[styles.description, { fontSize: 12 }]}>
                                {base.energy}/{base.maxEnergy}
                            </ThemedText>
                            <EnergyAdjuster
                                setMax={() => {
                                    setEnergyMaxModalVisible(true);
                                    setEnergyModalVisible(false);
                                }}
                                open={energyModalVisible}
                                onClose={() => setEnergyModalVisible(false)}
                            />
                            <StatUpgrader statType="energy" visible={energyMaxModalVisible} onClose={() => setEnergyMaxModalVisible(false)} />
                        </Pressable>
                        {/* Energy with current/max display */}
                        <View style={[styles.sectionContainer, { width: 80, margin: 2 }]}>
                            {/* AC */}
                            <Pressable onPress={() => setEvasionBreakdownModalVisible(true)} style={{ alignItems: "center" }}>
                                <ThemedText style={[styles.tabText, { fontWeight: "bold" }]}>Evade: {calculateTotalEvasion(character)}</ThemedText>
                                {character.inventory.armor.statUpdates?.damageReduction && (
                                    <ThemedText style={{ fontSize: 12 }}>DR: {calculateTotalDamageReduction(character)}</ThemedText>
                                )}
                            </Pressable>
                        </View>
                        <View style={[{ width: 80, margin: 2 }]}>
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
        </ThemedView>
    );
}
