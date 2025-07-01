import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { ePlayerStat } from "@/constants/Stats";
import { RootState } from "@/store/rootReducer";
import { removeEquipment } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";
import { AddEquipment } from "./AddItemForm/AddEquipment";

interface EquipmentModalProps {
    visible: boolean;
    onClose: () => void;
}

export function EquipmentModal({ visible, onClose }: EquipmentModalProps) {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const equipment = character.inventory?.equipment || [];

    const handleRemoveEquipment = (equipmentId: string) => {
        dispatch(removeEquipment(equipmentId));
    };

    // Convert stat enum to readable string
    const getStatName = (stat: number) => {
        switch (stat) {
            case ePlayerStat.hp:
                return "HP";
            case ePlayerStat.energy:
                return "Energy";
            case ePlayerStat.bp:
                return "BP";
            case ePlayerStat.evasion:
                return "Evasion";
            case ePlayerStat.str:
                return "STR";
            case ePlayerStat.dex:
                return "DEX";
            case ePlayerStat.con:
                return "CON";
            case ePlayerStat.foc:
                return "FOC";
            case ePlayerStat.int:
                return "INT";
            case ePlayerStat.cha:
                return "CHA";
            case ePlayerStat.movement:
                return "Speed";
            default:
                return "Unknown";
        }
    };

    const equipmentHeaders = ["Item", "Effect", "Attunement", "Equipped", ""];

    const equipmentRows = equipment.map((item) => [
        item.name,
        item.statModifier ? `${getStatName(item.statEffected)} +${item.statModifier}` : "-",
        item.requiresAttunement ? (item.attunement ? "Attuned" : "Not Attuned") : "N/A",
        item.equipped ? "Yes" : "No",
        <Pressable key={item.id} style={[cssStyle.condensedButton, cssStyle.secondaryColors]} onPress={() => handleRemoveEquipment(item.id)}>
            <FontAwesome name="trash" size={16} color="white" />
        </Pressable>,
    ]);

    const attunedCount = equipment.filter((item) => item.attunement).length;

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={cssStyle.modalOverlay}>
                <View style={cssStyle.modalView}>
                    <View style={cssStyle.modalHeader}>
                        <ThemedText style={cssStyle.modalTitle}>Equipment Management</ThemedText>
                        <Pressable style={cssStyle.centered} onPress={onClose}>
                            <FontAwesome name="times" size={20} color="#FFF" />
                        </Pressable>
                    </View>

                    <ScrollView style={cssStyle.modalContent}>
                        {/* Current Equipment Section */}
                        <View style={cssStyle.container}>
                            <View style={cssStyle.row}>
                                <ThemedText style={cssStyle.sectionHeader}>Current Equipment</ThemedText>
                                <ThemedText style={cssStyle.smallText}>Attuned: {attunedCount}/3</ThemedText>
                            </View>

                            {equipment.length > 0 ? (
                                <View style={cssStyle.lightContainer}>
                                    <TableWrapper>
                                        <Table>
                                            <Row
                                                data={equipmentHeaders}
                                                style={{ backgroundColor: "#f1f1f1", paddingVertical: 8 }}
                                                textStyle={{ fontWeight: "bold", textAlign: "center" }}
                                            />
                                            <Rows
                                                data={equipmentRows}
                                                style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#ddd" }}
                                                textStyle={{ textAlign: "center" }}
                                            />
                                        </Table>
                                    </TableWrapper>
                                </View>
                            ) : (
                                <View style={cssStyle.lightContainer}>
                                    <ThemedText style={cssStyle.emptyText}>No equipment in inventory</ThemedText>
                                </View>
                            )}
                        </View>

                        {/* Add Equipment Section */}
                        <View style={[cssStyle.container, { marginTop: 24 }]}>
                            <AddEquipment />
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
