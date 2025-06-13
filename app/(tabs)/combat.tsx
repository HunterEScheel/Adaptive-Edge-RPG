import { Collapsible } from "@/components/Collapsible";
import { CombatAttacks } from "@/components/Combat/CombatAttacks";
import { CombatPassives } from "@/components/Combat/CombatPassives";
import { WeaponSkillManager } from "@/components/Combat/WeaponSkillsManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Weapon } from "@/constants/Item";
import { calculateSkillCost } from "@/constants/Skills";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { updateDodge, updateParry } from "@/store/slices/skillsSlice";
import { Pressable, StyleSheet, View } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";

export default function CombatScreen() {
    const character = useSelector((state: RootState) => state.character);
    const dispatch = useDispatch();

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

    const handleDodgeChange = (change: number) => {
        const currentLevel = character.skills.dodge;
        const newLevel = currentLevel + change;

        // Don't allow negative levels
        if (newLevel < 0) return;
        const currentCost = calculateSkillCost(currentLevel);

        const newCost = calculateSkillCost(newLevel);

        // For increases, check if we have enough build points
        // For decreases, we always allow (refunding points)
        if (change > 0 && newCost > character.base.buildPointsRemaining) {
            return; // Not enough build points
        }

        dispatch(updateDodge(newLevel));
        if (change > 0) {
            dispatch(
                updateMultipleFields([
                    { field: "buildPointsRemaining", value: character.base.buildPointsRemaining - newCost },
                    { field: "buildPointsSpent", value: character.base.buildPointsSpent + newCost },
                ])
            );
        } else {
            dispatch(
                updateMultipleFields([
                    { field: "buildPointsRemaining", value: character.base.buildPointsRemaining + currentCost },
                    { field: "buildPointsSpent", value: character.base.buildPointsSpent - currentCost },
                ])
            );
        }
    };
    const handleParryChange = (change: number) => {
        const currentLevel = character.skills.parry;
        const newLevel = currentLevel + change;

        // Don't allow negative levels
        if (newLevel < 0) return;

        const currentCost = calculateSkillCost(currentLevel);
        const newCost = calculateSkillCost(newLevel);
        const costDifference = newCost - currentCost;

        // For increases, check if we have enough build points
        // For decreases, we always allow (refunding points)
        if (change > 0 && costDifference > character.base.buildPointsRemaining) {
            return; // Not enough build points
        }

        dispatch(updateParry(newLevel));

        dispatch(
            updateMultipleFields([
                { field: "buildPointsRemaining", value: character.base.buildPointsRemaining - costDifference },
                { field: "buildPointsSpent", value: character.base.buildPointsSpent + costDifference },
            ])
        );
    };

    return (
        <ThemedView style={styles.container}>
            <IconSymbol size={110} color="#808080" name="burst.fill" style={styles.headerImage} />
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Combat</ThemedText>
            </ThemedView>
            <ThemedView style={styles.defensiveSkillsContainer}>
                {/* Dodge Skill */}
                <ThemedView style={styles.compactSkillRow}>
                    <ThemedView style={styles.skillInfo}>
                        <ThemedText style={styles.skillName}>Dodge</ThemedText>
                        <ThemedText style={styles.skillDescription}>Adds to AC</ThemedText>
                        <ThemedText style={styles.skillPenalty}>
                            {character.inventory.armor?.armorClassification === "Medium" ? "Medium Armor: -1" : ""}
                            {character.inventory.armor?.armorClassification === "Heavy" ? "Heavy Armor: 0" : ""}
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.skillControls}>
                        <Pressable
                            style={[styles.levelButton, styles.decreaseButton]}
                            onPress={() => handleDodgeChange(-1)}
                            disabled={character.skills.dodge <= 0}
                        >
                            <ThemedText style={styles.levelButtonText}>-</ThemedText>
                        </Pressable>
                        <ThemedText style={styles.skillLevel}>{character.skills.dodge}</ThemedText>
                        <Pressable style={[styles.levelButton, styles.increaseButton]} onPress={() => handleDodgeChange(1)}>
                            <ThemedText style={styles.levelButtonText}>+</ThemedText>
                        </Pressable>
                    </ThemedView>
                </ThemedView>

                {/* Parry Skill */}
                <ThemedView style={styles.compactSkillRow}>
                    <ThemedView style={styles.skillInfo}>
                        <ThemedText style={styles.skillName}>Parry</ThemedText>
                        <ThemedText style={styles.skillDescription}>1 Action (response)</ThemedText>
                        <ThemedText style={styles.skillPenalty}>Subtract 1d4 + {character.skills.parry} from attack</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.skillControls}>
                        <Pressable
                            style={[styles.levelButton, styles.decreaseButton]}
                            onPress={() => handleParryChange(-1)}
                            disabled={character.skills.parry <= 0}
                        >
                            <ThemedText style={styles.levelButtonText}>-</ThemedText>
                        </Pressable>
                        <ThemedText style={styles.skillLevel}>{character.skills.parry}</ThemedText>
                        <Pressable style={[styles.levelButton, styles.increaseButton]} onPress={() => handleParryChange(1)}>
                            <ThemedText style={styles.levelButtonText}>+</ThemedText>
                        </Pressable>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.tableContainer}>
                <Table style={styles.table}>
                    <Row
                        data={["Weapon", "Attack" + " (Attribute + Skill + Bonus)", "Damage", "Properties"]}
                        style={styles.tableHeader}
                        textStyle={styles.tableHeaderText}
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
                        style={styles.tableRow}
                        textStyle={styles.tableRowText}
                    />
                </Table>
            </ThemedView>

            <WeaponSkillManager />

            <Collapsible title="Combat Abilities">
                <CombatAttacks />
            </Collapsible>

            {/* Weapons Section */}
            <Collapsible title="Weapons">
                {equippedWeapons.length > 0 ? (
                    <View style={styles.tableContainer}>
                        <ThemedText style={styles.helpText}>Only equipped weapons are shown here. Manage weapons in the Inventory tab.</ThemedText>
                    </View>
                ) : (
                    <ThemedText style={styles.emptyText}>No equipped weapons. Equip weapons from the Inventory tab.</ThemedText>
                )}
            </Collapsible>

            {/* Passives Section */}
            <Collapsible title="Passives">
                <CombatPassives />
            </Collapsible>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerImage: {
        color: "#808080",
        position: "absolute",
        bottom: 0,
        left: 0,
        opacity: 0.3,
    },
    titleContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    sectionText: {
        marginVertical: 10,
    },
    emptyText: {
        fontStyle: "italic",
        color: "#888",
        padding: 10,
    },
    helpText: {
        fontStyle: "italic",
        color: "#888",
        padding: 10,
        fontSize: 12,
        textAlign: "center",
        marginTop: 5,
    },
    defensiveSkillsContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
    },
    compactSkillRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    skillInfo: {
        flex: 1,
        justifyContent: "center",
    },
    skillName: {
        fontSize: 16,
        fontWeight: "500",
    },
    skillDescription: {
        fontSize: 12,
        color: "#666",
    },
    skillPenalty: {
        fontSize: 12,
        color: "#666",
    },
    skillControls: {
        flexDirection: "row",
        alignItems: "center",
    },
    skillLevel: {
        fontSize: 18,
        fontWeight: "bold",
        minWidth: 30,
        textAlign: "center",
    },
    levelButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    decreaseButton: {
        backgroundColor: "#e74c3c",
    },
    increaseButton: {
        backgroundColor: "#2ecc71",
    },
    levelButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    tableContainer: {
        marginTop: 10,
        borderRadius: 8,
        overflow: "hidden",
    },
    table: {
        width: "100%",
    },
    tableHeader: {
        height: 40,
        backgroundColor: "#f0f0f0",
    },
    tableHeaderText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#333",
    },
    tableRow: {
        height: 40,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    tableRowText: {
        textAlign: "center",
        color: "#444",
    },
});
