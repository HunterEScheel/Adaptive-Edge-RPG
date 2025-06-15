import { AddItemForm } from "@/components/InventoryPage/AddItemForm/AddItemForm";
import { GoldManager } from "@/components/InventoryPage/GoldManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RootState } from "@/store/rootReducer";
import { toggleAttunementEquipment, toggleEquipEquipment, toggleEquipWeapon } from "@/store/slices/inventorySlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";
import { cssStyle } from "../styles/responsive";

type Props = {
    onPress: () => void;
};

function CircleButton({ onPress }: Props) {
    return (
        <Pressable style={cssStyle.centered} onPress={onPress}>
            <MaterialIcons name="add" size={38} color="#25292e" />
        </Pressable>
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
    const renderEquipToggle = (isChecked: boolean, onPress: () => void) => {
        return (
            <Pressable style={[cssStyle.centered, isChecked ? cssStyle.secondaryButton : cssStyle.primaryButton]} onPress={onPress}>
                <ThemedText style={cssStyle.buttonText}>{isChecked ? "Unequip" : "Equip"}</ThemedText>
            </Pressable>
        );
    };

    // Create custom cell renderer for attunement toggle button
    const renderAttuneToggle = (isChecked: boolean, isRequired: boolean, onPress: () => void, disabled: boolean = false) => {
        if (!isRequired) {
            return <View />; // Empty view if attunement not required
        }

        return (
            <Pressable
                style={[cssStyle.centered, isChecked ? cssStyle.secondaryButton : cssStyle.primaryButton, disabled && cssStyle.disabledButton]}
                onPress={disabled ? undefined : onPress}
                disabled={disabled}
            >
                <ThemedText style={cssStyle.buttonText}>{isChecked ? "ON" : "OFF"}</ThemedText>
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
    const weaponRows = weaponData.map((weapon) => [
        renderEquipToggle(weapon.equipped, () => handleWeaponEquipToggle(weapon.id)),
        weapon.name,
        weapon.damage,
        weapon.qty,
        weapon.value,
    ]);

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
        const canAttuneMore =
            attunedItemsCount < 3 || (requiresAttunement && character.inventory?.equipment?.find((item) => item.id === equipment.id)?.attunement);

        return [
            renderEquipToggle(equipment.equipped, () => handleEquipmentEquipToggle(equipment.id)),
            renderAttuneToggle(
                character.inventory?.equipment?.find((item) => item.id === equipment.id)?.attunement || false,
                requiresAttunement,
                () => handleAttunementToggle(equipment.id),
                !canAttuneMore
            ),
            equipment.name,
            equipment.effect,
            equipment.qty,
            equipment.value,
        ];
    });

    // Prepare table rows for consumables
    const consumableRows =
        character.inventory?.consumables?.map((item) => [
            item.name,
            item.statModifier ? `${item.statEffected} +${item.statModifier}` : "-",
            item.qty?.toString() || "1",
            `${item.value} gp`,
        ]) || [];

    // Calculate attuned items with formatted effects
    const attunedItems = [
        ...(character.inventory?.weapons?.filter((item) => item.attunement) || []),
        ...(character.inventory?.equipment?.filter((item) => item.attunement) || []),
    ].map((item) => {
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
        <ThemedView style={cssStyle.container}>
            <ThemedView style={cssStyle.formContent}>
                {/* Gold Manager Section */}
                <ThemedView style={cssStyle.sectionContainer}>
                    <ThemedText type="subtitle" style={cssStyle.sectionTitle}>
                        Currency
                    </ThemedText>
                    <GoldManager />
                </ThemedView>

                {/* Attuned Items Section */}
                <ThemedView style={cssStyle.sectionContainer}>
                    <ThemedText type="subtitle" style={cssStyle.sectionTitle}>
                        Attuned Items
                    </ThemedText>
                    <ThemedView style={cssStyle.container}>
                        {attunedItems.length > 0 ? (
                            <TableWrapper>
                                <Table style={cssStyle.table}>
                                    <Row data={["Item", "Type", "Effect"]} style={cssStyle.tableHeader} textStyle={cssStyle.tableHeaderText} />
                                    <Rows
                                        data={attunedItems.map((item) => [item.name, item.type, item.effect])}
                                        style={cssStyle.tableRow}
                                        textStyle={cssStyle.tableRowText}
                                    />
                                </Table>
                            </TableWrapper>
                        ) : (
                            <ThemedText style={cssStyle.emptyStateText}>No attuned items yet</ThemedText>
                        )}
                    </ThemedView>
                </ThemedView>

                {/* Weapons Section */}
                <ThemedView style={cssStyle.sectionContainer}>
                    <ThemedView style={cssStyle.tableContainer}>
                        {weaponRows.length > 0 ? (
                            <TableWrapper>
                                <Table style={cssStyle.table}>
                                    <Row data={weaponHeaders} style={cssStyle.tableHeader} textStyle={cssStyle.tableHeaderText} />
                                    <Rows data={weaponRows} style={cssStyle.tableRow} textStyle={cssStyle.tableRowText} />
                                </Table>
                            </TableWrapper>
                        ) : (
                            <ThemedText style={cssStyle.emptyStateText}>{getEmptyStateMessage("weapons")}</ThemedText>
                        )}
                    </ThemedView>
                </ThemedView>

                {/* Equipment Section */}
                <ThemedView style={cssStyle.sectionContainer}>
                    <ThemedView style={cssStyle.tableContainer}>
                        {equipmentRows.length > 0 ? (
                            <TableWrapper>
                                <Table style={cssStyle.table}>
                                    <Row data={equipmentHeaders} style={cssStyle.tableHeader} textStyle={cssStyle.tableHeaderText} />
                                    <Rows data={equipmentRows} style={cssStyle.tableRow} textStyle={cssStyle.tableRowText} />
                                </Table>
                            </TableWrapper>
                        ) : (
                            <ThemedText style={cssStyle.emptyStateText}>{getEmptyStateMessage("equipment")}</ThemedText>
                        )}
                    </ThemedView>
                </ThemedView>

                {/* Consumables Section */}
                <ThemedView style={cssStyle.sectionContainer}>
                    <ThemedView style={cssStyle.tableContainer}>
                        {consumableRows.length > 0 ? (
                            <TableWrapper>
                                <Table style={cssStyle.table}>
                                    <Row data={consumableHeaders} style={cssStyle.tableHeader} textStyle={cssStyle.tableHeaderText} />
                                    <Rows data={consumableRows} style={cssStyle.tableRow} textStyle={cssStyle.tableRowText} />
                                </Table>
                            </TableWrapper>
                        ) : (
                            <ThemedText style={cssStyle.emptyStateText}>{getEmptyStateMessage("consumables")}</ThemedText>
                        )}
                    </ThemedView>
                </ThemedView>
            </ThemedView>

            {/* Add Item Button */}
            <CircleButton onPress={() => setModalOpen(!modalOpen)} />

            {/* Add Item Modal */}
            {modalOpen && <AddItemForm onClose={() => setModalOpen(false)} />}
        </ThemedView>
    );
}
