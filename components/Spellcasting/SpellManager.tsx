import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { fetchDndSpells } from "@/services/dndSpellsService";
import { RootState } from "@/store/rootReducer";
import { updateField, updateMultipleFields } from "@/store/slices/baseSlice";
import { Spell, addSpell, removeSpell } from "@/store/slices/magicSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ListManagerDesktop } from "../Common/ListManager.desktop";
import { ThemedText } from "../ThemedText";

export function SpellManager() {
    const cssStyle = useResponsiveStyles();
    const { isDesktop } = useResponsive();
    const magic = useSelector((state: RootState) => state.character?.magic || { magicSchools: [], spells: [], magicSchoolCredit: false });
    const base = useSelector((state: RootState) => state.character?.base || { buildPointsRemaining: 0, buildPointsSpent: 0, energy: 0 });
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [availableSpells, setAvailableSpells] = useState<Omit<Spell, "id">[]>([]);
    const [loading, setLoading] = useState(false);

    // Load spells from database when modal opens
    useEffect(() => {
        if (modalVisible) {
            loadAvailableSpells();
        }
    }, [modalVisible, magic.magicSchools, magic.spells]);

    const loadAvailableSpells = async () => {
        setLoading(true);
        try {
            const result = await fetchDndSpells();
            if (result.success && result.data) {
                // Transform D&D spells to match our Spell interface
                const transformedSpells = result.data
                    .filter(
                        (dndSpell: any) =>
                            // Only show spells from schools the character knows
                            magic.magicSchools?.some((school) => school.name === dndSpell.school) &&
                            // Don't show spells the character already knows
                            !magic.spells?.some((knownSpell) => knownSpell.name === dndSpell.name)
                    )
                    .map((dndSpell: any) => ({
                        name: dndSpell.name,
                        school: dndSpell.school,
                        description: dndSpell.description || "",
                        // Calculate costs based on formulas:
                        // EP = Cantrips cost 0, others use: CEILING((level+1)^1.8)
                        // BP = (Spell Level + 1)^2 + 2
                        energyCost: dndSpell.level === 0 ? 0 : Math.ceil(Math.pow(dndSpell.level + 1, 1.8)),
                        buildPointCost: Math.pow(dndSpell.level + 1, 2) + 2,
                        damage: dndSpell.damage_at_slot_level
                            ? Object.values(dndSpell.damage_at_slot_level)[0] + " " + (dndSpell.damage_type || "damage")
                            : undefined,
                        range: dndSpell.range,
                        area: dndSpell.area_of_effect_type ? `${dndSpell.area_of_effect_size}-foot ${dndSpell.area_of_effect_type}` : undefined,
                        duration: dndSpell.duration,
                    }));
                setAvailableSpells(transformedSpells);
            }
        } catch (error) {
            console.error("Error loading spells:", error);
        } finally {
            setLoading(false);
        }
    };

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
        if (!spell) {
            return;
        }

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

    const [expandedSpells, setExpandedSpells] = useState<Set<string>>(new Set());

    const toggleSpellExpanded = (spellId: string) => {
        setExpandedSpells((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(spellId)) {
                newSet.delete(spellId);
            } else {
                newSet.add(spellId);
            }
            return newSet;
        });
    };

    const renderSpellItem = ({ item: spell }: { item: Spell }) => {
        const isExpanded = expandedSpells.has(spell.id);
        const cardStyle = isDesktop ? cssStyle.card : cssStyle.compactCard;
        const chevronSize = isDesktop ? 12 : 10;
        const textSize = isDesktop ? undefined : 10;
        const labelSize = isDesktop ? undefined : 10;

        return (
            <View style={[{ overflow: "visible" }]}>
                <View style={[cssStyle.statRow, { paddingVertical: 2 }]}>
                    <Pressable onPress={() => toggleSpellExpanded(spell.id)} style={{ flexDirection: "row", alignItems: "center", paddingRight: 8 }}>
                        <FontAwesome name={isExpanded ? "chevron-down" : "chevron-right"} size={chevronSize} color="#666" style={{ marginRight: 4 }} />
                        <View style={{}}>
                            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                                <ThemedText style={[cssStyle.subtitle, textSize && { fontSize: textSize }]}>{spell.name}</ThemedText>
                                <ThemedText style={[cssStyle.label, { marginLeft: 4, color: "#4CAF50" }, labelSize && { fontSize: labelSize }]}>
                                    {spell.school}
                                </ThemedText>
                                <ThemedText style={[cssStyle.label, { marginLeft: 4 }, labelSize && { fontSize: labelSize }]}>{spell.energyCost} EP</ThemedText>
                            </View>
                        </View>
                    </Pressable>
                    <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 0 }}>
                        {(base.energy || 0) >= spell.energyCost ? (
                            <Pressable
                                style={[cssStyle.primaryButton, { marginRight: 4, paddingHorizontal: isDesktop ? 12 : 8, paddingVertical: isDesktop ? 10 : 3 }]}
                                onPress={() => handleUseSpell(spell)}
                                disabled={(base.energy || 0) < spell.energyCost}
                            >
                                <ThemedText style={[cssStyle.buttonText, { fontSize: isDesktop ? 20 : 14 }]}>Cast</ThemedText>
                            </Pressable>
                        ) : (
                            <ThemedText style={[cssStyle.hint, { marginRight: 4, color: "red", fontSize: isDesktop ? undefined : 10 }]}>
                                {isDesktop ? " Not Enough Energy " : "No EP"}
                            </ThemedText>
                        )}
                        <Pressable
                            onPress={() => {
                                handleRemoveSpell(spell.id);
                            }}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                            style={({ pressed }) => ({
                                padding: isDesktop ? 8 : 4,
                                backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
                                borderRadius: 4,
                                minWidth: isDesktop ? 40 : 30,
                                minHeight: isDesktop ? 40 : 30,
                                justifyContent: "center",
                                alignItems: "center",
                            })}
                        >
                            <FontAwesome name="trash" size={isDesktop ? 16 : 14} color="#f44336" />
                        </Pressable>
                    </View>
                </View>

                {isExpanded && (
                    <>
                        <ThemedText style={[cssStyle.bodyText, { marginTop: isDesktop ? 8 : 4, fontSize: isDesktop ? undefined : 11 }]}>
                            {spell.description}
                        </ThemedText>
                        <View style={[cssStyle.container, { marginTop: isDesktop ? 8 : 4 }]}>
                            {spell.damage && (
                                <View style={cssStyle.detailItem}>
                                    <ThemedText style={[cssStyle.label, labelSize && { fontSize: labelSize }]}>Damage:</ThemedText>
                                    <ThemedText style={[cssStyle.valueText, labelSize && { fontSize: labelSize }]}>{spell.damage}</ThemedText>
                                </View>
                            )}
                            {spell.range && (
                                <View style={cssStyle.detailItem}>
                                    <ThemedText style={[cssStyle.label, labelSize && { fontSize: labelSize }]}>Range:</ThemedText>
                                    <ThemedText style={[cssStyle.valueText, labelSize && { fontSize: labelSize }]}>{spell.range}</ThemedText>
                                </View>
                            )}
                            {spell.area && (
                                <View style={cssStyle.detailItem}>
                                    <ThemedText style={[cssStyle.label, labelSize && { fontSize: labelSize }]}>Area:</ThemedText>
                                    <ThemedText style={[cssStyle.valueText, labelSize && { fontSize: labelSize }]}>{spell.area}</ThemedText>
                                </View>
                            )}
                            {spell.duration && (
                                <View style={cssStyle.detailItem}>
                                    <ThemedText style={[cssStyle.label, labelSize && { fontSize: labelSize }]}>Duration:</ThemedText>
                                    <ThemedText style={[cssStyle.valueText, labelSize && { fontSize: labelSize }]}>{spell.duration}</ThemedText>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </View>
        );
    };

    return (
        <>
            <ListManagerDesktop<Spell>
                title="Spells"
                description={`${magic.spells?.length || 0} spell${(magic.spells?.length || 0) !== 1 ? "s" : ""} learned`}
                data={[...magic.spells].sort((a, b) => (a.energyCost === b.energyCost ? a.name.localeCompare(b.name) : a.energyCost - b.energyCost)) || []}
                renderItem={renderSpellItem}
                keyExtractor={(item) => item.id}
                onAddPress={() => setModalVisible(true)}
                addButtonText="Learn Spell"
                emptyStateText="You haven't learned any spells yet. Learn a magic school first, then add spells from that school."
            />

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <Pressable style={cssStyle.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={cssStyle.modalView}>
                        <ThemedText style={[cssStyle.title, !isDesktop && { fontSize: 18 }]}>Learn New Spell</ThemedText>

                        {loading ? (
                            <View style={[cssStyle.centered, { paddingVertical: isDesktop ? 50 : 30 }]}>
                                <ActivityIndicator size="large" />
                                <ThemedText style={{ marginTop: 16, fontSize: isDesktop ? undefined : 14 }}>Loading available spells...</ThemedText>
                            </View>
                        ) : (
                            <FlatList
                                data={availableSpells}
                                keyExtractor={(item) => item.name}
                                renderItem={({ item }: { item: Omit<Spell, "id"> }) => (
                                    <Pressable style={isDesktop ? cssStyle.card : cssStyle.compactCard} onPress={() => handleLearnSpell(item)}>
                                        <View style={cssStyle.headerRow}>
                                            <ThemedText style={[cssStyle.subtitle, !isDesktop && { fontSize: 14 }]}>{item.name}</ThemedText>
                                            <ThemedText style={[cssStyle.subtitle, { color: "#4CAF50" }, !isDesktop && { fontSize: 14 }]}>
                                                {item.buildPointCost} BP
                                            </ThemedText>
                                        </View>
                                        <ThemedText style={[cssStyle.bodyText, { fontStyle: "italic" }, !isDesktop && { fontSize: 11 }]}>
                                            {item.school}
                                        </ThemedText>
                                        <ThemedText style={[cssStyle.bodyText, !isDesktop && { fontSize: 11 }]}>{item.description}</ThemedText>
                                        <View style={[cssStyle.row, { flexWrap: "wrap", marginTop: isDesktop ? 8 : 4 }]}>
                                            <ThemedText style={[cssStyle.valueText, !isDesktop && { fontSize: 10, marginRight: 8 }]}>
                                                Energy: {item.energyCost}
                                            </ThemedText>
                                            {item.damage ? (
                                                <ThemedText style={[cssStyle.valueText, !isDesktop && { fontSize: 10 }]}>Damage: {item.damage}</ThemedText>
                                            ) : null}
                                        </View>
                                    </Pressable>
                                )}
                                ListEmptyComponent={
                                    <ThemedText style={[cssStyle.emptyText, !isDesktop && { fontSize: 14 }]}>
                                        {magic.magicSchools?.length > 0
                                            ? "You've learned all available spells for your magic schools!"
                                            : "You need to learn a magic school before you can learn spells."}
                                    </ThemedText>
                                }
                            />
                        )}

                        <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                            <ThemedText style={cssStyle.buttonText}>Close</ThemedText>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
