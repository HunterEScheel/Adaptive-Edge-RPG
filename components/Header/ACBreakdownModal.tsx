import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Consumable, Equipment } from "@/constants/Item";
import { ePlayerStat } from "@/constants/Stats";
import { Character } from "@/store/slices/characterSlice";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { cssStyle } from "@/app/styles/phone";

interface ACBreakdownModalProps {
    visible: boolean;
    onClose: () => void;
    character: Character;
}

export function ACBreakdownModal({ visible, onClose, character }: ACBreakdownModalProps) {
    // Calculate each component of AC
    const baseAC = 10 + character.base.dex;

    const equipmentAC =
        character.inventory?.equipment
            ?.filter((x: Equipment) => x.statEffected === ePlayerStat.ac && (!x.requiresAttunement || x.attunement) && x.equipped)
            .reduce((total: number, item: Equipment) => total + (item.statModifier || 0), 0) || 0;

    const consumableAC =
        character.inventory?.consumables
            ?.filter((x: Consumable) => x.statEffected === ePlayerStat.ac)
            .reduce((total: number, item: Consumable) => total + (item.statModifier || 0), 0) || 0;

    let dodgeAC = character.skills?.dodge || 0;
    const originalDodge = character.skills?.dodge || 0;

    // Apply armor classification penalties to dodge
    if (character.inventory.armor.armorClassification === "Medium") {
        dodgeAC = Math.max(dodgeAC - 1, 0);
    }
    if (character.inventory.armor.armorClassification === "Heavy") {
        dodgeAC = 0;
    }

    const armorAC = character.inventory.armor.bonus || 0;
    const enchantmentAC = character.inventory.armor.enchantmentBonus || 0;

    const totalAC = baseAC + equipmentAC + consumableAC + dodgeAC + armorAC + enchantmentAC;

    const equipmentItems =
        character.inventory?.equipment?.filter((x: Equipment) => x.statEffected === ePlayerStat.ac && (!x.requiresAttunement || x.attunement) && x.equipped) ||
        [];

    const consumableItems = character.inventory?.consumables?.filter((x: Consumable) => x.statEffected === ePlayerStat.ac) || [];

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={cssStyle.modalOverlay}>
                <ThemedView style={cssStyle.card}>
                    <View style={cssStyle.modalHeader}>
                        <ThemedText style={cssStyle.modalTitle}>Armor Class Breakdown</ThemedText>
                        <Pressable style={cssStyle.centered} onPress={onClose}>
                            <FontAwesome name="times" size={20} color="#FFF" />
                        </Pressable>
                    </View>

                    <ScrollView style={cssStyle.container}>
                        <View style={cssStyle.whiteContainer}>
                            <ThemedText style={cssStyle.largeValue}>Total AC: {totalAC}</ThemedText>
                        </View>

                        <View style={cssStyle.container}>
                            <ThemedText style={cssStyle.sectionHeader}>Breakdown:</ThemedText>

                            <View style={cssStyle.row}>
                                <ThemedText style={cssStyle.label}>Base AC (10 + DEX)</ThemedText>
                                <ThemedText style={cssStyle.valueText}>
                                    10 + {character.base.dex} = {baseAC}
                                </ThemedText>
                            </View>

                            {character.inventory.armor && (
                                <>
                                    <View style={cssStyle.row}>
                                        <ThemedText style={cssStyle.label}>Armor ({character.inventory.armor.name})</ThemedText>
                                        <ThemedText style={cssStyle.valueText}>+{armorAC}</ThemedText>
                                    </View>

                                    {enchantmentAC > 0 && (
                                        <View style={cssStyle.row}>
                                            <ThemedText style={cssStyle.label}>Enchantment Bonus</ThemedText>
                                            <ThemedText style={cssStyle.valueText}>+{enchantmentAC}</ThemedText>
                                        </View>
                                    )}
                                </>
                            )}

                            <View style={cssStyle.row}>
                                <ThemedText style={cssStyle.label}>
                                    Dodge Skill{" "}
                                    {character.inventory.armor.armorClassification !== "Light"
                                        ? `(${originalDodge} ${character.inventory.armor.armorClassification === "Medium" ? "-1" : "blocked"})`
                                        : ""}
                                </ThemedText>
                                <ThemedText style={cssStyle.valueText}>+{dodgeAC}</ThemedText>
                            </View>

                            {equipmentItems.length > 0 && (
                                <>
                                    <ThemedText style={cssStyle.subtitle}>Equipment Bonuses:</ThemedText>
                                    {equipmentItems.map((item: Equipment, index: number) => (
                                        <View key={index} style={cssStyle.row}>
                                            <ThemedText style={cssStyle.label}>{item.name}</ThemedText>
                                            <ThemedText style={cssStyle.valueText}>+{item.statModifier}</ThemedText>
                                        </View>
                                    ))}
                                </>
                            )}

                            {consumableItems.length > 0 && (
                                <>
                                    <ThemedText style={cssStyle.subtitle}>Consumable Effects:</ThemedText>
                                    {consumableItems.map((item: Consumable, index: number) => (
                                        <View key={index} style={cssStyle.row}>
                                            <ThemedText style={cssStyle.label}>{item.name}</ThemedText>
                                            <ThemedText style={cssStyle.valueText}>+{item.statModifier}</ThemedText>
                                        </View>
                                    ))}
                                </>
                            )}
                        </View>

                        {character.inventory.armor.armorClassification !== "Light" && (
                            <View style={cssStyle.lightContainer}>
                                <ThemedText style={cssStyle.subtitle}>Armor Penalties:</ThemedText>
                                <ThemedText style={cssStyle.emptyText}>
                                    {character.inventory.armor.armorClassification === "Medium"
                                        ? "Medium armor reduces Dodge skill by 1 (minimum 0)"
                                        : "Heavy armor completely blocks Dodge skill bonus"}
                                </ThemedText>
                            </View>
                        )}
                    </ScrollView>
                </ThemedView>
            </View>
        </Modal>
    );
}
