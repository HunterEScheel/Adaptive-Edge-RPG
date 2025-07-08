import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { calculateTotalDamageReduction } from "@/components/Utility/CalculateTotals";
import { RootState } from "@/store/rootReducer";
import { removeArmor, removeShield, damageShield, repairShield } from "@/store/slices/inventorySlice";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ArmorModal } from "./ArmorModal";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

interface ArmorListProps {
    variant?: "full" | "compact" | "mini";
}

export function ArmorList({ variant = "full" }: ArmorListProps) {
    const cssStyle = useResponsiveStyles();
    const { isMobile } = useResponsive();
    const dispatch = useDispatch();
    const character = useSelector((state: RootState) => state.character);
    const currentArmor = character.inventory?.armor;
    const currentShield = character.inventory?.shield;
    const [armorModalOpen, setArmorModalOpen] = useState(false);

    const totalDR = calculateTotalDamageReduction(character);

    const handleRemoveArmor = () => {
        dispatch(removeArmor());
    };

    const handleRemoveShield = () => {
        dispatch(removeShield());
    };

    const handleDamageShield = () => {
        dispatch(damageShield());
    };

    const handleRepairShield = () => {
        dispatch(repairShield());
    };

    const renderArmorDisplay = () => {
        if (!currentArmor || !currentArmor.name) {
            return (
                <View style={cssStyle.emptyState}>
                    <ThemedText style={cssStyle.emptyStateText}>No armor equipped</ThemedText>
                </View>
            );
        }

        return (
            <View style={cssStyle.itemContainer}>
                <View style={{}}>
                    <ThemedText style={cssStyle.subtitle}>{currentArmor.name}</ThemedText>
                    <ThemedText style={cssStyle.description}>{currentArmor.armorClassification} Armor</ThemedText>
                    <View style={[cssStyle.row, { marginTop: 8 }]}>
                        <ThemedText style={[cssStyle.smallText, cssStyle.defaultBold]}>Damage Reduction: {totalDR}</ThemedText>
                    </View>
                    <ThemedText style={[cssStyle.smallText, cssStyle.defaultBold]}>
                        Evasion Reduction: {currentArmor.statUpdates?.evasionReduction ?? 0}
                    </ThemedText>
                </View>
                <View style={[cssStyle.row, { gap: 8 }]}>
                    <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryButton]} onPress={handleRemoveArmor}>
                        <ThemedText style={cssStyle.secondaryText}>Remove</ThemedText>
                    </Pressable>
                </View>
            </View>
        );
    };

    // Mini variant
    if (variant === "mini") {
        return (
            <View style={[cssStyle.container, { padding: 6, marginVertical: 2 }]}>
                <View style={[cssStyle.row, { justifyContent: "space-between", alignItems: "center", marginBottom: 4 }]}>
                    <ThemedText style={[cssStyle.label, { fontSize: 12, fontWeight: "600" }]}>Armor & Shield</ThemedText>
                    <Pressable
                        style={[cssStyle.condensedButton, cssStyle.primaryColors, { padding: 4, minWidth: 60, height: 24 }]}
                        onPress={() => setArmorModalOpen(true)}
                    >
                        <ThemedText style={[cssStyle.primaryText, { fontSize: 10 }]}>Manage</ThemedText>
                    </Pressable>
                </View>
                {currentArmor?.name ? (
                    <ThemedText style={{ fontSize: 11 }} numberOfLines={1}>
                        • {currentArmor.name} (DR: {totalDR})
                    </ThemedText>
                ) : (
                    <ThemedText style={[cssStyle.hint, { fontSize: 11, fontStyle: "italic" }]}>No armor equipped</ThemedText>
                )}
                {currentShield && (
                    <ThemedText style={{ fontSize: 11 }} numberOfLines={1}>
                        • Shield: {currentShield.name} (Parry +{currentShield.parryBonus})
                    </ThemedText>
                )}
                <ArmorModal visible={armorModalOpen} onClose={() => setArmorModalOpen(false)} />
            </View>
        );
    }

    // Compact variant or phone view
    if (variant === "compact" || isMobile) {
        return (
            <View style={[cssStyle.container, { padding: 8, marginVertical: 4 }]}>
                <View style={[cssStyle.row, { justifyContent: "space-between", alignItems: "center", marginBottom: 8 }]}>
                    <ThemedText style={[cssStyle.sectionHeader, { fontSize: 16, marginBottom: 0 }]}>
                        Armor & Shield {currentArmor?.name && `(DR: ${totalDR})`}
                    </ThemedText>
                    <Pressable
                        style={[cssStyle.primaryButton, cssStyle.primaryColors, { paddingHorizontal: 12, paddingVertical: 6 }]}
                        onPress={() => setArmorModalOpen(true)}
                    >
                        <ThemedText style={[cssStyle.primaryText, { fontSize: 12 }]}>Manage</ThemedText>
                    </Pressable>
                </View>
                {renderArmorDisplay()}
                
                {/* Shield Section for Compact View */}
                {currentShield && (
                    <View style={[cssStyle.itemContainer, { marginTop: 8 }]}>
                        <View style={{ flex: 1 }}>
                            <ThemedText style={[cssStyle.subtitle, { fontSize: 14 }]}>Shield: {currentShield.name}</ThemedText>
                            <ThemedText style={[cssStyle.description, { fontSize: 12 }]}>Parry +{currentShield.parryBonus}</ThemedText>
                            <View style={[cssStyle.row, { marginTop: 4, alignItems: "center" }]}>
                                <ThemedText style={[cssStyle.smallText, { fontSize: 11 }]}>Durability: </ThemedText>
                                <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryColors, { padding: 2 }]} onPress={handleDamageShield}>
                                    <FontAwesomeIcon icon={faMinus} size={10} />
                                </Pressable>
                                <ThemedText style={[cssStyle.description, { marginHorizontal: 6, fontSize: 11 }]}>
                                    {currentShield.durability} / {currentShield.maxDurability}
                                </ThemedText>
                                <Pressable style={[cssStyle.condensedButton, cssStyle.primaryColors, { padding: 2 }]} onPress={handleRepairShield}>
                                    <FontAwesomeIcon icon={faPlus} size={10} />
                                </Pressable>
                            </View>
                        </View>
                        <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryButton, { padding: 4 }]} onPress={handleRemoveShield}>
                            <ThemedText style={[cssStyle.secondaryText, { fontSize: 11 }]}>Remove</ThemedText>
                        </Pressable>
                    </View>
                )}
                
                <ArmorModal visible={armorModalOpen} onClose={() => setArmorModalOpen(false)} />
            </View>
        );
    }

    // Full variant
    return (
        <View style={cssStyle.container}>
            <View style={[cssStyle.sectionContainer, cssStyle.row, { justifyContent: "space-between" }]}>
                <ThemedText style={cssStyle.sectionTitle}>Armor & Shield</ThemedText>
                <Pressable style={[cssStyle.defaultButton, cssStyle.primaryColors]} onPress={() => setArmorModalOpen(true)}>
                    <ThemedText style={cssStyle.primaryText}>Manage</ThemedText>
                </Pressable>
            </View>
            {renderArmorDisplay()}
            
            {/* Shield Section */}
            <View style={[cssStyle.sectionContainer, { marginTop: 16 }]}>
                <ThemedText style={[cssStyle.subtitle, { marginBottom: 8 }]}>Shield</ThemedText>
                {currentShield ? (
                    <View style={cssStyle.itemContainer}>
                        <View style={{ flex: 1 }}>
                            <ThemedText style={cssStyle.subtitle}>{currentShield.name}</ThemedText>
                            <ThemedText style={cssStyle.description}>Parry Bonus: +{currentShield.parryBonus}</ThemedText>
                            <View style={[cssStyle.row, { marginTop: 8, alignItems: "center" }]}>
                                <ThemedText style={[cssStyle.smallText, cssStyle.defaultBold]}>Durability: </ThemedText>
                                <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryColors]} onPress={handleDamageShield}>
                                    <FontAwesomeIcon icon={faMinus} size={12} />
                                </Pressable>
                                <ThemedText style={[cssStyle.description, { marginHorizontal: 8 }]}>
                                    {currentShield.durability} / {currentShield.maxDurability}
                                </ThemedText>
                                <Pressable style={[cssStyle.condensedButton, cssStyle.primaryColors]} onPress={handleRepairShield}>
                                    <FontAwesomeIcon icon={faPlus} size={12} />
                                </Pressable>
                            </View>
                        </View>
                        <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryButton]} onPress={handleRemoveShield}>
                            <ThemedText style={cssStyle.secondaryText}>Remove</ThemedText>
                        </Pressable>
                    </View>
                ) : (
                    <View style={cssStyle.emptyState}>
                        <ThemedText style={cssStyle.emptyStateText}>No shield equipped</ThemedText>
                    </View>
                )}
            </View>
            
            <ArmorModal visible={armorModalOpen} onClose={() => setArmorModalOpen(false)} />
        </View>
    );
}
