import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { RootState } from "@/store/rootReducer";
import { removeWeapon } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";
import { AddWeapon } from "./AddItemForm/AddWeapon";

interface WeaponModalProps {
    visible: boolean;
    onClose: () => void;
}

export function WeaponModal({ visible, onClose }: WeaponModalProps) {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const weapons = character.inventory?.weapons || [];

    const handleRemoveWeapon = (weaponId: string) => {
        dispatch(removeWeapon(weaponId));
    };

    // Convert enum value to actual die type
    const getDiceType = (damageDice: number) => {
        switch (damageDice) {
            case 1:
                return "d4";
            case 2:
                return "d6";
            case 3:
                return "d8";
            case 4:
                return "d10";
            case 5:
                return "d12";
            case 6:
                return "d20";
            default:
                return `d${damageDice}`;
        }
    };

    const weaponHeaders = ["Weapon", "Damage", "Type", "Equipped", ""];

    const weaponRows = weapons.map((weapon) => [
        weapon.name,
        `${weapon.damageDiceCount}${getDiceType(weapon.damageDice)}${weapon.attackBonus ? ` +${weapon.attackBonus}` : ""}`,
        weapon.twoHanded ? "Two-Handed" : weapon.versatile ? "V" : "One-Handed",
        weapon.equipped ? "Yes" : "No",
        <Pressable key={weapon.id} style={[cssStyle.condensedButton, cssStyle.secondaryButton]} onPress={() => handleRemoveWeapon(weapon.id)}>
            <FontAwesome name="trash" size={16} color="white" />
        </Pressable>,
    ]);

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={cssStyle.modalOverlay}>
                <View style={cssStyle.modalView}>
                    <View style={cssStyle.modalHeader}>
                        <ThemedText style={cssStyle.modalTitle}>Weapon Management</ThemedText>
                        <Pressable style={cssStyle.centered} onPress={onClose}>
                            <FontAwesome name="times" size={20} color="#FFF" />
                        </Pressable>
                    </View>

                    <ScrollView style={cssStyle.modalContent}>
                        {/* Current Weapons Section */}
                        <View style={[cssStyle.container, { width: "100%" }]}>
                            <ThemedText style={cssStyle.sectionHeader}>Current Weapons</ThemedText>

                            {weapons.length > 0 ? (
                                <View style={[cssStyle.lightContainer, cssStyle.modalTable, { width: "100%" }]}>
                                    <TableWrapper style={{ width: "100%" }}>
                                        <Table>
                                            <Row
                                                data={weaponHeaders}
                                                style={{
                                                    backgroundColor: "#f1f1f1",
                                                    paddingVertical: 8,
                                                }}
                                                textStyle={[
                                                    {
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                    },
                                                    cssStyle.modalTableText,
                                                ]}
                                            />
                                            <Rows
                                                data={weaponRows}
                                                style={{
                                                    paddingVertical: 8,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: "#ddd",
                                                }}
                                                textStyle={[
                                                    {
                                                        textAlign: "center",
                                                    },
                                                    cssStyle.modalTableText,
                                                ]}
                                            />
                                        </Table>
                                    </TableWrapper>
                                </View>
                            ) : (
                                <View style={cssStyle.lightContainer}>
                                    <ThemedText style={cssStyle.emptyText}>No weapons in inventory</ThemedText>
                                </View>
                            )}
                        </View>

                        {/* Add Weapon Section */}
                        <View style={[cssStyle.container, { marginTop: 24, width: "100%" }]}>
                            <AddWeapon />
                        </View>
                    </ScrollView>

                    <View style={cssStyle.modalButtons}>
                        <Pressable style={cssStyle.primaryButton} onPress={onClose}>
                            <ThemedText style={cssStyle.buttonText}>Close</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
