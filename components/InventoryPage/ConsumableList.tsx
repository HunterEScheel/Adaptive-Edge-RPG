import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { CompactListManager } from "@/components/Common/CompactListManager";
import { MiniListManager } from "@/components/Common/MiniListManager";
import { Consumable } from "@/constants/Item";
import { ePlayerStat } from "@/constants/Stats";
import { RootState } from "@/store/rootReducer";
import { removeConsumable, useConsumable } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ListManagerDesktop } from "../Common/ListManager.desktop";
import { ThemedText } from "../ThemedText";
import { ConsumableModal } from "./ConsumableModal";

interface ConsumableListProps {
    variant?: "full" | "compact" | "mini";
}

export function ConsumableList({ variant = "full" }: ConsumableListProps) {
    const cssStyle = useResponsiveStyles();
    const { isMobile } = useResponsive();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const consumables = character.inventory?.consumables || [];
    const [consumableModalOpen, setConsumableModalOpen] = useState(false);

    // Calculate total value
    const totalValue = consumables.reduce((sum, item) => sum + item.value * (item.qty || 1), 0);

    const handleRemoveConsumable = (consumableId: string) => {
        dispatch(removeConsumable(consumableId));
    };

    const handleUseConsumable = (consumableId: string) => {
        const item = consumables.find((c) => c.id === consumableId);
        if (!item) return;

        // Check if character has enough current HP/energy to use items that cost those resources
        const currentHP = character.base.hitPoints;
        const currentEnergy = character.base.energy;

        if (item.statEffected === ePlayerStat.hp && item.statModifier && item.statModifier < 0) {
            if (currentHP + item.statModifier <= 0) {
                Alert.alert("Cannot Use", "Using this item would reduce your HP to 0 or below!");
                return;
            }
        }

        if (item.statEffected === ePlayerStat.energy && item.statModifier && item.statModifier < 0) {
            if (currentEnergy + item.statModifier < 0) {
                Alert.alert("Cannot Use", "You don't have enough energy to use this item!");
                return;
            }
        }

        dispatch(useConsumable(consumableId));
        Alert.alert("Item Used", `You used ${item.name}!`);
    };

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

    const renderConsumableItem = ({ item }: { item: Consumable }) => {
        const effectDisplay = item.statModifier ? `${getStatName(item.statEffected)} ${item.statModifier > 0 ? "+" : ""}${item.statModifier}` : "No effect";

        return (
            <View style={cssStyle.itemContainer}>
                <View style={cssStyle.itemHeader}>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={cssStyle.subtitle} numberOfLines={1}>
                            {item.name} {item.qty && item.qty > 1 && <ThemedText style={cssStyle.hint}>x{item.qty}</ThemedText>}
                        </ThemedText>
                        <ThemedText style={cssStyle.description}>
                            {effectDisplay} • {item.value} gp each
                        </ThemedText>
                    </View>
                    <View style={[cssStyle.row, { gap: 8 }]}>
                        <Pressable
                            style={[cssStyle.condensedButton, cssStyle.primaryColors]}
                            onPress={() => handleUseConsumable(item.id)}
                            disabled={!item.qty || item.qty === 0}
                        >
                            <ThemedText style={cssStyle.primaryText}>Use</ThemedText>
                        </Pressable>
                        <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryColors]} onPress={() => handleRemoveConsumable(item.id)}>
                            <FontAwesome name="trash" size={14} color="white" />
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    const renderMiniConsumableItem = ({ item }: { item: Consumable }) => {
        return (
            <ThemedText style={{ fontSize: 11 }} numberOfLines={1}>
                • {item.name} ({getStatName(item.statEffected)} {item.statModifier > 0 ? "+" : ""}
                {item.statModifier}){item.qty && item.qty > 1 && ` x${item.qty}`}
            </ThemedText>
        );
    };

    // Handle mini variant
    if (variant === "mini") {
        return (
            <>
                <MiniListManager<Consumable>
                    title="Consumables"
                    data={consumables}
                    renderItem={renderConsumableItem}
                    renderMiniItem={renderMiniConsumableItem}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setConsumableModalOpen(true)}
                    emptyStateText="No consumables"
                    maxDisplayItems={3}
                />
                <ConsumableModal visible={consumableModalOpen} onClose={() => setConsumableModalOpen(false)} />
            </>
        );
    }

    // Handle compact variant or phone view
    if (variant === "compact" || isMobile) {
        return (
            <>
                <CompactListManager<Consumable>
                    title={`Consumables (${totalValue} gp)`}
                    data={consumables}
                    renderItem={renderConsumableItem}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setConsumableModalOpen(true)}
                    addButtonText="Add"
                    emptyStateText="No consumables in inventory"
                />
                <ConsumableModal visible={consumableModalOpen} onClose={() => setConsumableModalOpen(false)} />
            </>
        );
    }

    // Full variant
    return (
        <>
            <ListManagerDesktop<Consumable>
                title="Consumables"
                description={`${consumables.length} item${consumables.length !== 1 ? "s" : ""} • Total value: ${totalValue} gp`}
                data={consumables}
                renderItem={renderConsumableItem}
                keyExtractor={(item) => item.id}
                onAddPress={() => setConsumableModalOpen(true)}
                addButtonText="Add Consumable"
                emptyStateText="No consumables in your inventory. Add potions, scrolls, and other consumable items!"
            />
            <ConsumableModal visible={consumableModalOpen} onClose={() => setConsumableModalOpen(false)} />
        </>
    );
}
