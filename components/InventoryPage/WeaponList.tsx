import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { CompactListManager } from "@/components/Common/CompactListManager";
import { ListManager } from "@/components/Common/ListManager";
import { MiniListManager } from "@/components/Common/MiniListManager";
import { Weapon } from "@/constants/Item";
import { RootState } from "@/store/rootReducer";
import { removeWeapon, toggleEquipWeapon } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { WeaponModal } from "./WeaponModal";

interface WeaponListProps {
    variant?: "full" | "compact" | "mini";
}

export function WeaponList({ variant = "full" }: WeaponListProps) {
    const cssStyle = useResponsiveStyles();
    const { isPhone } = useResponsive();
    const dispatch = useDispatch();
    const weapons = useSelector((state: RootState) => state.character.inventory?.weapons || []);
    const [weaponModalOpen, setWeaponModalOpen] = useState(false);

    // Calculate total value
    const totalValue = weapons.reduce((sum, weapon) => sum + weapon.value * (weapon.qty || 1), 0);

    const handleRemoveWeapon = (weaponId: string) => {
        dispatch(removeWeapon(weaponId));
    };

    const handleEquipToggle = (weaponId: string) => {
        dispatch(toggleEquipWeapon(weaponId));
    };

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

    const renderWeaponItem = ({ item }: { item: Weapon }) => {
        return (
            <View style={cssStyle.itemContainer}>
                <View style={cssStyle.itemHeader}>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={cssStyle.subtitle} numberOfLines={1}>
                            {item.name} {item.equipped && <ThemedText style={cssStyle.hint}>(Equipped)</ThemedText>}
                        </ThemedText>
                        <ThemedText style={cssStyle.description}>
                            {item.damageDiceCount}
                            {getDiceType(item.damageDice)}
                            {item.attackBonus ? ` +${item.attackBonus}` : ""}
                            {item.twoHanded && " • Two-Handed"}
                            {item.versatile && " • Versatile"}
                        </ThemedText>
                    </View>
                    <View style={[cssStyle.row, { gap: 8 }]}>
                        <Pressable
                            style={[cssStyle.defaultButton, item.equipped ? cssStyle.secondaryColors : cssStyle.primaryColors]}
                            onPress={() => handleEquipToggle(item.id)}
                        >
                            <ThemedText style={item.equipped ? cssStyle.secondaryText : cssStyle.primaryText}>{item.equipped ? "Unequip" : "Equip"}</ThemedText>
                        </Pressable>
                        <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryColors]} onPress={() => handleRemoveWeapon(item.id)}>
                            <FontAwesome name="trash" size={14} color="white" />
                        </Pressable>
                    </View>
                </View>
                {item.charges !== undefined && item.maxCharges > 0 && (
                    <ThemedText style={cssStyle.smallText}>
                        Charges: {item.charges}/{item.maxCharges}
                    </ThemedText>
                )}
            </View>
        );
    };

    const renderMiniWeaponItem = ({ item }: { item: Weapon }) => {
        return (
            <ThemedText style={{ fontSize: 11 }} numberOfLines={1}>
                • {item.name} ({item.damageDiceCount}
                {getDiceType(item.damageDice)}){item.equipped && " [E]"}
            </ThemedText>
        );
    };

    // Handle mini variant
    if (variant === "mini") {
        return (
            <>
                <MiniListManager<Weapon>
                    title="Weapons"
                    data={weapons}
                    renderItem={renderWeaponItem}
                    renderMiniItem={renderMiniWeaponItem}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setWeaponModalOpen(true)}
                    emptyStateText="No weapons"
                    maxDisplayItems={3}
                />
                <WeaponModal visible={weaponModalOpen} onClose={() => setWeaponModalOpen(false)} />
            </>
        );
    }

    // Handle compact variant or phone view
    if (variant === "compact" || isPhone) {
        return (
            <>
                <CompactListManager<Weapon>
                    title={`Weapons (${totalValue} gp)`}
                    data={weapons}
                    renderItem={renderWeaponItem}
                    keyExtractor={(item) => item.id}
                    onAddPress={() => setWeaponModalOpen(true)}
                    addButtonText="Add"
                    emptyStateText="No weapons in inventory"
                />
                <WeaponModal visible={weaponModalOpen} onClose={() => setWeaponModalOpen(false)} />
            </>
        );
    }

    // Full variant
    return (
        <>
            <ListManager<Weapon>
                title="Weapons"
                description={`${weapons.length} weapon${weapons.length !== 1 ? "s" : ""} • Total value: ${totalValue} gp`}
                data={weapons}
                renderItem={renderWeaponItem}
                keyExtractor={(item) => item.id}
                onAddPress={() => setWeaponModalOpen(true)}
                addButtonText="Add Weapon"
                emptyStateText="No weapons in your inventory. Add a weapon to get started!"
            />
            <WeaponModal visible={weaponModalOpen} onClose={() => setWeaponModalOpen(false)} />
        </>
    );
}
