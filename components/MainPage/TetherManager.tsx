import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { Tether, addTether, removeTether, updateTether, setMinimumTotalObligation } from "@/store/slices/tethersSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, ScrollView, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function TetherManager() {
    const cssStyle = useResponsiveStyles();
    const { isPhone } = useResponsive();
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
            dispatch(updateTether({
                ...editingTether,
                ...formData,
            }));
        } else {
            dispatch(addTether(formData));
        }

        setModalVisible(false);
        setEditingTether(null);
    };

    const handleDelete = (tetherId: string) => {
        Alert.alert(
            "Remove Tether",
            "Are you sure you want to remove this tether?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => dispatch(removeTether(tetherId)),
                },
            ]
        );
    };

    const renderTetherItem = ({ item }: { item: Tether }) => {
        return (
            <View style={[cssStyle.card, { marginBottom: 12 }]}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <ThemedText style={[cssStyle.subtitle, { flex: 1 }]}>{item.name}</ThemedText>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={[cssStyle.badge, { backgroundColor: "#2196F3", marginRight: 8 }]}>
                            <ThemedText style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
                                {item.obligationLevel}
                            </ThemedText>
                        </View>
                        <Pressable
                            onPress={() => {
                                setEditingTether(item);
                                handleAddEdit();
                            }}
                            style={{ padding: 8 }}
                        >
                            <FontAwesome name="edit" size={16} color="#666" />
                        </Pressable>
                        <Pressable
                            onPress={() => handleDelete(item.id)}
                            style={{ padding: 8 }}
                        >
                            <FontAwesome name="trash" size={16} color="#e74c3c" />
                        </Pressable>
                    </View>
                </View>
                <ThemedText style={cssStyle.bodyText}>{item.description}</ThemedText>
            </View>
        );
    };

    return (
        <ThemedView style={cssStyle.container}>
            {/* Header with obligation tracking */}
            <View style={[cssStyle.card, { marginBottom: 16, backgroundColor: isMinimumMet ? "#27ae6020" : "#e74c3c20" }]}>
                <View style={cssStyle.headerRow}>
                    <View>
                        <ThemedText style={cssStyle.title}>Tethers</ThemedText>
                        <ThemedText style={cssStyle.label}>
                            Connections that bind you to the world
                        </ThemedText>
                    </View>
                    <Pressable
                        style={[cssStyle.primaryButton, { paddingHorizontal: 16, paddingVertical: 8 }]}
                        onPress={() => {
                            setEditingTether(null);
                            handleAddEdit();
                        }}
                    >
                        <ThemedText style={cssStyle.buttonText}>Add</ThemedText>
                    </Pressable>
                </View>

                <View style={[cssStyle.divider, { marginVertical: 12 }]} />

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <ThemedText style={cssStyle.label}>Total Obligation</ThemedText>
                        <ThemedText style={[cssStyle.largeValue, { color: isMinimumMet ? "#27ae60" : "#e74c3c" }]}>
                            {totalObligation} / {minimumTotal}
                        </ThemedText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        {!isMinimumMet && (
                            <View style={[cssStyle.badge, { backgroundColor: "#e74c3c", marginBottom: 4 }]}>
                                <ThemedText style={{ color: "white", fontSize: 12 }}>
                                    Need {minimumTotal - totalObligation} more
                                </ThemedText>
                            </View>
                        )}
                        <Pressable
                            onPress={() => {
                                setTempMinimum(minimumTotal.toString());
                                setEditingMinimum(true);
                            }}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}
                        >
                            <ThemedText style={[cssStyle.smallText, { marginRight: 4 }]}>
                                Edit Minimum
                            </ThemedText>
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
                ListEmptyComponent={
                    <View style={cssStyle.emptyState}>
                        <FontAwesome name="chain-broken" size={48} color="#ccc" style={{ marginBottom: 16 }} />
                        <ThemedText style={cssStyle.emptyStateText}>
                            No tethers yet. Add connections to people, places, ideals, or organizations that motivate your character.
                        </ThemedText>
                    </View>
                }
            />

            {/* Add/Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable 
                    style={cssStyle.modalOverlay} 
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable 
                        style={cssStyle.modalView}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <ThemedText style={cssStyle.modalTitle}>
                            {editingTether ? "Edit Tether" : "Add New Tether"}
                        </ThemedText>

                        <ScrollView>
                            <View style={cssStyle.formGroup}>
                                <ThemedText style={cssStyle.inputLabel}>Name</ThemedText>
                                <TextInput
                                    style={cssStyle.input}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder="e.g., My Sister Sarah, The Thieves Guild"
                                    placeholderTextColor="#999"
                                />
                            </View>


                            <View style={cssStyle.formGroup}>
                                <ThemedText style={cssStyle.inputLabel}>
                                    Obligation Level ({formData.obligationLevel})
                                </ThemedText>
                                <ThemedText style={[cssStyle.label, { marginBottom: 8 }]}>
                                    How strongly does this tether motivate your actions?
                                </ThemedText>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <Pressable
                                            key={level}
                                            style={[
                                                {
                                                    flex: 1,
                                                    padding: 12,
                                                    margin: 2,
                                                    borderRadius: 8,
                                                    backgroundColor: formData.obligationLevel === level ? "#2196F3" : "#f0f0f0",
                                                    alignItems: "center",
                                                }
                                            ]}
                                            onPress={() => setFormData({ ...formData, obligationLevel: level })}
                                        >
                                            <ThemedText style={{ 
                                                color: formData.obligationLevel === level ? "white" : "#333",
                                                fontWeight: "bold"
                                            }}>
                                                {level}
                                            </ThemedText>
                                        </Pressable>
                                    ))}
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center" }]}>Minor</ThemedText>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center" }]}>Moderate</ThemedText>
                                    <ThemedText style={[cssStyle.smallText, { flex: 1, textAlign: "center" }]}>Major</ThemedText>
                                </View>
                            </View>

                            <View style={cssStyle.formGroup}>
                                <ThemedText style={cssStyle.inputLabel}>Description</ThemedText>
                                <TextInput
                                    style={[cssStyle.textArea, { height: 100 }]}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    placeholder="Describe this connection and why it matters to your character..."
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                        </ScrollView>

                        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                            <Pressable
                                style={[cssStyle.secondaryButton, { flex: 1 }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditingTether(null);
                                }}
                            >
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable
                                style={[cssStyle.primaryButton, { flex: 1 }]}
                                onPress={handleSave}
                            >
                                <ThemedText style={[cssStyle.buttonText, { color: "white" }]}>
                                    {editingTether ? "Update" : "Add"}
                                </ThemedText>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Edit Minimum Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editingMinimum}
                onRequestClose={() => setEditingMinimum(false)}
            >
                <Pressable 
                    style={cssStyle.modalOverlay} 
                    onPress={() => setEditingMinimum(false)}
                >
                    <Pressable 
                        style={[cssStyle.modalView, { maxWidth: 400 }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <ThemedText style={cssStyle.modalTitle}>
                            Set Minimum Obligation
                        </ThemedText>

                        <ThemedText style={[cssStyle.bodyText, { marginBottom: 16 }]}>
                            Set the minimum total obligation level that characters must maintain across all their tethers.
                        </ThemedText>

                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.inputLabel}>Minimum Total Obligation</ThemedText>
                            <TextInput
                                style={cssStyle.input}
                                value={tempMinimum}
                                onChangeText={setTempMinimum}
                                keyboardType="numeric"
                                placeholder="10"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                            <Pressable
                                style={[cssStyle.secondaryButton, { flex: 1 }]}
                                onPress={() => setEditingMinimum(false)}
                            >
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </Pressable>
                            <Pressable
                                style={[cssStyle.primaryButton, { flex: 1 }]}
                                onPress={() => {
                                    const value = parseInt(tempMinimum) || 10;
                                    dispatch(setMinimumTotalObligation(Math.max(0, value)));
                                    setEditingMinimum(false);
                                }}
                            >
                                <ThemedText style={[cssStyle.buttonText, { color: "white" }]}>
                                    Set
                                </ThemedText>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </ThemedView>
    );
}