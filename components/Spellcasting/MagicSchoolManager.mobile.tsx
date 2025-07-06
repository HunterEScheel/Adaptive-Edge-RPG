import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { MagicSchool, addMagicSchool, removeMagicSchool, setMagicSchoolCredit, updateMagicSchool } from "@/store/slices/magicSlice";
import { faBolt, faCloud, faEye, faFlaskVial, faHeart, faMagic, faShield, faSkull, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// Magic school data with icons and colors
const MAGIC_SCHOOLS = [
    {
        id: "",
        name: "Abjuration",
        description: "Protective barriers",
        icon: faShield,
        color: "#3498db",
    },
    {
        name: "Conjuration",
        description: "Summons creatures",
        icon: faMagic,
        color: "#9b59b6",
    },
    {
        name: "Divination",
        description: "Reveals information",
        icon: faEye,
        color: "#f39c12",
    },
    {
        name: "Enchantment",
        description: "Affects minds",
        icon: faHeart,
        color: "#e91e63",
    },
    {
        name: "Evocation",
        description: "Elemental damage",
        icon: faBolt,
        color: "#e74c3c",
    },
    {
        name: "Illusion",
        description: "Deceives senses",
        icon: faCloud,
        color: "#95a5a6",
    },
    {
        name: "Necromancy",
        description: "Life and death",
        icon: faSkull,
        color: "#34495e",
    },
    {
        name: "Transmutation",
        description: "Transforms matter",
        icon: faFlaskVial,
        color: "#27ae60",
    },
];

const MAGIC_SCHOOL_COST = 25;

export function MagicSchoolManagerMobile() {
    const cssStyle = useResponsiveStyles();
    const magic = useSelector((state: RootState) => state.character?.magic || { magicSchools: [], spells: [], magicSchoolCredit: false });
    const base = useSelector((state: RootState) => state.character?.base || { buildPointsRemaining: 0, buildPointsSpent: 0, energy: 0 });
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<MagicSchool | null>(null);

    const isSchoolKnown = (schoolName: string) => {
        return magic.magicSchools?.some((school) => school.name === schoolName);
    };

    const handleSchoolSelect = (school: (typeof MAGIC_SCHOOLS)[0]) => {
        const CharacterSchool: MagicSchool | undefined = magic.magicSchools.find((x) => x.name === school.name);
        setSelectedSchool({ ...school, levels: CharacterSchool?.levels ?? 0, id: CharacterSchool?.id ?? "" });
        setModalVisible(true);
    };
    const handleSchoolLevelChange = (schoolName: string, addLevels: 1 | -1) => {
        const school = magic.magicSchools?.find((s) => s.name === schoolName);
        if (!school) return;
        const newCost = addLevels === 1 ? (school.levels + 1) * MAGIC_SCHOOL_COST : -school.levels * MAGIC_SCHOOL_COST;
        const newBuildPoints = base.buildPointsRemaining - newCost;
        if (newBuildPoints < 0) {
            Alert.alert(
                "Not Enough Build Points",
                `You need ${newCost - base.buildPointsRemaining} more build points to increase ${schoolName} to level ${school.levels + 1}.`
            );
            return;
        }
        dispatch(
            updateMultipleFields([
                { field: "buildPointsRemaining", value: newBuildPoints },
                { field: "buildPointsSpent", value: base.buildPointsSpent + newCost },
            ])
        );
        dispatch(updateMagicSchool({ name: schoolName, levels: school.levels + addLevels }));
    };

    const handleLearnSchool = () => {
        if (!selectedSchool) return;

        const school: Omit<MagicSchool, "id"> = {
            name: selectedSchool.name,
            description: selectedSchool.description,
            levels: 1,
            color: selectedSchool.color,
            icon: selectedSchool.icon,
        };

        if (magic.magicSchoolCredit) {
            dispatch(addMagicSchool(school));
            dispatch(setMagicSchoolCredit(false));
            setModalVisible(false);
        } else if (base.buildPointsRemaining >= MAGIC_SCHOOL_COST) {
            const newBuildPoints = base.buildPointsRemaining - MAGIC_SCHOOL_COST;
            dispatch(addMagicSchool(school));
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
                `You need ${MAGIC_SCHOOL_COST} build points to learn ${selectedSchool.name}. You currently have ${base.buildPointsRemaining}.`
            );
        }
    };

    const handleRemoveSchool = (schoolName: string) => {
        const school = magic.magicSchools?.find((s) => s.name === schoolName);
        if (!school) return;

        const spellsFromSchool = magic.spells?.filter((spell) => spell.school === schoolName).length || 0;

        if (spellsFromSchool > 0) {
            Alert.alert(
                "Cannot Remove School",
                `You have ${spellsFromSchool} spell${spellsFromSchool !== 1 ? "s" : ""} from ${schoolName}. Remove all spells from this school first.`
            );
            return;
        }

        const newBuildPoints = base.buildPointsRemaining + MAGIC_SCHOOL_COST;
        dispatch(removeMagicSchool(school.id));
        dispatch(
            updateMultipleFields([
                { field: "buildPointsRemaining", value: newBuildPoints },
                { field: "buildPointsSpent", value: base.buildPointsSpent - MAGIC_SCHOOL_COST },
            ])
        );
    };

    const renderSchoolCard = (school: (typeof MAGIC_SCHOOLS)[0]) => {
        const known = isSchoolKnown(school.name);
        const knownSchool = magic.magicSchools?.find((s) => s.name === school.name) ?? null;
        const spellCount = magic.spells?.filter((spell) => spell.school === school.name).length || 0;
        const nextLevelCost = knownSchool ? (knownSchool.levels + 1) * MAGIC_SCHOOL_COST : MAGIC_SCHOOL_COST;

        if (known) {
            return (
                <View
                    key={school.name}
                    style={[
                        cssStyle.compactCard,
                        {
                            marginBottom: 6,
                            borderWidth: 1,
                            borderColor: school.color,
                            backgroundColor: school.color + "15",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 8,
                        },
                    ]}
                >
                    <View
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: school.color,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 8,
                        }}
                    >
                        <FontAwesomeIcon icon={school.icon} size={16} color="white" />
                    </View>
                    <View style={{}}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <ThemedText style={{ fontSize: 13, fontWeight: "600", color: school.color }}>
                                {school.name} {knownSchool?.levels ?? null}
                            </ThemedText>
                            <ThemedText style={{ fontSize: 10, color: "#666", marginLeft: 6 }}>
                                {spellCount} spell{spellCount !== 1 ? "s" : ""}
                            </ThemedText>

                            <ThemedText style={{ fontSize: 10, color: "#A00", marginLeft: 6 }}>
                                {base.buildPointsRemaining < nextLevelCost && "Next Level: " + nextLevelCost + " BP"}
                            </ThemedText>
                        </View>
                        <ThemedText style={{ fontSize: 11, color: "#666", marginTop: 2 }} numberOfLines={1}>
                            {school.description}
                        </ThemedText>
                    </View>
                    {knownSchool && knownSchool.levels > 1 && (
                        <Pressable
                            style={[cssStyle.secondaryColors, { width: 40, height: 40, borderRadius: 8, justifyContent: "center", alignItems: "center" }]}
                            onPress={() => handleSchoolLevelChange(school.name, -1)}
                        >
                            <ThemedText style={cssStyle.bodyText}>-1</ThemedText>
                        </Pressable>
                    )}
                    {base.buildPointsRemaining >= nextLevelCost && (
                        <Pressable
                            style={[cssStyle.primaryColors, { width: 40, height: 40, borderRadius: 8, justifyContent: "center", alignItems: "center" }]}
                            onPress={() => handleSchoolLevelChange(school.name, 1)}
                        >
                            <ThemedText style={cssStyle.bodyText}>+1</ThemedText>
                        </Pressable>
                    )}
                    <Pressable
                        onPress={() => handleRemoveSchool(school.name)}
                        style={{
                            marginLeft: 5,
                            width: 30,
                            height: 40,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 8,
                            backgroundColor: "#555",
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} size={14} color="#e74c3c" />
                    </Pressable>
                </View>
            );
        } else {
            return (
                <Pressable
                    key={school.name}
                    style={[
                        cssStyle.compactCard,
                        {
                            marginBottom: 6,
                            borderWidth: 1,
                            borderColor: "#e0e0e0",
                            backgroundColor: "#f8f8f8",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 8,
                            position: "relative",
                        },
                    ]}
                    onPress={() => handleSchoolSelect(school)}
                >
                    <View
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: "#e0e0e0",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 8,
                        }}
                    >
                        <FontAwesomeIcon icon={school.icon} size={16} color="white" />
                    </View>

                    <View style={{ paddingRight: 50 }}>
                        <ThemedText style={{ fontSize: 13, fontWeight: "600", color: "#333" }}>{school.name}</ThemedText>
                        <ThemedText style={{ fontSize: 11, color: "#666", marginTop: 2 }} numberOfLines={1}>
                            {school.description}
                        </ThemedText>
                    </View>

                    <View
                        style={{
                            position: "absolute",
                            bottom: 6,
                            right: 6,
                            backgroundColor: magic.magicSchoolCredit ? "#27ae60" : "#2196F3",
                            paddingHorizontal: 6,
                            paddingVertical: 3,
                            borderRadius: 3,
                        }}
                    >
                        <ThemedText style={{ fontSize: 10, color: "white", fontWeight: "600" }}>
                            {magic.magicSchoolCredit ? "FREE" : `${MAGIC_SCHOOL_COST} BP`}
                        </ThemedText>
                    </View>
                </Pressable>
            );
        }
    };

    return (
        <ThemedView style={[cssStyle.container, { padding: 12 }]}>
            <View style={[cssStyle.headerRow, { marginBottom: 12 }]}>
                <View>
                    <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>Magic Schools</ThemedText>
                    <ThemedText style={{ fontSize: 11, color: "#666" }}>
                        {magic.magicSchools?.length || 0} of {MAGIC_SCHOOLS.length} learned
                    </ThemedText>
                </View>
                {magic.magicSchoolCredit && (
                    <View style={[cssStyle.badge, { backgroundColor: "#27ae60", paddingHorizontal: 8, paddingVertical: 4 }]}>
                        <ThemedText style={{ color: "white", fontSize: 10 }}>Free Credit!</ThemedText>
                    </View>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Known Schools */}
                {magic.magicSchools && magic.magicSchools.length > 0 && (
                    <View style={{ marginBottom: 16 }}>
                        <ThemedText style={{ fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Your Schools</ThemedText>
                        {MAGIC_SCHOOLS.filter((school) => isSchoolKnown(school.name)).map(renderSchoolCard)}
                    </View>
                )}

                {/* Available Schools */}
                <View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                        <ThemedText style={{ fontSize: 14, fontWeight: "600" }}>Available Schools</ThemedText>
                        {base.buildPointsRemaining < MAGIC_SCHOOL_COST && !magic.magicSchoolCredit && (
                            <ThemedText style={{ fontSize: 10, color: "#e74c3c", marginLeft: 6 }}>
                                (Need {MAGIC_SCHOOL_COST - base.buildPointsRemaining} BP)
                            </ThemedText>
                        )}
                    </View>
                    {MAGIC_SCHOOLS.filter((school) => !isSchoolKnown(school.name)).map(renderSchoolCard)}
                </View>
            </ScrollView>

            {/* Learn School Confirmation Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <Pressable style={cssStyle.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={[cssStyle.modalView, { padding: 16 }]} onPress={(e) => e.stopPropagation()}>
                        {selectedSchool && (
                            <>
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        backgroundColor: selectedSchool.color,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 12,
                                        alignSelf: "center",
                                    }}
                                >
                                    <FontAwesomeIcon icon={selectedSchool.icon} size={24} color="white" />
                                </View>

                                <ThemedText style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>Learn {selectedSchool.name}?</ThemedText>
                                <ThemedText style={{ fontSize: 12, color: "#666", textAlign: "center", marginVertical: 8 }}>
                                    {selectedSchool.description}
                                </ThemedText>

                                <ThemedText style={{ fontSize: 14, textAlign: "center", marginBottom: 16 }}>
                                    Cost:
                                    {magic.magicSchoolCredit ? (
                                        <ThemedText style={{ color: "#27ae60", fontWeight: "600" }}>FREE (using credit)</ThemedText>
                                    ) : (
                                        <ThemedText style={{ fontWeight: "600" }}>{MAGIC_SCHOOL_COST} Build Points</ThemedText>
                                    )}
                                </ThemedText>

                                <View style={{ flexDirection: "row", gap: 8 }}>
                                    <Pressable
                                        style={[cssStyle.condensedButton, cssStyle.secondaryColors, { paddingVertical: 8 }]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <ThemedText style={{ fontSize: 12, color: "#666" }}>Cancel</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[cssStyle.condensedButton, { backgroundColor: selectedSchool.color, paddingVertical: 8 }]}
                                        onPress={handleLearnSchool}
                                    >
                                        <ThemedText style={{ fontSize: 12, color: "white" }}>Learn</ThemedText>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </ThemedView>
    );
}
