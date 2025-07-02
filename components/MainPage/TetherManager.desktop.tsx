import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { Tether, addTether, removeTether, setMinimumTotalObligation, updateTether } from "@/store/slices/tethersSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function TetherManagerDesktop() {
    const cssStyle = useResponsiveStyles();
    const dispatch = useDispatch();
    const tethers = useSelector((state: RootState) => state.character?.tethers?.tethers || []);
    const minimumTotal = useSelector((state: RootState) => state.character?.tethers?.minimumTotalObligation || 10);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingTether, setEditingTether] = useState<Tether | null>(null);
    const [editingMinimum, setEditingMinimum] = useState(false);
    const [tempMinimum, setTempMinimum] = useState(minimumTotal.toString());
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        obligationLevel: 1,
    });

    const totalObligation = tethers.reduce((sum, t) => sum + t.obligationLevel, 0);
    const isMinimumMet = totalObligation >= minimumTotal;

    const handleAddEdit = () => {
        if (editingTether) {
            setFormData({
                name: editingTether.name,
                description: editingTether.description,
                obligationLevel: editingTether.obligationLevel,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                obligationLevel: 1,
            });
        }
        setModalVisible(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            Alert.alert("Name Required", "Please enter a name for this tether.");
            return;
        }

        if (editingTether) {
            dispatch(
                updateTether({
                    ...editingTether,
                    ...formData,
                })
            );
        } else {
            dispatch(addTether(formData));
        }

        setModalVisible(false);
        setEditingTether(null);
    };

    const handleDelete = (tetherId: string) => {
        Alert.alert("Remove Tether", "Are you sure you want to remove this tether?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => dispatch(removeTether(tetherId)),
            },
        ]);
    };

    const renderTetherItem = ({ item }: { item: Tether }) => {
        return (
            <View style={[cssStyle.card, { marginBottom: 16, maxWidth: 800, alignSelf: "center", width: "100%" }]}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <View style={{ flex: 1, marginRight: 16 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                            <ThemedText style={[cssStyle.subtitle, { fontSize: 20 }]}>{item.name}</ThemedText>
                            <View style={[cssStyle.badge, { backgroundColor: "#2196F3", marginLeft: 12 }]}>
                                <ThemedText style={{ color: "white", fontSize: 16, fontWeight: "bold", paddingHorizontal: 4 }}>
                                    {item.obligationLevel}
                                </ThemedText>
                            </View>
                        </View>
                        <ThemedText style={[cssStyle.bodyText, { fontSize: 16, lineHeight: 24 }]}>{item.description}</ThemedText>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Pressable
                            onPress={() => {
                                setEditingTether(item);
                                handleAddEdit();
                            }}
                            style={[cssStyle.secondaryButton, { marginRight: 8, paddingHorizontal: 16, paddingVertical: 8 }]}
                        >
                            <FontAwesome name="edit" size={16} color="#666" />
                        </Pressable>
                        <Pressable onPress={() => handleDelete(item.id)} style={[cssStyle.secondaryButton, { paddingHorizontal: 16, paddingVertical: 8 }]}>
                            <FontAwesome name="trash" size={16} color="#e74c3c" />
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <ThemedView style={[cssStyle.container, { padding: 24 }]}>
            {/* Header with obligation tracking */}
            <View
                style={[
                    cssStyle.card,
                    { marginBottom: 24, maxWidth: 800, alignSelf: "center", width: "100%", backgroundColor: isMinimumMet ? "#27ae6020" : "#e74c3c20" },
                ]}
            >
                <View style={cssStyle.headerRow}>
                    <View>
                        <ThemedText style={[cssStyle.title, { fontSize: 28 }]}>Tethers</ThemedText>
                        <ThemedText style={[cssStyle.label, { fontSize: 16 }]}>Connections that bind you to the world</ThemedText>
                    </View>
                    <Pressable
                        style={[cssStyle.primaryButton, { paddingHorizontal: 24, paddingVertical: 12 }]}
                        onPress={() => {
                            setEditingTether(null);
                            handleAddEdit();
                        }}
                    >
                        <ThemedText style={[cssStyle.buttonText, { fontSize: 16 }]}>Add Tether</ThemedText>
                    </Pressable>
                </View>

                <View style={[cssStyle.divider, { marginVertical: 16 }]} />

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 32 }}>
                        <View>
                            <ThemedText style={[cssStyle.label, { fontSize: 14 }]}>Total Obligation</ThemedText>
                            <ThemedText style={[cssStyle.largeValue, { color: isMinimumMet ? "#27ae60" : "#e74c3c", fontSize: 36 }]}>
                                {totalObligation} / {minimumTotal}
                            </ThemedText>
                        </View>
                        {!isMinimumMet && (
                            <View style={[cssStyle.badge, { backgroundColor: "#e74c3c", paddingHorizontal: 16, paddingVertical: 8 }]}>
                                <ThemedText style={{ color: "white", fontSize: 14 }}>Need {minimumTotal - totalObligation} more</ThemedText>
                            </View>
                        )}
                    </View>
                    <Pressable
                        onPress={() => {
                            setTempMinimum(minimumTotal.toString());
                            setEditingMinimum(true);
                        }}
                        style={[cssStyle.secondaryButton, { paddingHorizontal: 16, paddingVertical: 8 }]}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <ThemedText style={[cssStyle.buttonText, { marginRight: 8 }]}>Edit Minimum</ThemedText>
                            <FontAwesome name="edit" size={14} color="#666" />
                        </View>
                    </Pressable>
                </View>
            </View>

            {/* Tethers List */}
            <FlatList
                data={tethers}
                keyExtractor={(item) => item.id}
                renderItem={renderTetherItem}
                contentContainerStyle={{ paddingBottom: 24 }}
                ListEmptyComponent={
                    <View style={[cssStyle.emptyState, { padding: 48 }]}>
                        <FontAwesome name="chain-broken" size={64} color="#ccc" style={{ marginBottom: 24 }} />
                        <ThemedText style={[cssStyle.emptyStateText, { fontSize: 18, maxWidth: 600, textAlign: "center" }]}>
                            No tethers yet. Add connections to people, places, ideals, or organizations that motivate your character.
                        </ThemedText>
                    </View>
                }
            />

            {/* Add/Edit Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <Pressable style={cssStyle.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={[cssStyle.modalView, { maxWidth: 600, width: "90%", padding: 32 }]} onPress={(e) => e.stopPropagation()}>
                        <ThemedText style={[cssStyle.modalTitle, { fontSize: 24, marginBottom: 24 }]}>
                            {editingTether ? "Edit Tether" : "Add New Tether"}
                        </ThemedText>

                            <View style={[cssStyle.formGroup, { marginBottom: 20 }]}>
                                <ThemedText style={[cssStyle.inputLabel, { fontSize: 16 }]}>Name</ThemedText>
                                <TextInput
                                    style={[cssStyle.input, { fontSize: 16, padding: 16 }]}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder="e.g., family Debt, missing friend"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={[cssStyle.formGroup, { marginBottom: 20 }]}>
                                <ThemedText style={[cssStyle.inputLabel, { fontSize: 16 }]}>Obligation Level ({formData.obligationLevel})</ThemedText>
                                <ThemedText style={[cssStyle.label, { marginBottom: 12, fontSize: 14 }]}>
                                    How strongly does this tether motivate your actions?
                                </ThemedText>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                                    <FlatList
                                        data={[1, 2, 3, 4, 5]}
                                        renderItem={({ item }) => (
                                            <Pressable
                                                onPress={() => setFormData({ ...formData, obligationLevel: item })}
                                                style={[
                                                    {
                                                        flex: 1,
                                                        padding: 16,
                                                        margin: 4,
                                                        borderRadius: 8,
                                                        backgroundColor: formData.obligationLevel === item ? "#2196F3" : "#f0f0f0",
                                                        alignItems: "center",
                                                    }
                                                ]}>
                                                <ThemedText style={[cssStyle.smallText, { fontSize: 16 }]}>{item}</ThemedText>
                                                </Pressable>
                                        )}
                                        keyExtractor={(item) => item.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center" }]}>Minor</ThemedText>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center" }]}>Moderate</ThemedText>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center" }]}>Major</ThemedText>
                                </View>
                            </View>

                            <View style={[cssStyle.formGroup, { marginBottom: 20 }]}>
                                <ThemedText style={[cssStyle.inputLabel, { fontSize: 16 }]}>Description</ThemedText>
                                <TextInput
                                    style={[cssStyle.textArea, { height: 120, fontSize: 16, padding: 16 }]}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    placeholder="Describe this connection and why it matters to your character..."
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={5}
                                />
                            </View>

                        <View style={{ flexDirection: "row", gap: 16, marginTop: 24 }}>
                            <Pressable
                                style={[cssStyle.secondaryButton, { flex: 1, paddingVertical: 14 }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditingTether(null);
                                }}
                            >
                                <ThemedText style={[cssStyle.buttonText, { fontSize: 16 }]}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable style={[cssStyle.primaryButton, { flex: 1, paddingVertical: 14 }]} onPress={handleSave}>
                                <ThemedText style={[cssStyle.buttonText, { color: "white", fontSize: 16 }]}>{editingTether ? "Update" : "Add"}</ThemedText>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Edit Minimum Modal */}
            <Modal animationType="slide" transparent={true} visible={editingMinimum} onRequestClose={() => setEditingMinimum(false)}>
                <Pressable style={cssStyle.modalOverlay} onPress={() => setEditingMinimum(false)}>
                    <Pressable style={[cssStyle.modalView, { maxWidth: 500, width: "90%", padding: 32 }]} onPress={(e) => e.stopPropagation()}>
                        <ThemedText style={[cssStyle.modalTitle, { fontSize: 24, marginBottom: 16 }]}>Set Minimum Obligation</ThemedText>

                        <ThemedText style={[cssStyle.bodyText, { marginBottom: 24, fontSize: 16, lineHeight: 24 }]}>
                            Set the minimum total obligation level that characters must maintain across all their tethers.
                        </ThemedText>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={[cssStyle.inputLabel, { fontSize: 16 }]}>Minimum Total Obligation</ThemedText>
                            <TextInput
                                style={[cssStyle.input, { fontSize: 18, padding: 16 }]}
                                value={tempMinimum}
                                onChangeText={setTempMinimum}
                                keyboardType="numeric"
                                placeholder="10"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={{ flexDirection: "row", gap: 16, marginTop: 24 }}>
                            <Pressable style={[cssStyle.secondaryButton, { flex: 1, paddingVertical: 14 }]} onPress={() => setEditingMinimum(false)}>
                                <ThemedText style={[cssStyle.buttonText, { fontSize: 16 }]}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable
                                style={[cssStyle.primaryButton, { flex: 1, paddingVertical: 14 }]}
                                onPress={() => {
                                    const value = parseInt(tempMinimum) || 10;
                                    dispatch(setMinimumTotalObligation(Math.max(0, value)));
                                    setEditingMinimum(false);
                                }}
                            >
                                <ThemedText style={[cssStyle.buttonText, { color: "white", fontSize: 16 }]}>Set</ThemedText>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </ThemedView>
    );
}
