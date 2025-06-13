import { AddItemForm } from "@/components/AddItemForm/AddItemForm";
import { Collapsible } from "@/components/Collapsible";
import { GoldManager } from "@/components/InventoryPage/GoldManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RootState } from "@/store/rootReducer";
import { toggleAttunementEquipment, toggleEquipEquipment, toggleEquipWeapon } from "@/store/slices/inventorySlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  onPress: () => void;
};

function CircleButton({ onPress }: Props) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        <MaterialIcons name="add" size={38} color="#25292e" />
      </Pressable>
    </View>
  );
}

export default function InventoryScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const character = useSelector((state: RootState) => state.character);
  const dispatch = useDispatch();

  // Generate empty state message
  const getEmptyStateMessage = (itemType: string) => {
    return `No ${itemType} in inventory yet`;
  };

  // Handle equip toggle for weapons
  const handleWeaponEquipToggle = (weaponId: string) => {
    dispatch(toggleEquipWeapon(weaponId));
  };

  // Handle equip toggle for equipment
  const handleEquipmentEquipToggle = (equipmentId: string) => {
    dispatch(toggleEquipEquipment(equipmentId));
  };

  // Handle attunement toggle for equipment
  const handleAttunementToggle = (equipmentId: string) => {
    dispatch(toggleAttunementEquipment(equipmentId));
  };

  // Count attuned items
  const attunedItemsCount = character.inventory?.equipment?.filter((item) => item.attunement)?.length || 0;

  // Prepare table headers
  const weaponHeaders = ["Equip", "Weapon", "Damage", "Qty", "Value"];
  const equipmentHeaders = ["Equip", "Attune", "Item", "Effect", "Qty", "Value"];

  const consumableHeaders = ["Item", "Effect", "Qty", "Value"];

  // Create custom cell renderer for equip toggle button
  const renderEquipToggle = (isChecked: boolean, onPress: () => void) => (
    <Pressable style={[styles.toggleButton, isChecked ? styles.buttonActive : styles.buttonInactive]} onPress={onPress}>
      <ThemedText style={styles.toggleText}>{isChecked ? "Unequip" : "Equip"}</ThemedText>
    </Pressable>
  );

  // Create custom cell renderer for attunement toggle button
  const renderAttuneToggle = (isChecked: boolean, isRequired: boolean, onPress: () => void, disabled: boolean = false) => {
    if (!isRequired) {
      return <View />; // Empty view if attunement not required
    }

    return (
      <Pressable style={[styles.toggleButton, isChecked ? styles.buttonActive : styles.buttonInactive, disabled && styles.toggleDisabled]} onPress={disabled ? undefined : onPress} disabled={disabled}>
        <ThemedText style={styles.toggleText}>{isChecked ? "ON" : "OFF"}</ThemedText>
      </Pressable>
    );
  };

  // Prepare custom cells for weapons
  const weaponData =
    character.inventory?.weapons?.map((weapon) => {
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

      return {
        id: weapon.id,
        equipped: weapon.equipped || false,
        name: weapon.name,
        damage: `${weapon.damageDiceCount}${diceType}${weapon.attackBonus ? ` +${weapon.attackBonus}` : ""}`,
        qty: weapon.qty?.toString() || "1",
        value: `${weapon.value} gp`,
      };
    }) || [];

  // Map weapon data to rows with toggle button cell first
  const weaponRows = weaponData.map((weapon) => [renderEquipToggle(weapon.equipped, () => handleWeaponEquipToggle(weapon.id)), weapon.name, weapon.damage, weapon.qty, weapon.value]);

  // Prepare equipment data with custom equip checkbox
  const equipmentData =
    character.inventory?.equipment?.map((item) => {
      // Format the stat effect to be more human-readable
      let effectDisplay = "-";
      if (item.statModifier && item.statEffected) {
        // Convert numeric enum to readable string
        let statName;
        switch (item.statEffected) {
          case 1:
            statName = "HP";
            break;
          case 2:
            statName = "Energy";
            break;
          case 3:
            statName = "BP";
            break;
          case 4:
            statName = "AC";
            break;
          case 5:
            statName = "STR";
            break;
          case 6:
            statName = "DEX";
            break;
          case 7:
            statName = "CON";
            break;
          case 8:
            statName = "WIS";
            break;
          case 9:
            statName = "INT";
            break;
          case 10:
            statName = "CHA";
            break;
          case 11:
            statName = "Speed";
            break;
          default:
            statName = "Stat";
            break;
        }
        effectDisplay = `${statName} +${item.statModifier}`;
      }

      return {
        id: item.id,
        equipped: item.equipped || false,
        name: item.name,
        effect: effectDisplay,
        qty: item.qty?.toString() || "1",
        value: `${item.value} gp`,
      };
    }) || [];

  // Map equipment data to rows with checkbox cell first
  const equipmentRows = equipmentData.map((equipment) => {
    // Check if this item requires attunement
    const requiresAttunement = character.inventory?.equipment?.find((item) => item.id === equipment.id)?.requiresAttunement || false;
    // Check if we can attune more items (limit is 3)
    const canAttuneMore = attunedItemsCount < 3 || (requiresAttunement && character.inventory?.equipment?.find((item) => item.id === equipment.id)?.attunement);

    return [
      renderEquipToggle(equipment.equipped, () => handleEquipmentEquipToggle(equipment.id)),
      renderAttuneToggle(character.inventory?.equipment?.find((item) => item.id === equipment.id)?.attunement || false, requiresAttunement, () => handleAttunementToggle(equipment.id), !canAttuneMore),
      equipment.name,
      equipment.effect,
      equipment.qty,
      equipment.value,
    ];
  });

  // Prepare table rows for consumables
  const consumableRows =
    character.inventory?.consumables?.map((item) => [item.name, item.statModifier ? `${item.statEffected} +${item.statModifier}` : "-", item.qty?.toString() || "1", `${item.value} gp`]) || [];

  // Calculate attuned items with formatted effects
  const attunedItems = [...(character.inventory?.weapons?.filter((item) => item.attunement) || []), ...(character.inventory?.equipment?.filter((item) => item.attunement) || [])].map((item) => {
    // Determine item type by checking for weapon-specific properties
    const isWeapon = "damageDice" in item;
    const itemType = isWeapon ? "Weapon" : "Equipment";

    // Format effect description
    let effectDisplay = "-";

    // For equipment items with stat effects
    if (!isWeapon && "statModifier" in item && "statEffected" in item && item.statModifier && item.statEffected) {
      // Convert numeric enum to readable string
      let statName;
      switch (item.statEffected) {
        case 1:
          statName = "HP";
          break;
        case 2:
          statName = "Energy";
          break;
        case 3:
          statName = "BP";
          break;
        case 4:
          statName = "AC";
          break;
        case 5:
          statName = "STR";
          break;
        case 6:
          statName = "DEX";
          break;
        case 7:
          statName = "CON";
          break;
        case 8:
          statName = "WIS";
          break;
        case 9:
          statName = "INT";
          break;
        case 10:
          statName = "CHA";
          break;
        case 11:
          statName = "Speed";
          break;
        default:
          statName = "Stat";
          break;
      }
      effectDisplay = `${statName} +${item.statModifier}`;
    }
    // For weapons, show damage info
    else if (isWeapon) {
      // TypeScript now knows this is a weapon
      const weapon = item as any; // Use 'any' to bypass strict typing
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
          diceType = `d${weapon.damageDice}`;
      }
      effectDisplay = `${weapon.damageDiceCount}${diceType}`;
      if (weapon.attackBonus) effectDisplay += ` +${weapon.attackBonus} damage`;
    }
    // For items with charges
    else if ("charges" in item && "maxCharges" in item && item.charges) {
      effectDisplay = `${item.charges}/${item.maxCharges} charges`;
    }

    return {
      name: item.name,
      type: itemType,
      effect: effectDisplay,
    };
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        {/* Gold Manager Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Currency
          </ThemedText>
          <GoldManager />
        </ThemedView>

        {/* Attuned Items Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Attuned Items
          </ThemedText>
          <ThemedView style={styles.attunedItemsContainer}>
            {attunedItems.length > 0 ? (
              <TableWrapper>
                <Table style={styles.table}>
                  <Row data={["Item", "Type", "Effect"]} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                  <Rows data={attunedItems.map((item) => [item.name, item.type, item.effect])} style={styles.tableRow} textStyle={styles.tableRowText} />
                </Table>
              </TableWrapper>
            ) : (
              <ThemedText style={styles.emptyStateText}>No attuned items yet</ThemedText>
            )}
          </ThemedView>
        </ThemedView>

        {/* Weapons Section */}
        <ThemedView style={styles.section}>
          <Collapsible title="Weapons">
            <ThemedView style={styles.tableContainer}>
              {weaponRows.length > 0 ? (
                <TableWrapper>
                  <Table style={styles.table}>
                    <Row data={weaponHeaders} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                    <Rows data={weaponRows} style={styles.tableRow} textStyle={styles.tableRowText} />
                  </Table>
                </TableWrapper>
              ) : (
                <ThemedText style={styles.emptyStateText}>{getEmptyStateMessage("weapons")}</ThemedText>
              )}
            </ThemedView>
          </Collapsible>
        </ThemedView>

        {/* Equipment Section */}
        <ThemedView style={styles.section}>
          <Collapsible title="Equipment">
            <ThemedView style={styles.tableContainer}>
              {equipmentRows.length > 0 ? (
                <TableWrapper>
                  <Table style={styles.table}>
                    <Row data={equipmentHeaders} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                    <Rows data={equipmentRows} style={styles.tableRow} textStyle={styles.tableRowText} />
                  </Table>
                </TableWrapper>
              ) : (
                <ThemedText style={styles.emptyStateText}>{getEmptyStateMessage("equipment")}</ThemedText>
              )}
            </ThemedView>
          </Collapsible>
        </ThemedView>

        {/* Consumables Section */}
        <ThemedView style={styles.section}>
          <Collapsible title="Consumables">
            <ThemedView style={styles.tableContainer}>
              {consumableRows.length > 0 ? (
                <TableWrapper>
                  <Table style={styles.table}>
                    <Row data={consumableHeaders} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                    <Rows data={consumableRows} style={styles.tableRow} textStyle={styles.tableRowText} />
                  </Table>
                </TableWrapper>
              ) : (
                <ThemedText style={styles.emptyStateText}>{getEmptyStateMessage("consumables")}</ThemedText>
              )}
            </ThemedView>
          </Collapsible>
        </ThemedView>
      </ThemedView>

      {/* Add Item Button */}
      <CircleButton onPress={() => setModalOpen(!modalOpen)} />

      {/* Add Item Modal */}
      {modalOpen && <AddItemForm onClose={() => setModalOpen(false)} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  attunedItemsContainer: {
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  emptyStateText: {
    color: "#888",
    fontStyle: "italic",
  },
  tableContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  table: {
    width: "100%",
    marginVertical: 8,
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
    fontSize: 14,
    textAlign: "center",
    padding: 8,
  },
  toggleButton: {
    padding: 6,
    borderRadius: 4,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#333333", // Black for inactive
  },
  buttonInactive: {
    backgroundColor: "#4CAF50", // Green for active
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  toggleText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 10,
  },
  circleButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
});
