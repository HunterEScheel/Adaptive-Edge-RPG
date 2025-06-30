import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { app_theme } from "@/app/styles/theme";
import { CombatAttacks } from "@/components/Combat/CombatAttacks";
import { CombatPassives } from "@/components/Combat/CombatPassives";
import { WeaponSkillManager } from "@/components/Combat/WeaponSkillsManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Weapon } from "@/constants/Item";
import { calculateSkillCost } from "@/constants/Skills";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { updateDodge, updateParry } from "@/store/slices/skillsSlice";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTab: {
        borderBottomColor: app_theme.primary_component_bg,
    },
    tabText: {
        fontSize: 16,
        color: "#999",
    },
    activeTabText: {
        color: app_theme.primary_component_text,
        fontWeight: "bold",
    },
});

type TabType = "weapons" | "defensive" | "special";

export default function CombatScreen() {
    const cssStyle = useResponsiveStyles();
    const { isMobile, responsiveStyle } = useResponsive();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const [activeTab, setActiveTab] = useState<TabType>("weapons");

    // Get only equipped weapons
    const allWeapons = character.inventory?.weapons || [];
    const equippedWeapons = allWeapons.filter((weapon) => weapon.equipped);

    // Calculate attack bonus based on weapon's attribute (str or dex) and weapon skill
    const getAttackBonus = (weapon: Weapon) => {
        const strBonus = character.base.str || 0;
        const dexBonus = character.base.dex || 0;

        // Use the specified attribute, or fallback to the higher of STR/DEX if not specified
        let attributeBonus = 0;
        if (weapon.attribute === "str") {
            attributeBonus = Math.max(strBonus, 0); // minimum 0
        } else if (weapon.attribute === "dex") {
            attributeBonus = Math.max(dexBonus, 0); // minimum 0
        } else {
            attributeBonus = Math.max(strBonus, dexBonus, 0); // fallback to higher stat, minimum 0
        }

        // Find matching weapon skill based on weapon classification
        let weaponSkillBonus = 0;
        if (weapon.weaponHeft && weapon.weaponType && character.skills?.weaponSkills) {
            const matchingSkill = character.skills.weaponSkills.find(
                (skill) => skill.weaponHeft === weapon.weaponHeft && skill.weaponType === weapon.weaponType
            );
            if (matchingSkill) {
                weaponSkillBonus = matchingSkill.level || 0;
            }
        }

        const weaponBonus = weapon.attackBonus || 0;
        return attributeBonus + weaponSkillBonus + weaponBonus;
    };

    // Calculate damage bonus based on STR, weapon skill, and weapon's damage modifier
    const getDamageBonus = (weapon: Weapon) => {
        const strBonus = character.base.str || 0;

        // Use damageBonus property instead of attackBonus for damage calculation
        const weaponDamageBonus = (weapon as any).damageBonus || 0;
        return Math.max(strBonus, 0) + weaponDamageBonus;
    };

    // Format attack bonus for display
    const formatAttackBonus = (bonus: number) => {
        return bonus >= 0 ? `+${bonus}` : `${bonus}`;
    };

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

    // Render content for Weapons tab
    const renderWeaponsTab = () => (
        <View>
            {/* Equipped Weapons Section */}
            <ThemedView style={[cssStyle.container, { margin: 20 }]}>
                <Table>
                    <Row
                        data={["Weapon", "Attack" + isMobile ? "" : " (Attribute + Skill + Bonus)", "Damage", "Properties"]}
                        style={[cssStyle.row]}
                        textStyle={[cssStyle.defaultBold, cssStyle.description]}
                    />
                    <Rows
                        data={equippedWeapons.map((weapon) => {
                            // Convert enum value to actual die type (d4, d6, etc.)
                            let diceType = "d4";
                            switch (weapon.damageDice) {
                                case 1:
                                    diceType = "d4";
                                    break;
                                case 2:
                                    diceType = "d6";
                                    break;
                                case 3:
                                    diceType = "d8";
                                    break;
                                case 4:
                                    diceType = "d10";
                                    break;
                                case 5:
                                    diceType = "d12";
                                    break;
                                case 6:
                                    diceType = "d20";
                                    break;
                                default:
                                    diceType = `d${weapon.damageDice}`; // Fallback
                            }

                            return [
                                weapon.name + ": " + weapon.weaponHeft + " - " + weapon.weaponType,
                                formatAttackBonus(getAttackBonus(weapon)),
                                `${weapon.damageDiceCount}${diceType} ${formatAttackBonus(getDamageBonus(weapon))}`,
                                [weapon.versatile && "V", weapon.twoHanded && "Two-handed"].filter(Boolean).join(", "),
                            ];
                        })}
                        style={cssStyle.row}
                        textStyle={cssStyle.description}
                    />
                </Table>
            </ThemedView>

            {/* Weapon Skills Section */}
            <WeaponSkillManager />
        </View>
    );

    // Render content for Defensive tab
    const renderDefensiveTab = () => (
        <View>
            <ThemedText style={[cssStyle.subtitle, { textAlign: "center" }]}>Defensive Skills</ThemedText>
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
                        <ThemedView style={[cssStyle.containerColors, { padding: 8 }]}>
                            <ThemedText style={[cssStyle.skillName, { textAlign: "center" }]}>Dodge</ThemedText>
                        </ThemedView>
                        <ThemedView style={[cssStyle.containerColors, { flexDirection: "row", alignItems: "center" }]}>
                            <Pressable style={[cssStyle.defaultButton, cssStyle.secondaryColors]} onPress={() => handleSkillChange("dodge", -1)}>
                                <ThemedText style={cssStyle.secondaryText}>-</ThemedText>
                            </Pressable>
                            <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>{character.skills.dodge || 0}</ThemedText>
                            <Pressable style={[cssStyle.defaultButton, cssStyle.primaryColors]} onPress={() => handleSkillChange("dodge", 1)}>
                                <ThemedText style={cssStyle.primaryText}>+</ThemedText>
                            </Pressable>
                        </ThemedView>
                    </ThemedView>

                    {/* Parry Skill */}
                    <ThemedView style={[cssStyle.sectionContainer, { paddingVertical: 8 }]}>
                        <ThemedView style={[cssStyle.containerColors, { padding: 8 }]}>
                            <ThemedText style={[cssStyle.skillName, { textAlign: "center" }]}>Parry</ThemedText>
                        </ThemedView>
                        <ThemedView style={[cssStyle.containerColors, { flexDirection: "row", alignItems: "center" }]}>
                            <Pressable style={[cssStyle.defaultButton, cssStyle.secondaryColors]} onPress={() => handleSkillChange("parry", -1)}>
                                <ThemedText style={cssStyle.secondaryText}>-</ThemedText>
                            </Pressable>
                            <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>{character.skills.parry || 0}</ThemedText>
                            <Pressable style={[cssStyle.defaultButton, cssStyle.primaryColors]} onPress={() => handleSkillChange("parry", 1)}>
                                <ThemedText style={cssStyle.primaryText}>+</ThemedText>
                            </Pressable>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </View>
    );

    // Render content for Special tab
    const renderSpecialTab = () => (
        <View>
            <CombatAttacks />
            <CombatPassives />
        </View>
    );

    return (
        <ScrollView style={{ backgroundColor: "#1a1a1a", flex: 1 }}>
            <ThemedView style={[!isMobile && { marginTop: 100 }, { backgroundColor: "#1a1a1a" }]}>
                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <Pressable style={[styles.tab, activeTab === "weapons" && styles.activeTab]} onPress={() => setActiveTab("weapons")}>
                        <ThemedText style={[styles.tabText, activeTab === "weapons" && styles.activeTabText]}>Weapons</ThemedText>
                    </Pressable>
                    <Pressable style={[styles.tab, activeTab === "defensive" && styles.activeTab]} onPress={() => setActiveTab("defensive")}>
                        <ThemedText style={[styles.tabText, activeTab === "defensive" && styles.activeTabText]}>Defensive</ThemedText>
                    </Pressable>
                    <Pressable style={[styles.tab, activeTab === "special" && styles.activeTab]} onPress={() => setActiveTab("special")}>
                        <ThemedText style={[styles.tabText, activeTab === "special" && styles.activeTabText]}>Special</ThemedText>
                    </Pressable>
                </View>

                {/* Tab Content */}
                <View style={{ flex: 1 }}>
                    {activeTab === "weapons" && renderWeaponsTab()}
                    {activeTab === "defensive" && renderDefensiveTab()}
                    {activeTab === "special" && renderSpecialTab()}
                </View>
            </ThemedView>
        </ScrollView>
    );
}
