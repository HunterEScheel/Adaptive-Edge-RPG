import { cssStyle } from "@/app/styles/responsive";
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
import { Pressable, ScrollView } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";

export default function CombatScreen() {
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);

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
        const cost = calculateSkillCost(newLevel);
        if (character.base.buildPointsRemaining < cost) {
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
        <ScrollView>
            <ThemedView>
                {/* Defensive Skills Section */}
                <ThemedView style={cssStyle.sectionContainer}>
                    <ThemedText style={cssStyle.sectionHeader}>Defensive Skills</ThemedText>
                    <ThemedView style={cssStyle.headerRow}>
                        {/* Dodge Skill */}
                        <ThemedView style={[cssStyle.compactSkillRow, { flex: 1, marginRight: 8 }]}>
                            <ThemedView style={cssStyle.skillInfo}>
                                <ThemedText style={cssStyle.skillName}>Dodge</ThemedText>
                                <ThemedText style={cssStyle.skillDescription}>Adds to AC</ThemedText>
                                {character.inventory.armor?.armorClassification === "Medium" && (
                                    <ThemedText style={cssStyle.skillPenalty}>Medium Armor: -1</ThemedText>
                                )}
                                {character.inventory.armor?.armorClassification === "Heavy" && (
                                    <ThemedText style={cssStyle.skillPenalty}>Heavy Armor: 0</ThemedText>
                                )}
                            </ThemedView>
                            <ThemedView style={cssStyle.skillControls}>
                                <Pressable
                                    style={[cssStyle.centered, cssStyle.levelButton, cssStyle.dangerButton]}
                                    onPress={() => handleSkillChange("dodge", -1)}
                                >
                                    <ThemedText style={cssStyle.smallButtonText}>-</ThemedText>
                                </Pressable>
                                <ThemedText style={cssStyle.valueText}>{character.skills.dodge || 0}</ThemedText>
                                <Pressable
                                    style={[cssStyle.centered, cssStyle.levelButton, cssStyle.successButton]}
                                    onPress={() => handleSkillChange("dodge", 1)}
                                >
                                    <ThemedText style={cssStyle.smallButtonText}>+</ThemedText>
                                </Pressable>
                            </ThemedView>
                        </ThemedView>

                        {/* Parry Skill */}
                        <ThemedView style={[cssStyle.compactSkillRow, { flex: 1, marginLeft: 8 }]}>
                            <ThemedView style={cssStyle.skillInfo}>
                                <ThemedText style={cssStyle.skillName}>Parry</ThemedText>
                                <ThemedText style={cssStyle.skillDescription}>1 Action (response)</ThemedText>
                                <ThemedText style={cssStyle.skillPenalty}>Subtract 1d4 + {character.skills.parry || 0} from attack</ThemedText>
                            </ThemedView>
                            <ThemedView style={cssStyle.skillControls}>
                                <Pressable
                                    style={[cssStyle.centered, cssStyle.levelButton, cssStyle.dangerButton]}
                                    onPress={() => handleSkillChange("parry", -1)}
                                >
                                    <ThemedText style={cssStyle.smallButtonText}>-</ThemedText>
                                </Pressable>
                                <ThemedText style={cssStyle.valueText}>{character.skills.parry || 0}</ThemedText>
                                <Pressable
                                    style={[cssStyle.centered, cssStyle.levelButton, cssStyle.successButton]}
                                    onPress={() => handleSkillChange("parry", 1)}
                                >
                                    <ThemedText style={cssStyle.smallButtonText}>+</ThemedText>
                                </Pressable>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Equipped Weapons Section */}
                <ThemedView style={cssStyle.sectionContainer}>
                    <ThemedText style={cssStyle.sectionHeader}>Equipped Weapons</ThemedText>
                    <ThemedView style={cssStyle.tableContainer}>
                        <Table style={cssStyle.table}>
                            <Row
                                data={["Weapon", "Attack" + " (Attribute + Skill + Bonus)", "Damage", "Properties"]}
                                style={cssStyle.tableHeader}
                                textStyle={cssStyle.tableHeaderText}
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
                                        [weapon.versatile && "Versatile", weapon.twoHanded && "Two-handed"].filter(Boolean).join(", "),
                                    ];
                                })}
                                style={cssStyle.tableRow}
                                textStyle={cssStyle.tableRowText}
                            />
                        </Table>
                    </ThemedView>
                </ThemedView>

                {/* Weapon Skills Section */}
                <WeaponSkillManager />
                <CombatAttacks />
                <CombatPassives />
            </ThemedView>
        </ScrollView>
    );
}
