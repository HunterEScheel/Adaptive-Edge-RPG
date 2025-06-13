import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { Character } from "@/store/slices/characterSlice";
import { ePlayerStat } from "@/constants/Stats";
import { Equipment, Consumable } from "@/constants/Item";

interface ACBreakdownModalProps {
    visible: boolean;
    onClose: () => void;
    character: Character;
}

export function ACBreakdownModal({ visible, onClose, character }: ACBreakdownModalProps) {
    // Calculate each component of AC
    const baseAC = 10 + character.base.dex;
    
    const equipmentAC = character.inventory?.equipment
        ?.filter((x: Equipment) => x.statEffected === ePlayerStat.ac && (!x.requiresAttunement || x.attunement) && x.equipped)
        .reduce((total: number, item: Equipment) => total + (item.statModifier || 0), 0) || 0;
    
    const consumableAC = character.inventory?.consumables
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

    const equipmentItems = character.inventory?.equipment
        ?.filter((x: Equipment) => x.statEffected === ePlayerStat.ac && (!x.requiresAttunement || x.attunement) && x.equipped) || [];
    
    const consumableItems = character.inventory?.consumables
        ?.filter((x: Consumable) => x.statEffected === ePlayerStat.ac) || [];

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <ThemedView style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <ThemedText style={styles.modalTitle}>Armor Class Breakdown</ThemedText>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <FontAwesome name="times" size={20} color="#FFF" />
                        </Pressable>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.totalSection}>
                            <ThemedText style={styles.totalText}>Total AC: {totalAC}</ThemedText>
                        </View>

                        <View style={styles.breakdownSection}>
                            <ThemedText style={styles.sectionTitle}>Breakdown:</ThemedText>
                            
                            <View style={styles.breakdownItem}>
                                <ThemedText style={styles.itemLabel}>Base AC (10 + DEX)</ThemedText>
                                <ThemedText style={styles.itemValue}>10 + {character.base.dex} = {baseAC}</ThemedText>
                            </View>

                            {character.inventory.armor && (
                                <>
                                    <View style={styles.breakdownItem}>
                                        <ThemedText style={styles.itemLabel}>Armor ({character.inventory.armor.name})</ThemedText>
                                        <ThemedText style={styles.itemValue}>+{armorAC}</ThemedText>
                                    </View>
                                    
                                    {enchantmentAC > 0 && (
                                        <View style={styles.breakdownItem}>
                                            <ThemedText style={styles.itemLabel}>Enchantment Bonus</ThemedText>
                                            <ThemedText style={styles.itemValue}>+{enchantmentAC}</ThemedText>
                                        </View>
                                    )}
                                </>
                            )}

                            <View style={styles.breakdownItem}>
                                <ThemedText style={styles.itemLabel}>
                                    Dodge Skill {character.inventory.armor.armorClassification !== "Light" ? 
                                        `(${originalDodge} ${character.inventory.armor.armorClassification === "Medium" ? "-1" : "blocked"})` : 
                                        ""
                                    }
                                </ThemedText>
                                <ThemedText style={styles.itemValue}>+{dodgeAC}</ThemedText>
                            </View>

                            {equipmentItems.length > 0 && (
                                <>
                                    <ThemedText style={styles.subsectionTitle}>Equipment Bonuses:</ThemedText>
                                    {equipmentItems.map((item: Equipment, index: number) => (
                                        <View key={index} style={styles.breakdownItem}>
                                            <ThemedText style={styles.itemLabel}>{item.name}</ThemedText>
                                            <ThemedText style={styles.itemValue}>+{item.statModifier}</ThemedText>
                                        </View>
                                    ))}
                                </>
                            )}

                            {consumableItems.length > 0 && (
                                <>
                                    <ThemedText style={styles.subsectionTitle}>Consumable Effects:</ThemedText>
                                    {consumableItems.map((item: Consumable, index: number) => (
                                        <View key={index} style={styles.breakdownItem}>
                                            <ThemedText style={styles.itemLabel}>{item.name}</ThemedText>
                                            <ThemedText style={styles.itemValue}>+{item.statModifier}</ThemedText>
                                        </View>
                                    ))}
                                </>
                            )}
                        </View>

                        {character.inventory.armor.armorClassification !== "Light" && (
                            <View style={styles.noteSection}>
                                <ThemedText style={styles.noteTitle}>Armor Penalties:</ThemedText>
                                <ThemedText style={styles.noteText}>
                                    {character.inventory.armor.armorClassification === "Medium" 
                                        ? "Medium armor reduces Dodge skill by 1 (minimum 0)"
                                        : "Heavy armor completely blocks Dodge skill bonus"
                                    }
                                </ThemedText>
                            </View>
                        )}
                    </ScrollView>
                </ThemedView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "90%",
        maxHeight: "80%",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#4a4a4a",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: 20,
    },
    totalSection: {
        alignItems: "center",
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    totalText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2c3e50",
    },
    breakdownSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#2c3e50",
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 15,
        marginBottom: 10,
        color: "#34495e",
    },
    breakdownItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 4,
        backgroundColor: "#f8f9fa",
        borderRadius: 6,
    },
    itemLabel: {
        flex: 1,
        fontSize: 14,
        color: "#495057",
    },
    itemValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#28a745",
    },
    noteSection: {
        padding: 15,
        backgroundColor: "#fff3cd",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#ffc107",
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#856404",
        marginBottom: 5,
    },
    noteText: {
        fontSize: 12,
        color: "#856404",
        lineHeight: 16,
    },
});
