import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { fetchDndSpells } from "@/services/dndSpellsService";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, TextInput, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface DndSpell {
    id: string;
    name: string;
    level: number;
    school: string;
    description: string;
    higher_level?: string;
    range: string;
    components: string[];
    material?: string;
    ritual: boolean;
    duration: string;
    concentration: boolean;
    casting_time: string;
    damage_type?: string;
    damage_at_slot_level?: any;
    area_of_effect_type?: string;
    area_of_effect_size?: number;
    attack_type?: string;
}

export function DndSpellManager() {
    const cssStyle = useResponsiveStyles();
    const { isMobile } = useResponsive();
    const [spells, setSpells] = useState<DndSpell[]>([]);
    const [filteredSpells, setFilteredSpells] = useState<DndSpell[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpell, setSelectedSpell] = useState<DndSpell | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Spell levels for filtering
    const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const spellSchools = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];

    useEffect(() => {
        loadSpells();
    }, []);

    useEffect(() => {
        filterSpells();
    }, [searchQuery, selectedLevel, selectedSchool, spells]);

    const loadSpells = async () => {
        setLoading(true);
        const result = await fetchDndSpells();
        if (result.success && result.data) {
            setSpells(result.data);
            setFilteredSpells(result.data);
        }
        setLoading(false);
    };

    const filterSpells = () => {
        let filtered = [...spells];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (spell) =>
                    spell.name.toLowerCase().includes(query) || spell.description.toLowerCase().includes(query) || spell.school.toLowerCase().includes(query)
            );
        }

        // Filter by level
        if (selectedLevel !== null) {
            filtered = filtered.filter((spell) => spell.level === selectedLevel);
        }

        // Filter by school
        if (selectedSchool) {
            filtered = filtered.filter((spell) => spell.school === selectedSchool);
        }

        setFilteredSpells(filtered);
    };

    const handleSpellPress = (spell: DndSpell) => {
        setSelectedSpell(spell);
        setModalVisible(true);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedLevel(null);
        setSelectedSchool(null);
    };

    const getLevelText = (level: number) => {
        return level === 0 ? "Cantrip" : `Level ${level}`;
    };

    const renderSpellItem = ({ item }: { item: DndSpell }) => (
        <Pressable style={cssStyle.card} onPress={() => handleSpellPress(item)}>
            <View style={cssStyle.headerRow}>
                <View style={{}}>
                    <ThemedText style={cssStyle.subtitle}>{item.name}</ThemedText>
                    <View style={cssStyle.row}>
                        <ThemedText style={[cssStyle.label, { marginRight: 8 }]}>{getLevelText(item.level)}</ThemedText>
                        <ThemedText style={[cssStyle.label, { color: "#4CAF50" }]}>{item.school}</ThemedText>
                    </View>
                </View>
                {item.ritual && (
                    <View style={[cssStyle.badge, { backgroundColor: "#2196F3" }]}>
                        <ThemedText style={{ color: "white", fontSize: 10 }}>Ritual</ThemedText>
                    </View>
                )}
                {item.concentration && (
                    <View style={[cssStyle.badge, { backgroundColor: "#FF9800", marginLeft: 4 }]}>
                        <ThemedText style={{ color: "white", fontSize: 10 }}>Conc.</ThemedText>
                    </View>
                )}
            </View>
            <ThemedText style={cssStyle.bodyText} numberOfLines={2}>
                {item.description}
            </ThemedText>
            <View style={[cssStyle.row, { marginTop: 8, flexWrap: "wrap" }]}>
                <ThemedText style={[cssStyle.label, { marginRight: 16 }]}>Cast: {item.casting_time}</ThemedText>
                <ThemedText style={[cssStyle.label, { marginRight: 16 }]}>Range: {item.range}</ThemedText>
                <ThemedText style={cssStyle.label}>Duration: {item.duration}</ThemedText>
            </View>
        </Pressable>
    );

    const renderSpellModal = () => {
        if (!selectedSpell) return null;

        return (
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <Pressable style={cssStyle.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={[cssStyle.modalView, { maxHeight: "90%" }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <ThemedText style={cssStyle.title}>{selectedSpell.name}</ThemedText>

                            <View style={[cssStyle.row, { marginBottom: 16 }]}>
                                <ThemedText style={[cssStyle.subtitle, { marginRight: 16 }]}>{getLevelText(selectedSpell.level)}</ThemedText>
                                <ThemedText style={[cssStyle.subtitle, { color: "#4CAF50" }]}>{selectedSpell.school}</ThemedText>
                            </View>

                            <View style={cssStyle.divider} />

                            <View style={cssStyle.sectionItem}>
                                <ThemedText style={cssStyle.label}>Casting Time</ThemedText>
                                <ThemedText style={cssStyle.valueText}>{selectedSpell.casting_time}</ThemedText>
                            </View>

                            <View style={cssStyle.sectionItem}>
                                <ThemedText style={cssStyle.label}>Range</ThemedText>
                                <ThemedText style={cssStyle.valueText}>{selectedSpell.range}</ThemedText>
                            </View>

                            <View style={cssStyle.sectionItem}>
                                <ThemedText style={cssStyle.label}>Components</ThemedText>
                                <ThemedText style={cssStyle.valueText}>{selectedSpell.components.join(", ")}</ThemedText>
                                {selectedSpell.material && (
                                    <ThemedText style={[cssStyle.bodyText, { marginTop: 4, fontStyle: "italic" }]}>
                                        Material: {selectedSpell.material}
                                    </ThemedText>
                                )}
                            </View>

                            <View style={cssStyle.sectionItem}>
                                <ThemedText style={cssStyle.label}>Duration</ThemedText>
                                <View style={cssStyle.row}>
                                    <ThemedText style={cssStyle.valueText}>{selectedSpell.duration}</ThemedText>
                                    {selectedSpell.concentration && (
                                        <View style={[cssStyle.badge, { backgroundColor: "#FF9800", marginLeft: 8 }]}>
                                            <ThemedText style={{ color: "white", fontSize: 10 }}>Concentration</ThemedText>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={cssStyle.divider} />

                            <View style={cssStyle.sectionItem}>
                                <ThemedText style={cssStyle.label}>Description</ThemedText>
                                <ThemedText style={cssStyle.bodyText}>{selectedSpell.description}</ThemedText>
                            </View>

                            {selectedSpell.higher_level && (
                                <View style={cssStyle.sectionItem}>
                                    <ThemedText style={cssStyle.label}>At Higher Levels</ThemedText>
                                    <ThemedText style={cssStyle.bodyText}>{selectedSpell.higher_level}</ThemedText>
                                </View>
                            )}

                            {selectedSpell.damage_at_slot_level && (
                                <View style={cssStyle.sectionItem}>
                                    <ThemedText style={cssStyle.label}>Damage</ThemedText>
                                    {Object.entries(selectedSpell.damage_at_slot_level).map(([level, damage]) => (
                                        <ThemedText key={level} style={cssStyle.bodyText}>
                                            Level {level}: {damage as string}
                                        </ThemedText>
                                    ))}
                                </View>
                            )}

                            {selectedSpell.area_of_effect_type && (
                                <View style={cssStyle.sectionItem}>
                                    <ThemedText style={cssStyle.label}>Area of Effect</ThemedText>
                                    <ThemedText style={cssStyle.valueText}>
                                        {selectedSpell.area_of_effect_size} ft {selectedSpell.area_of_effect_type}
                                    </ThemedText>
                                </View>
                            )}

                            {selectedSpell.ritual && (
                                <View style={[cssStyle.badge, { backgroundColor: "#2196F3", alignSelf: "flex-start", marginTop: 8 }]}>
                                    <ThemedText style={{ color: "white" }}>Can be cast as a ritual</ThemedText>
                                </View>
                            )}
                        </ScrollView>

                        <Pressable style={[cssStyle.primaryButton, { marginTop: 16 }]} onPress={() => setModalVisible(false)}>
                            <ThemedText style={cssStyle.buttonText}>Close</ThemedText>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        );
    };

    const renderFilters = () => (
        <View style={[cssStyle.sectionContainer, { backgroundColor: "#f5f5f5", padding: 16, marginBottom: 8 }]}>
            <View style={[cssStyle.row, { justifyContent: "space-between", marginBottom: 12 }]}>
                <ThemedText style={cssStyle.subtitle}>Filters</ThemedText>
                <Pressable onPress={clearFilters}>
                    <ThemedText style={{ color: "#2196F3" }}>Clear All</ThemedText>
                </Pressable>
            </View>

            <ThemedText style={cssStyle.label}>Spell Level</ThemedText>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
                data={[null, ...spellLevels]}
                keyExtractor={(item) => (item === null ? "all" : item.toString())}
                renderItem={({ item: level }) => (
                    <Pressable
                        style={[
                            { backgroundColor: "#f5f5f5", padding: 8, marginRight: 8, borderRadius: 4 },
                            selectedLevel === level && { backgroundColor: "#2196F3" },
                        ]}
                        onPress={() => setSelectedLevel(level)}
                    >
                        <ThemedText style={selectedLevel === level ? { color: "white" } : {}}>{level === null ? "All" : getLevelText(level)}</ThemedText>
                    </Pressable>
                )}
            />

            <ThemedText style={cssStyle.label}>School</ThemedText>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[null, ...spellSchools]}
                keyExtractor={(item) => (item === null ? "all" : item)}
                renderItem={({ item: school }) => (
                    <Pressable
                        style={[
                            { backgroundColor: "#f5f5f5", padding: 8, marginRight: 8, borderRadius: 4, borderColor: "#333", borderWidth: 1 },
                            selectedSchool === school && { backgroundColor: "#4CAF50" },
                        ]}
                        onPress={() => setSelectedSchool(school)}
                    >
                        <ThemedText style={selectedSchool === school ? { color: "white" } : {}}>{school === null ? "All" : school}</ThemedText>
                    </Pressable>
                )}
            />
        </View>
    );

    return (
        <ThemedView style={cssStyle.container}>
            <View style={[cssStyle.headerRow, { marginBottom: 16 }]}>
                <ThemedText style={cssStyle.title}>D&D 5e Spells</ThemedText>
                <ThemedText style={cssStyle.subtitle}>{filteredSpells.length} spells</ThemedText>
            </View>

            <View style={[cssStyle.inputContainer, { marginBottom: 8 }]}>
                <FontAwesome name="search" size={16} color="#666" style={{ marginRight: 8 }} />
                <TextInput
                    style={[cssStyle.input, {}]}
                    placeholder="Search spells..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
            </View>

            <Pressable style={[cssStyle.row, { marginBottom: 8 }]} onPress={() => setShowFilters(!showFilters)}>
                <FontAwesome name={showFilters ? "chevron-up" : "chevron-down"} size={16} color="#666" />
                <ThemedText style={{ marginLeft: 8 }}>{showFilters ? "Hide" : "Show"} Filters</ThemedText>
            </Pressable>

            {showFilters && renderFilters()}

            {loading ? (
                <View style={[cssStyle.centered, { marginTop: 50 }]}>
                    <ActivityIndicator size="large" />
                    <ThemedText style={{ marginTop: 16 }}>Loading spells...</ThemedText>
                </View>
            ) : (
                <FlatList
                    data={filteredSpells}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSpellItem}
                    ListEmptyComponent={
                        <ThemedText style={[cssStyle.emptyText, { marginTop: 50 }]}>
                            {searchQuery || selectedLevel !== null || selectedSchool ? "No spells match your filters" : "No spells available"}
                        </ThemedText>
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}

            {renderSpellModal()}
        </ThemedView>
    );
}
