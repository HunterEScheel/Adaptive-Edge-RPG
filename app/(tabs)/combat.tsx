import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { CombatAttacks } from "@/components/Combat/CombatAttacks";
import { CombatDefense } from "@/components/Combat/CombatDefense";
import { CombatPassives } from "@/components/Combat/CombatPassives";
import { WeaponSkillManager } from "@/components/Combat/WeaponSkillsManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { eItemClassifications, Weapon } from "@/constants/Item";
import { RootState } from "@/store/rootReducer";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";
import { useSelector } from "react-redux";

type TabType = "weapons" | "defensive" | "special";

const unarmed: Weapon = {
    id: "unarmed",
    qty: 1,
    class: eItemClassifications.weapon,
    value: 0,
    name: "Unarmed",
    weaponHeft: "Unarmed",
    weaponType: "Stab",
    attribute: "agi",
    attackBonus: 0,
    damageDiceCount: 1,
    damageDice: 1,
    versatile: false,
    twoHanded: false,
    requiresAttunement: false,
    attunement: false,
    charges: 0,
    maxCharges: 0,
    recharge: false,
};

export default function CombatScreen() {
    const cssStyle = useResponsiveStyles();
    const { isMobile } = useResponsive();
    const character = useSelector((state: RootState) => state.character);
    const [activeTab, setActiveTab] = useState<TabType>("weapons");

    // Get only equipped weapons
    const allWeapons = character.inventory?.weapons || [];
    const equippedWeapons = [...allWeapons].filter((weapon) => weapon.equipped);

    // Calculate attack bonus based on weapon's attribute (str or dex) and weapon skill
    const getAttackBonus = (weapon: Weapon) => {
        const strBonus = character.base.pow || 0;
        const dexBonus = character.base.agi || 0;

        // Use the specified attribute, or fallback to the higher of STR/DEX if not specified
        let attributeBonus = 0;
        if (weapon.attribute === "pow") {
            attributeBonus = Math.max(strBonus, 0); // minimum 0
        } else if (weapon.attribute === "agi") {
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
        const strBonus = character.base.pow || 0;

        // Use damageBonus property instead of attackBonus for damage calculation
        const weaponDamageBonus = (weapon as any).damageBonus || 0;
        return Math.max(strBonus, 0) + weaponDamageBonus;
    };

    // Format attack bonus for display
    const formatAttackBonus = (bonus: number) => {
        return bonus >= 0 ? `+${bonus}` : `${bonus}`;
    };

    const renderDefensiveTab = () => <CombatDefense />;
    // Render content for Weapons tab
    const renderWeaponsTab = () => (
        <View>
            {/* Equipped Weapons Section */}
            <ThemedView style={[cssStyle.container, { margin: 20 }]}>
                <Table>
                    <Row
                        data={["Weapon", "Attack" + (isMobile ? "" : " (Attribute + Skill + Bonus)"), "Damage", "Properties"]}
                        style={[cssStyle.row]}
                        textStyle={[cssStyle.defaultBold, cssStyle.description]}
                    />
                    <Rows
                        data={[unarmed, ...equippedWeapons].map((weapon) => {
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
                                weapon.name,
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

    // Render content for Special tab
    const renderSpecialTab = () => (
        <View>
            <CombatAttacks />
            <CombatPassives />
        </View>
    );

    return (
        <ScrollView style={{ backgroundColor: "#1a1a1a" }}>
            <ThemedView style={[!isMobile && { marginTop: 100 }, { backgroundColor: "#1a1a1a" }]}>
                {/* Tab Navigation */}
                <View style={[cssStyle.row, { borderBottomWidth: 1, borderBottomColor: "#333", backgroundColor: "#222" }]}>
                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "weapons" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                        ]}
                        onPress={() => setActiveTab("weapons")}
                    >
                        <ThemedText style={[cssStyle.subtitle, activeTab === "weapons" && { color: "#2196F3" }]}>Weapons</ThemedText>
                    </Pressable>

                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "defensive" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                        ]}
                        onPress={() => setActiveTab("defensive")}
                    >
                        <ThemedText style={[cssStyle.subtitle, activeTab === "defensive" && { color: "#2196F3" }]}>Defensive</ThemedText>
                    </Pressable>

                    <Pressable
                        style={[
                            { flex: 1, paddingVertical: 12, alignItems: "center" },
                            activeTab === "special" && { borderBottomWidth: 2, borderBottomColor: "#2196F3" },
                        ]}
                        onPress={() => setActiveTab("special")}
                    >
                        <ThemedText style={[cssStyle.subtitle, activeTab === "special" && { color: "#2196F3" }]}>Special</ThemedText>
                    </Pressable>
                </View>

                {/* Tab Content */}
                <View style={{}}>
                    {activeTab === "weapons" && renderWeaponsTab()}
                    {activeTab === "defensive" && renderDefensiveTab()}
                    {activeTab === "special" && renderSpecialTab()}
                </View>
            </ThemedView>
        </ScrollView>
    );
}
