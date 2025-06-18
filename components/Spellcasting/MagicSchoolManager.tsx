import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ListManager } from "@/components/Common/ListManager";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { MagicSchool, addMagicSchool, removeMagicSchool, setMagicSchoolCredit } from "@/store/slices/magicSlice";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";

// List of available magic schools that can be purchased
const AVAILABLE_SCHOOLS: Omit<MagicSchool, "id">[] = [
    {
        name: "Evocation",
        description: "Magic focused on elemental damage and energy manipulation.",
    },
    {
        name: "Abjuration",
        description: "Protective magic that creates barriers and wards.",
    },
    {
        name: "Conjuration",
        description: "Magic that summons creatures and objects from elsewhere.",
    },
    {
        name: "Divination",
        description: "Magic that reveals hidden information and glimpses the future.",
    },
    {
        name: "Enchantment",
        description: "Magic that affects the minds of others.",
    },
    {
        name: "Illusion",
        description: "Magic that deceives the senses and creates false impressions.",
    },
    {
        name: "Necromancy",
        description: "Magic that manipulates life force and communicates with the dead.",
    },
    {
        name: "Transmutation",
        description: "Magic that transforms the physical properties of creatures and objects.",
    },
    {
        name: "Chronomancy",
        description: "Magic that manipulates the flow of time and allows limited temporal manipulation.",
    },
];

// Cost in build points to learn a new magic school
const MAGIC_SCHOOL_COST = 25;

export function MagicSchoolManager() {
    const cssStyle = useResponsiveStyles();
    const magic = useSelector((state: RootState) => state.character?.magic || { magicSchools: [], spells: [], magicSchoolCredit: false });
    const base = useSelector((state: RootState) => state.character?.base || { buildPointsRemaining: 0, buildPointsSpent: 0, energy: 0 });
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);

    // Filter out schools the character already knows
    const availableSchools = AVAILABLE_SCHOOLS.filter((school) => !magic.magicSchools?.some((knownSchool) => knownSchool.name === school.name));

    const handleLearnSchool = (school: Omit<MagicSchool, "id">) => {
        // Check if character has a magic school credit or enough build points
        if (magic.magicSchoolCredit) {
            // Use the free credit
            dispatch(addMagicSchool(school));
            dispatch(setMagicSchoolCredit(false));
            setModalVisible(false);
        } else if (base.buildPointsRemaining >= MAGIC_SCHOOL_COST) {
            // Deduct build points and add the school
            const newBuildPoints = base.buildPointsRemaining - MAGIC_SCHOOL_COST;
            dispatch(addMagicSchool(school));
            // Update both buildPointsRemaining and buildPointsSpent
            dispatch(
                updateMultipleFields([
                    { field: "buildPointsRemaining", value: newBuildPoints },
                    { field: "buildPointsSpent", value: base.buildPointsSpent + MAGIC_SCHOOL_COST },
                ])
            );
            setModalVisible(false);
        } else {
            Alert.alert(
                "Not Enough Build Points",
                `You need ${MAGIC_SCHOOL_COST} build points to learn a new magic school. You currently have ${base.buildPointsRemaining}.`
            );
        }
    };

    const handleRemoveSchool = (schoolId: string) => {
        // Prevent removing the last/only school
        if (!magic.magicSchools || magic.magicSchools.length <= 1) {
            Alert.alert("Cannot Remove School", "You must have at least one magic school.");
            return;
        }

        // Confirm before removing
        Alert.alert("Remove Magic School", "Are you sure you want to remove this magic school? You will receive 25 build points back.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => {
                    // Refund build points and remove the school
                    const newBuildPoints = base.buildPointsRemaining + MAGIC_SCHOOL_COST;
                    dispatch(removeMagicSchool(schoolId));
                    // Update both buildPointsRemaining and buildPointsSpent
                    dispatch(
                        updateMultipleFields([
                            { field: "buildPointsRemaining", value: newBuildPoints },
                            { field: "buildPointsSpent", value: base.buildPointsSpent - MAGIC_SCHOOL_COST },
                        ])
                    );
                },
            },
        ]);
    };

    const renderMagicSchoolItem = ({ item }: { item: MagicSchool }) => (
        <View style={cssStyle.card}>
            <View style={{ flex: 1 }}>
                <ThemedText style={cssStyle.title}>{item.name}</ThemedText>
                <ThemedText style={cssStyle.subtitle}>{item.description}</ThemedText>
            </View>
            <Pressable style={[cssStyle.centered, cssStyle.secondaryButton]} onPress={() => handleRemoveSchool(item.id)}>
                <ThemedText style={cssStyle.smallButtonText}>×</ThemedText>
            </Pressable>
        </View>
    );

    return (
        <>
            <ListManager<MagicSchool>
                title="Magic Schools"
                description={`${magic.magicSchools?.length || 0} school${
                    (magic.magicSchools?.length || 0) !== 1 ? "s" : ""
                } learned • ${MAGIC_SCHOOL_COST} BP each`}
                data={magic.magicSchools || []}
                renderItem={renderMagicSchoolItem}
                keyExtractor={(item) => item.id}
                onAddPress={() => setModalVisible(true)}
                addButtonText="Learn School"
                emptyStateText="No magic schools learned yet."
            />

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={cssStyle.modalOverlay}>
                    <View style={cssStyle.modalView}>
                        <ThemedText style={cssStyle.modalTitle}>Learn Magic School (25 BP)</ThemedText>
                        <FlatList
                            data={availableSchools}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }: { item: Omit<MagicSchool, "id"> }) => (
                                <Pressable style={cssStyle.card} onPress={() => handleLearnSchool(item)}>
                                    <ThemedText style={cssStyle.title}>{item.name}</ThemedText>
                                    <ThemedText style={cssStyle.subtitle}>{item.description}</ThemedText>
                                </Pressable>
                            )}
                            ListEmptyComponent={<ThemedText style={cssStyle.hint}>You've learned all available magic schools!</ThemedText>}
                        />

                        <Pressable style={cssStyle.secondaryButton} onPress={() => setModalVisible(false)}>
                            <ThemedText style={cssStyle.buttonText}>Close</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
}
