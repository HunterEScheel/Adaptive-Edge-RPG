import { cssStyle } from "@/app/styles/phone";
import { ListManager } from "@/components/Common/ListManager";
import { RootState } from "@/store/rootReducer";
import { updateField, updateMultipleFields } from "@/store/slices/baseSlice";
import { Spell, addSpell, removeSpell } from "@/store/slices/magicSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// List of available spells organized by school
const AVAILABLE_SPELLS: Omit<Spell, "id">[] = [
    {
        name: "Fireball",
        school: "Evocation",
        description: "A bright streak flashes from your pointing finger to a point you choose and then blossoms with a low roar into an explosion of flame.",
        energyCost: 13,
        buildPointCost: 18,
        damage: "8d6 fire damage",
        range: "150 feet",
        area: "20-foot radius sphere",
        duration: "Instantaneous",
    },
    // More spells can be added here
];

export function SpellManager() {
    const magic = useSelector((state: RootState) => state.character?.magic || { magicSchools: [], spells: [], magicSchoolCredit: false });
    const base = useSelector((state: RootState) => state.character?.base || { buildPointsRemaining: 0, buildPointsSpent: 0, energy: 0 });
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);

    // Filter spells based on known magic schools
    const availableSpells = AVAILABLE_SPELLS.filter(
        (spell) => magic.magicSchools?.some((school) => school.name === spell.school) && !magic.spells?.some((knownSpell) => knownSpell.name === spell.name)
    );

    const handleLearnSpell = (spell: Omit<Spell, "id">) => {
        // Check if character has enough build points
        if (base.buildPointsRemaining >= spell.buildPointCost) {
            // Deduct build points and add the spell
            const newBuildPoints = base.buildPointsRemaining - spell.buildPointCost;
            dispatch(addSpell(spell));
            // Update both buildPointsRemaining and buildPointsSpent
            dispatch(
                updateMultipleFields([
                    { field: "buildPointsRemaining", value: newBuildPoints },
                    { field: "buildPointsSpent", value: base.buildPointsSpent + spell.buildPointCost },
                ])
            );
            setModalVisible(false);
        } else {
            Alert.alert(
                "Not Enough Build Points",
                `You need ${spell.buildPointCost} build points to learn this spell. You currently have ${base.buildPointsRemaining}.`
            );
        }
    };

    const handleRemoveSpell = (spellId: string) => {
        // Find the spell to get its cost for refund
        const spell = magic.spells?.find((s) => s.id === spellId);
        if (!spell) return;

        // Confirm before removing
        Alert.alert("Remove Spell", `Are you sure you want to remove ${spell.name}? You will receive ${spell.buildPointCost} build points back.`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => {
                    // Refund build points and remove the spell
                    const newBuildPoints = base.buildPointsRemaining + spell.buildPointCost;
                    dispatch(removeSpell(spellId));
                    // Update both buildPointsRemaining and buildPointsSpent
                    dispatch(
                        updateMultipleFields([
                            { field: "buildPointsRemaining", value: newBuildPoints },
                            { field: "buildPointsSpent", value: base.buildPointsSpent - spell.buildPointCost },
                        ])
                    );
                },
            },
        ]);
    };

    // Handle using a spell (spending energy)
    const handleUseSpell = (spell: Spell) => {
        // Check if character has enough energy
        if ((base.energy || 0) < spell.energyCost) {
            Alert.alert("Not Enough Energy", `You need ${spell.energyCost} energy to cast ${spell.name}. You have ${base.energy || 0} energy.`);
            return;
        }

        // Spend the energy
        dispatch(
            updateField({
                field: "energy",
                value: base.energy - spell.energyCost,
            })
        );

        // Show success message
        Alert.alert("Spell Cast", `${spell.name} cast successfully! ${spell.energyCost} energy spent.`, [{ text: "OK" }]);
    };

    const renderSpellItem = ({ item: spell }: { item: Spell }) => (
        <View style={cssStyle.card}>
            <View style={cssStyle.spaceBetween}>
                <View style={{ flex: 1 }}>
                    <ThemedText style={cssStyle.subtitle}>{spell.name}</ThemedText>
                    <ThemedText style={[cssStyle.bodyText, { fontStyle: "italic", color: "#4CAF50" }]}>{spell.school}</ThemedText>
                </View>
                <Pressable style={{ padding: 8 }} onPress={() => handleRemoveSpell(spell.id)}>
                    <FontAwesome name="trash" size={16} color="#f44336" />
                </Pressable>
            </View>
            <ThemedText style={cssStyle.bodyText}>{spell.description}</ThemedText>
            <View style={[cssStyle.container, { marginTop: 8 }]}>
                <View style={cssStyle.detailItem}>
                    <ThemedText style={cssStyle.label}>Energy Cost:</ThemedText>
                    <ThemedText style={cssStyle.valueText}>{spell.energyCost}</ThemedText>
                </View>
                {spell.damage && (
                    <View style={cssStyle.detailItem}>
                        <ThemedText style={cssStyle.label}>Damage:</ThemedText>
                        <ThemedText style={cssStyle.valueText}>{spell.damage}</ThemedText>
                    </View>
                )}
                {spell.range && (
                    <View style={cssStyle.detailItem}>
                        <ThemedText style={cssStyle.label}>Range:</ThemedText>
                        <ThemedText style={cssStyle.valueText}>{spell.range}</ThemedText>
                    </View>
                )}
                {spell.area && (
                    <View style={cssStyle.detailItem}>
                        <ThemedText style={cssStyle.label}>Area:</ThemedText>
                        <ThemedText style={cssStyle.valueText}>{spell.area}</ThemedText>
                    </View>
                )}
                {spell.duration && (
                    <View style={cssStyle.detailItem}>
                        <ThemedText style={cssStyle.label}>Duration:</ThemedText>
                        <ThemedText style={cssStyle.valueText}>{spell.duration}</ThemedText>
                    </View>
                )}
                <Pressable
                    style={[(base.energy || 0) < spell.energyCost ? cssStyle.disabledButton : cssStyle.primaryButton]}
                    onPress={() => handleUseSpell(spell)}
                    disabled={(base.energy || 0) < spell.energyCost}
                >
                    <ThemedText>Cast Spell</ThemedText>
                </Pressable>
            </View>
        </View>
    );

    return (
        <>
            <ListManager<Spell>
                title="Spells"
                description={`${magic.spells?.length || 0} spell${(magic.spells?.length || 0) !== 1 ? 's' : ''} learned`}
                data={magic.spells || []}
                renderItem={renderSpellItem}
                keyExtractor={(item) => item.id}
                onAddPress={() => setModalVisible(true)}
                addButtonText="Learn Spell"
                emptyStateText="You haven't learned any spells yet. Learn a magic school first, then add spells from that school."
            />

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={cssStyle.centeredView}>
                    <ThemedView style={cssStyle.modalView}>
                        <ThemedText style={cssStyle.title}>Learn New Spell</ThemedText>

                        <FlatList
                            data={availableSpells}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }: { item: Omit<Spell, "id"> }) => (
                                <Pressable style={cssStyle.card} onPress={() => handleLearnSpell(item)}>
                                    <View style={cssStyle.spaceBetween}>
                                        <ThemedText style={cssStyle.subtitle}>{item.name}</ThemedText>
                                        <ThemedText style={[cssStyle.subtitle, { color: "#4CAF50" }]}>{item.buildPointCost} BP</ThemedText>
                                    </View>
                                    <ThemedText style={[cssStyle.bodyText, { fontStyle: "italic" }]}>{item.school}</ThemedText>
                                    <ThemedText style={cssStyle.bodyText}>{item.description}</ThemedText>
                                    <View style={[cssStyle.row, { flexWrap: "wrap" }]}>
                                        <ThemedText style={cssStyle.valueText}>
                                            Energy: {item.energyCost}
                                        </ThemedText>
                                        {item.damage ? (
                                            <ThemedText style={cssStyle.valueText}>
                                                Damage: {item.damage}
                                            </ThemedText>
                                        ) : null}
                                    </View>
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <ThemedText style={cssStyle.emptyText}>
                                    {magic.magicSchools?.length > 0
                                        ? "You've learned all available spells for your magic schools!"
                                        : "You need to learn a magic school before you can learn spells."}
                                </ThemedText>
                            }
                        />

                        <Pressable style={cssStyle.dangerButton} onPress={() => setModalVisible(false)}>
                            <ThemedText style={cssStyle.buttonText}>Close</ThemedText>
                        </Pressable>
                    </ThemedView>
                </View>
            </Modal>
        </>
    );
}
