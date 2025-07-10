import { cssStyle } from "@/app/styles/responsive";
import { ThemedText } from "@/components/ThemedText";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { faBoltLightning, faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Modal, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
const EnergyColor = "#CC7700";
export const EnergyAdjuster = ({ setMax, open, onClose }: { setMax: () => void; open: boolean; onClose: () => void }) => {
    const character = useSelector((state: RootState) => state.character);
    const dispatch = useDispatch();
    return (
        <Modal animationType="slide" transparent={true} visible={open} onRequestClose={onClose}>
            <View style={[cssStyle.modalOverlay]}>
                <View style={cssStyle.modalView} onStartShouldSetResponder={() => true}>
                    {/* Header */}
                    <View style={[cssStyle.modalHeader, { width: "100%" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <FontAwesomeIcon icon={faBoltLightning} size={24} color={EnergyColor} style={{ marginRight: 8 }} />
                            <ThemedText style={cssStyle.modalTitle}>Set Current Energy</ThemedText>

                            <Pressable onPress={setMax} style={{ padding: 8 }}>
                                <FontAwesomeIcon icon={faCogs} size={20} color="#FF0000" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Current Stats Display */}
                    <View style={[cssStyle.card, { backgroundColor: "#60015", borderColor: EnergyColor, borderWidth: 1, marginBottom: 16 }]}>
                        <View style={{ alignItems: "center" }}>
                            <ThemedText style={[cssStyle.label, { marginBottom: 4 }]}>Current</ThemedText>
                            <ThemedText style={[cssStyle.largeValue, { color: EnergyColor, fontSize: 48 }]}>
                                {character.base.energy}/{character.base.maxEnergy}
                            </ThemedText>
                            <ThemedText style={[cssStyle.label, { marginTop: 4 }]}>Energy Points</ThemedText>
                        </View>
                    </View>

                    {/* Adjustment Buttons */}
                    <Pressable
                        style={[cssStyle.primaryButton, { backgroundColor: EnergyColor }]}
                        onPress={() => {
                            dispatch(updateMultipleFields([{ field: "energy", value: character.base.maxEnergy }]));
                            onClose();
                        }}
                    >
                        <ThemedText style={cssStyle.buttonText}>Full Restore</ThemedText>
                    </Pressable>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.secondaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "energy", value: character.base.energy - 25 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>-25</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.secondaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "energy", value: character.base.energy - 5 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>-5</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.secondaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "energy", value: character.base.energy - 1 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>-1</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, { backgroundColor: EnergyColor }]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "energy", value: character.base.energy + 1 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>+1</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, { backgroundColor: EnergyColor }]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "energy", value: character.base.energy + 5 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>+5</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, { backgroundColor: EnergyColor }]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "energy", value: character.base.energy + 25 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>+25</ThemedText>
                        </Pressable>
                    </View>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
                        <Pressable style={[cssStyle.secondaryButton, {}]} onPress={onClose}>
                            <ThemedText style={cssStyle.buttonText}>Done</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
