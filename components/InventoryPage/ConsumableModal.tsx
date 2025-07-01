import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { ePlayerStat } from "@/constants/Stats";
import { RootState } from "@/store/rootReducer";
import { removeConsumable, useConsumable } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";
import { AddConsumable } from "./AddItemForm/AddConsumable";

interface ConsumableModalProps {
    visible: boolean;
    onClose: () => void;
}

export function ConsumableModal({ visible, onClose }: ConsumableModalProps) {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const consumables = character.inventory?.consumables || [];

    const handleRemoveConsumable = (consumableId: string) => {
        dispatch(removeConsumable(consumableId));
    };

    const handleUseConsumable = (consumableId: string) => {
        dispatch(useConsumable(consumableId));
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

    const consumableHeaders = ["Item", "Effect", "Qty", "Value", "Actions"];

    const consumableRows = consumables.map((item) => [
        item.name,
        item.statModifier ? `${getStatName(item.statEffected)} +${item.statModifier}` : "-",
        item.qty?.toString() || "1",
        `${item.value} gp`,
        <View key={item.id} style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
            <Pressable style={[cssStyle.condensedButton, cssStyle.primaryColors]} onPress={() => handleUseConsumable(item.id)}>
                <ThemedText style={cssStyle.primaryText}>Use</ThemedText>
            </Pressable>
            <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryColors]} onPress={() => handleRemoveConsumable(item.id)}>
                <FontAwesome name="trash" size={16} color="white" />
            </Pressable>
        </View>,
    ]);

    const totalValue = consumables.reduce((sum, item) => sum + item.value * (item.qty || 1), 0);

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={cssStyle.modalOverlay}>
                <View style={cssStyle.modalView}>
                    <View style={cssStyle.modalHeader}>
                        <ThemedText style={cssStyle.modalTitle}>Consumable Management</ThemedText>
                        <Pressable style={cssStyle.centered} onPress={onClose}>
                            <FontAwesome name="times" size={20} color="#FFF" />
                        </Pressable>
                    </View>

                    <ScrollView style={cssStyle.modalContent}>
                        {/* Current Consumables Section */}
                        <View style={cssStyle.container}>
                            <View style={cssStyle.row}>
                                <ThemedText style={cssStyle.sectionHeader}>Current Consumables</ThemedText>
                                <ThemedText style={cssStyle.smallText}>Total Value: {totalValue} gp</ThemedText>
                            </View>

                            {consumables.length > 0 ? (
                                <View style={cssStyle.lightContainer}>
                                    <TableWrapper>
                                        <Table>
                                            <Row
                                                data={consumableHeaders}
                                                style={{ backgroundColor: "#f1f1f1", paddingVertical: 8 }}
                                                textStyle={{ fontWeight: "bold", textAlign: "center" }}
                                            />
                                            <Rows
                                                data={consumableRows}
                                                style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#ddd" }}
                                                textStyle={{ textAlign: "center" }}
                                            />
                                        </Table>
                                    </TableWrapper>
                                </View>
                            ) : (
                                <View style={cssStyle.lightContainer}>
                                    <ThemedText style={cssStyle.emptyText}>No consumables in inventory</ThemedText>
                                </View>
                            )}
                        </View>

                        {/* Add Consumable Section */}
                        <View style={[cssStyle.container, { marginTop: 24 }]}>
                            <AddConsumable />
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
