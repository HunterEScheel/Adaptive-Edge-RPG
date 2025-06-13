import { Collapsible } from "@/components/Collapsible";
import { CombatAttacks } from "@/components/Combat/CombatAttacks";
import { CombatPassives } from "@/components/Combat/CombatPassives";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Weapon } from "@/constants/Item";
import { RootState } from "@/store/rootReducer";
import { updateDodge, updateParry } from "@/store/slices/skillsSlice";
import { Pressable, StyleSheet, View } from "react-native";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";

export default function CombatScreen() {
  const character = useSelector((state: RootState) => state.character);
  const dispatch = useDispatch();

  // Get only equipped weapons
  const allWeapons = character.inventory?.weapons || [];
  const equippedWeapons = allWeapons.filter((weapon) => weapon.equipped);

  // Calculate attack bonus based on weapon's attribute (str or dex)
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

    const weaponBonus = weapon.attackBonus || 0;
    return attributeBonus + weaponBonus;
  };

  // Calculate damage bonus based on STR plus weapon's damage modifier
  const getDamageBonus = (weapon: Weapon) => {
    const strBonus = character.base.str || 0;
    const weaponBonus = weapon.attackBonus || 0;
    return Math.max(strBonus, 0) + weaponBonus; // Minimum 0 for STR + weapon bonus
  };

  // Format attack bonus for display
  const formatAttackBonus = (bonus: number) => {
    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  };

  const handleDodgeChange = (change: number) => {
    dispatch(updateDodge(character.skills.dodge + change));
  };

  const handleParryChange = (change: number) => {
    dispatch(updateParry(character.skills.parry + change));
  };

  return (
    <ThemedView style={styles.container}>
      <IconSymbol size={110} color="#808080" name="burst.fill" style={styles.headerImage} />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Combat</ThemedText>
      </ThemedView>

      {/* Defensive Skills Section */}
      <Collapsible title="Defensive Skills">
        <ThemedView style={styles.defensiveSkillsContainer}>
          {/* Dodge Skill */}
          <ThemedView style={styles.skillRow}>
            <ThemedText style={styles.skillName}>Dodge</ThemedText>
            <ThemedView style={styles.skillControls}>
              <Pressable style={[styles.levelButton, styles.decreaseButton]} onPress={() => handleDodgeChange(-1)} disabled={character.skills.dodge <= 0}>
                <ThemedText style={styles.levelButtonText}>-</ThemedText>
              </Pressable>

              <ThemedText style={styles.skillLevel}>{character.skills.dodge}</ThemedText>

              <Pressable style={[styles.levelButton, styles.increaseButton]} onPress={() => handleDodgeChange(1)}>
                <ThemedText style={styles.levelButtonText}>+</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>

          {/* Parry Skill */}
          <ThemedView style={styles.skillRow}>
            <ThemedText style={styles.skillName}>Parry</ThemedText>
            <ThemedView style={styles.skillControls}>
              <Pressable style={[styles.levelButton, styles.decreaseButton]} onPress={() => handleParryChange(-1)} disabled={character.skills.parry <= 0}>
                <ThemedText style={styles.levelButtonText}>-</ThemedText>
              </Pressable>

              <ThemedText style={styles.skillLevel}>{character.skills.parry}</ThemedText>

              <Pressable style={[styles.levelButton, styles.increaseButton]} onPress={() => handleParryChange(1)}>
                <ThemedText style={styles.levelButtonText}>+</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>

          <ThemedText style={styles.helpText}>Dodge helps you avoid attacks. Parry allows you to block melee attacks.</ThemedText>
        </ThemedView>
      </Collapsible>

      {/* Combat Abilities Section */}
      <Collapsible title="Combat Abilities">
        <CombatAttacks />
      </Collapsible>

      {/* Weapons Section */}
      <Collapsible title="Weapons">
        {equippedWeapons.length > 0 ? (
          <View style={styles.tableContainer}>
            <TableWrapper>
              <Table style={styles.table}>
                <Row data={["Weapon", "Attack", "Damage", "Properties"]} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
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
                      weapon.name,
                      formatAttackBonus(getAttackBonus(weapon)),
                      `${weapon.damageDiceCount}${diceType} ${formatAttackBonus(getDamageBonus(weapon))}`,
                      [weapon.versatile && "Versatile", weapon.twoHanded && "Two-handed"].filter(Boolean).join(", "),
                    ];
                  })}
                  style={styles.tableRow}
                  textStyle={styles.tableRowText}
                />
              </Table>
            </TableWrapper>
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
  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  skillName: {
    fontSize: 16,
    fontWeight: "500",
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
