import { cssStyle } from "@/app/styles/responsive";
import { ThemedText } from "@/components/ThemedText";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { faCogs, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Modal, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const HitpointAdjuster = ({ setMax, open, onClose }: { setMax: () => void; open: boolean; onClose: () => void }) => {
    const character = useSelector((state: RootState) => state.character);
    const dispatch = useDispatch();
    return (
        <Modal animationType="slide" transparent={true} visible={open} onRequestClose={onClose}>
            <View style={[cssStyle.modalOverlay]}>
                <View style={cssStyle.modalView} onStartShouldSetResponder={() => true}>
                    {/* Header */}
                    <View style={[cssStyle.modalHeader, { width: "100%" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <FontAwesomeIcon icon={faHeart} size={24} color={"#600"} style={{ marginRight: 8 }} />
                            <ThemedText style={cssStyle.modalTitle}>Set Current Hitpoints</ThemedText>

                            <Pressable onPress={setMax} style={{ padding: 8 }}>
                                <FontAwesomeIcon icon={faCogs} size={20} color="#FF0000" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Current Stats Display */}
                    <View style={[cssStyle.card, { backgroundColor: "#60015", borderColor: "#600", borderWidth: 1, marginBottom: 16 }]}>
                        <View style={{ alignItems: "center" }}>
                            <ThemedText style={[cssStyle.label, { marginBottom: 4 }]}>Current</ThemedText>
                            <ThemedText style={[cssStyle.largeValue, { color: "#600", fontSize: 48 }]}>
                                {character.base.hitPoints}/{character.base.maxHitPoints + character.base.con * 5}
                            </ThemedText>
                            <ThemedText style={[cssStyle.label, { marginTop: 4 }]}>Hit Points</ThemedText>
                        </View>
                    </View>

                    {/* Adjustment Buttons */}
                    <Pressable
                        style={[cssStyle.primaryButton]}
                        onPress={() => {
                            dispatch(updateMultipleFields([{ field: "hitPoints", value: character.base.maxHitPoints + character.base.con * 5 }]));
                            onClose();
                        }}
                    >
                        <ThemedText style={cssStyle.buttonText}>Full Heal</ThemedText>
                    </Pressable>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.secondaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "hitPoints", value: character.base.hitPoints - 10 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>-10</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.secondaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "hitPoints", value: character.base.hitPoints - 5 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>-5</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.secondaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "hitPoints", value: character.base.hitPoints - 1 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>-1</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.primaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "hitPoints", value: character.base.hitPoints + 1 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>+1</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.primaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "hitPoints", value: character.base.hitPoints + 5 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>+5</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[cssStyle.defaultButton, cssStyle.primaryColors]}
                            onPress={() => dispatch(updateMultipleFields([{ field: "hitPoints", value: character.base.hitPoints + 10 }]))}
                        >
                            <ThemedText style={cssStyle.buttonText}>+10</ThemedText>
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
