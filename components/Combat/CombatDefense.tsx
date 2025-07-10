import React from "react";
import { Pressable, View } from "react-native";

import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { calculateSkillCost } from "@/constants/Skills";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { damageArmor, repairArmor } from "@/store/slices/inventorySlice";
import { updateDodge, updateParry } from "@/store/slices/skillsSlice";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { calculateTotalDamageReduction } from "../Utility/CalculateTotals";

export function CombatDefense() {
    const cssStyle = useResponsiveStyles();
    const character = useSelector((state: RootState) => state.character);
    const { isMobile, responsiveStyle } = useResponsive();
    const dispatch = useDispatch();
    const currentShield = character.inventory?.shield;
    // Handle skill level changes
    const handleSkillChange = (skillName: "dodge" | "parry", delta: number) => {
        const currentLevel = character.skills[skillName] || 0;
        const newLevel = Math.max(0, currentLevel + delta);
        const currentCost = calculateSkillCost(currentLevel);
        let cost = currentLevel > newLevel ? -currentCost : calculateSkillCost(newLevel);
        if (character.base.buildPointsRemaining < cost && cost > currentCost) {
            alert(`Not enough build points to upgrade ${skillName}. Need ${cost} more.`);
            return;
        } else {
            dispatch(
                updateMultipleFields([
                    { field: "buildPointsRemaining", value: character.base.buildPointsRemaining - cost },
                    { field: "buildPointsSpent", value: character.base.buildPointsSpent + cost },
                ])
            );
            skillName === "dodge" ? dispatch(updateDodge(newLevel)) : dispatch(updateParry(newLevel));
        }
    };

    return (
        <View>
            <ThemedView
                style={[
                    cssStyle.container,
                    responsiveStyle(
                        { flexDirection: "column" }, // Phone: stack vertically
                        { flexDirection: "row", justifyContent: "space-between", gap: 16 } // Tablet/Desktop: side-by-side
                    ),
                ]}
            >
                {/* Dodge Skill */}
                <ThemedView style={[cssStyle.row, { justifyContent: "space-around" }]}>
                    <ThemedView style={[cssStyle.sectionContainer]}>
                        <ThemedView style={[cssStyle.containerColors, { padding: 8, backgroundColor: "transparent" }]}>
                            <ThemedText style={[cssStyle.skillName, { textAlign: "center" }]}>Dodge</ThemedText>
                        </ThemedView>
                        <ThemedView style={[cssStyle.containerColors, { flexDirection: "row", alignItems: "center", backgroundColor: "transparent" }]}>
                            <Pressable
                                style={[cssStyle.defaultButton, cssStyle.secondaryColors, { paddingVertical: 5 }]}
                                onPress={() => handleSkillChange("dodge", -1)}
                            >
                                <ThemedText style={cssStyle.secondaryText}>-</ThemedText>
                            </Pressable>
                            <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>{character.skills.dodge || 0}</ThemedText>
                            <Pressable
                                style={[cssStyle.defaultButton, cssStyle.primaryColors, { paddingVertical: 5 }]}
                                onPress={() => handleSkillChange("dodge", 1)}
                            >
                                <ThemedText style={cssStyle.primaryText}>+</ThemedText>
                            </Pressable>
                        </ThemedView>
                    </ThemedView>

                    {/* Parry Skill */}
                    <ThemedView style={[cssStyle.sectionContainer, { paddingVertical: 8 }]}>
                        <ThemedView style={[{ padding: 8, backgroundColor: "transparent" }]}>
                            <ThemedText style={[cssStyle.skillName, { textAlign: "center" }]}>
                                Parry {currentShield && `(+${currentShield.parryBonus} shield)`}
                            </ThemedText>
                        </ThemedView>
                        <ThemedView
                            style={[
                                cssStyle.containerColors,
                                { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "transparent" },
                            ]}
                        >
                            <Pressable
                                style={[cssStyle.defaultButton, cssStyle.secondaryColors, { paddingVertical: 5 }]}
                                onPress={() => handleSkillChange("parry", -1)}
                            >
                                <ThemedText style={cssStyle.secondaryText}>-</ThemedText>
                            </Pressable>
                            <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>
                                {(character.skills.parry || 0) + (currentShield?.parryBonus || 0)}
                            </ThemedText>
                            <Pressable
                                style={[cssStyle.defaultButton, cssStyle.primaryColors, { paddingVertical: 5 }]}
                                onPress={() => handleSkillChange("parry", 1)}
                            >
                                <ThemedText style={cssStyle.primaryText}>+</ThemedText>
                            </Pressable>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
                {character.inventory.armor.statUpdates && (
                    <ThemedView style={[cssStyle.sectionContainer, { paddingVertical: 8, justifyContent: "center", alignItems: "center" }]}>
                        <ThemedView style={[{ padding: 4, borderRadius: 4 }]}>
                            <ThemedText style={[cssStyle.skillName, { textAlign: "center" }]}>Armor: {character.inventory.armor.name}</ThemedText>
                        </ThemedView>
                        <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>
                            Damage Reduction: {calculateTotalDamageReduction(character)}
                        </ThemedText>
                        <ThemedText style={[cssStyle.description, { marginHorizontal: 16, marginBottom: 8 }]}>
                            Threshold: {character.inventory.armor.statUpdates?.threshold}
                        </ThemedText>
                        <ThemedText style={[cssStyle.skillName, { justifyContent: "center", textAlign: "center" }]}>Durability</ThemedText>
                        <ThemedView style={[cssStyle.row, { justifyContent: "center", backgroundColor: "transparent" }]}>
                            <Pressable
                                style={[cssStyle.defaultButton, cssStyle.secondaryColors, { paddingVertical: 5 }]}
                                onPress={() => dispatch(damageArmor())}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </Pressable>
                            <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>
                                {character.inventory.armor.statUpdates?.durability}
                            </ThemedText>
                            <Pressable style={[cssStyle.defaultButton, cssStyle.primaryColors, { paddingVertical: 5 }]} onPress={() => dispatch(repairArmor())}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Pressable>
                        </ThemedView>
                    </ThemedView>
                )}
            </ThemedView>
        </View>
    );
}
