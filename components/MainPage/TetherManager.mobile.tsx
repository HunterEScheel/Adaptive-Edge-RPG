import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { Tether, addTether, removeTether, setMinimumTotalObligation, updateTether } from "@/store/slices/tethersSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, ScrollView, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function TetherManagerMobile() {
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
            <View style={[cssStyle.compactCard]}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <ThemedText style={[cssStyle.subtitle, { flex: 1, fontSize: 14 }]}>{item.name}</ThemedText>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={[cssStyle.badge, { backgroundColor: "#2196F3", marginRight: 4, paddingHorizontal: 8, paddingVertical: 2 }]}>
                            <ThemedText style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>{item.obligationLevel}</ThemedText>
                        </View>
                        <Pressable
                            onPress={() => {
                                setEditingTether(item);
                                handleAddEdit();
                            }}
                            style={{ padding: 4 }}
                        >
                            <FontAwesome name="edit" size={14} color="#666" />
                        </Pressable>
                        <Pressable onPress={() => handleDelete(item.id)} style={{ padding: 4 }}>
                            <FontAwesome name="trash" size={14} color="#e74c3c" />
                        </Pressable>
                    </View>
                </View>
                <ThemedText style={[cssStyle.bodyText, { fontSize: 12 }]}>{item.description}</ThemedText>
            </View>
        );
    };

    return (
        <ThemedView style={[cssStyle.container, { padding: 16 }]}>
            {/* Header with obligation tracking */}
            <View style={[cssStyle.card, { marginBottom: 16, backgroundColor: isMinimumMet ? "#27ae6020" : "#e74c3c20", padding: 16 }]}>
                <View style={[cssStyle.headerRow, { marginBottom: 12 }]}>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={[cssStyle.title, { fontSize: 20 }]}>Tethers</ThemedText>
                        <ThemedText style={[cssStyle.label, { fontSize: 12 }]}>Connections that bind you</ThemedText>
                    </View>
                    <Pressable
                        style={[cssStyle.primaryButton, { paddingHorizontal: 16, paddingVertical: 8 }]}
                        onPress={() => {
                            setEditingTether(null);
                            handleAddEdit();
                        }}
                    >
                        <ThemedText style={[cssStyle.buttonText, { fontSize: 14 }]}>Add</ThemedText>
                    </Pressable>
                </View>

                <View style={[cssStyle.divider, { marginVertical: 12 }]} />

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <ThemedText style={[cssStyle.label, { fontSize: 12 }]}>Total Obligation</ThemedText>
                        <ThemedText style={[cssStyle.largeValue, { color: isMinimumMet ? "#27ae60" : "#e74c3c", fontSize: 24 }]}>
                            {totalObligation} / {minimumTotal}
                        </ThemedText>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        {!isMinimumMet && (
                            <View style={[cssStyle.badge, { backgroundColor: "#e74c3c", marginBottom: 4, paddingHorizontal: 8, paddingVertical: 4 }]}>
                                <ThemedText style={{ color: "white", fontSize: 12 }}>Need {minimumTotal - totalObligation} more</ThemedText>
                            </View>
                        )}
                        <Pressable
                            onPress={() => {
                                setTempMinimum(minimumTotal.toString());
                                setEditingMinimum(true);
                            }}
                            style={{ flexDirection: "row", alignItems: "center", padding: 4 }}
                        >
                            <ThemedText style={[cssStyle.smallText, { marginRight: 4, fontSize: 11 }]}>Edit Min</ThemedText>
                            <FontAwesome name="edit" size={12} color="#666" />
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Tethers List */}
            <FlatList
                data={tethers}
                keyExtractor={(item) => item.id}
                renderItem={renderTetherItem}
                contentContainerStyle={{ paddingBottom: 16 }}
                ListEmptyComponent={
                    <View style={[cssStyle.emptyState, { padding: 32 }]}>
                        <FontAwesome name="chain-broken" size={48} color="#ccc" style={{ marginBottom: 16 }} />
                        <ThemedText style={[cssStyle.emptyStateText, { fontSize: 14, textAlign: "center" }]}>
                            No tethers yet. Add connections to people, places, ideals, or organizations that motivate your character.
                        </ThemedText>
                    </View>
                }
            />

            {/* Add/Edit Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <Pressable style={cssStyle.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={[cssStyle.modalView, { width: "95%", padding: 20 }]} onPress={(e) => e.stopPropagation()}>
                        <ThemedText style={[cssStyle.modalTitle, { fontSize: 18, marginBottom: 16 }]}>
                            {editingTether ? "Edit Tether" : "Add New Tether"}
                        </ThemedText>

                        <ScrollView>
                            <View style={[cssStyle.formGroup, { marginBottom: 16 }]}>
                                <ThemedText style={[cssStyle.inputLabel, { fontSize: 14 }]}>Name</ThemedText>
                                <TextInput
                                    style={[cssStyle.input, { fontSize: 14, padding: 12 }]}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder="e.g. family debt"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={[cssStyle.formGroup, { marginBottom: 16 }]}>
                                <ThemedText style={[cssStyle.inputLabel, { fontSize: 14 }]}>Obligation Level ({formData.obligationLevel})</ThemedText>
                                <ThemedText style={[cssStyle.label, { marginBottom: 8, fontSize: 12 }]}>How strongly does this motivate you?</ThemedText>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <Pressable
                                            key={level}
                                            style={[
                                                {
                                                    flex: 1,
                                                    padding: 10,
                                                    margin: 2,
                                                    borderRadius: 6,
                                                    backgroundColor: formData.obligationLevel === level ? "#2196F3" : "#f0f0f0",
                                                    alignItems: "center",
                                                },
                                            ]}
                                            onPress={() => setFormData({ ...formData, obligationLevel: level })}
                                        >
                                            <ThemedText
                                                style={{
                                                    color: formData.obligationLevel === level ? "white" : "#333",
                                                    fontWeight: "bold",
                                                    fontSize: 14,
                                                }}
                                            >
                                                {level}
                                            </ThemedText>
                                        </Pressable>
                                    ))}
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center", fontSize: 10 }]}>Minor</ThemedText>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center", fontSize: 10 }]}>Moderate</ThemedText>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center", fontSize: 10 }]}>Major</ThemedText>
                                </View>
                            </View>

                            <View style={[cssStyle.formGroup, { marginBottom: 16 }]}>
                                <ThemedText style={[cssStyle.inputLabel, { fontSize: 14 }]}>Description</ThemedText>
                                <TextInput
                                    style={[cssStyle.textArea, { height: 80, fontSize: 14, padding: 12 }]}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    placeholder="Describe this connection..."
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>
                        </ScrollView>

                        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                            <Pressable
                                style={[cssStyle.secondaryButton, { flex: 1, paddingVertical: 10 }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditingTether(null);
                                }}
                            >
                                <ThemedText style={[cssStyle.buttonText, { fontSize: 14 }]}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable style={[cssStyle.primaryButton, { flex: 1, paddingVertical: 10 }]} onPress={handleSave}>
                                <ThemedText style={[cssStyle.buttonText, { color: "white", fontSize: 14 }]}>{editingTether ? "Update" : "Add"}</ThemedText>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Edit Minimum Modal */}
            <Modal animationType="slide" transparent={true} visible={editingMinimum} onRequestClose={() => setEditingMinimum(false)}>
                <Pressable style={cssStyle.modalOverlay} onPress={() => setEditingMinimum(false)}>
                    <Pressable style={[cssStyle.modalView, { width: "90%", padding: 20 }]} onPress={(e) => e.stopPropagation()}>
                        <ThemedText style={[cssStyle.modalTitle, { fontSize: 18, marginBottom: 12 }]}>Set Minimum Obligation</ThemedText>

                        <ThemedText style={[cssStyle.bodyText, { marginBottom: 16, fontSize: 14 }]}>
                            Set the minimum total obligation level that characters must maintain.
                        </ThemedText>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={[cssStyle.inputLabel, { fontSize: 14 }]}>Minimum Total</ThemedText>
                            <TextInput
                                style={[cssStyle.input, { fontSize: 16, padding: 12 }]}
                                value={tempMinimum}
                                onChangeText={setTempMinimum}
                                keyboardType="numeric"
                                placeholder="10"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                            <Pressable style={[cssStyle.secondaryButton, { flex: 1, paddingVertical: 10 }]} onPress={() => setEditingMinimum(false)}>
                                <ThemedText style={[cssStyle.buttonText, { fontSize: 14 }]}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable
                                style={[cssStyle.primaryButton, { flex: 1, paddingVertical: 10 }]}
                                onPress={() => {
                                    const value = parseInt(tempMinimum) || 10;
                                    dispatch(setMinimumTotalObligation(Math.max(0, value)));
                                    setEditingMinimum(false);
                                }}
                            >
                                <ThemedText style={[cssStyle.buttonText, { color: "white", fontSize: 14 }]}>Set</ThemedText>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </ThemedView>
    );
}
