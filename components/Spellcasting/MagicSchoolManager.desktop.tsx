import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { MagicSchool, addMagicSchool, removeMagicSchool, setMagicSchoolCredit } from "@/store/slices/magicSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// Magic school data with icons and colors
const MAGIC_SCHOOLS = [
    {
        name: "Abjuration",
        description: "Protective magic that creates barriers and wards",
        icon: "shield",
        color: "#3498db",
        spellExamples: ["Shield", "Counterspell", "Dispel Magic"],
    },
    {
        name: "Conjuration",
        description: "Summons creatures and objects from elsewhere",
        icon: "magic",
        color: "#9b59b6",
        spellExamples: ["Find Familiar", "Misty Step", "Teleport"],
    },
    {
        name: "Divination",
        description: "Reveals information and glimpses the future",
        icon: "eye",
        color: "#f39c12",
        spellExamples: ["Detect Magic", "Identify", "Scrying"],
    },
    {
        name: "Enchantment",
        description: "Affects minds and influences behavior",
        icon: "heart",
        color: "#e91e63",
        spellExamples: ["Charm Person", "Sleep", "Suggestion"],
    },
    {
        name: "Evocation",
        description: "Elemental damage and energy manipulation",
        icon: "bolt",
        color: "#e74c3c",
        spellExamples: ["Fireball", "Lightning Bolt", "Magic Missile"],
    },
    {
        name: "Illusion",
        description: "Deceives senses and creates false impressions",
        icon: "cloud",
        color: "#95a5a6",
        spellExamples: ["Disguise Self", "Invisibility", "Major Image"],
    },
    {
        name: "Necromancy",
        description: "Manipulates life force and death",
        icon: "skull-outline",
        color: "#34495e",
        spellExamples: ["False Life", "Vampiric Touch", "Animate Dead"],
    },
    {
        name: "Transmutation",
        description: "Transforms physical properties",
        icon: "flask",
        color: "#27ae60",
        spellExamples: ["Mage Hand", "Fly", "Polymorph"],
    },
];

const MAGIC_SCHOOL_COST = 25;

export function MagicSchoolManagerDesktop() {
    const cssStyle = useResponsiveStyles();
    const magic = useSelector((state: RootState) => state.character?.magic || { magicSchools: [], spells: [], magicSchoolCredit: false });
    const base = useSelector((state: RootState) => state.character?.base || { buildPointsRemaining: 0, buildPointsSpent: 0, energy: 0 });
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<(typeof MAGIC_SCHOOLS)[0] | null>(null);

    const isSchoolKnown = (schoolName: string) => {
        return magic.magicSchools?.some((school) => school.name === schoolName);
    };

    const handleSchoolSelect = (school: (typeof MAGIC_SCHOOLS)[0]) => {
        if (isSchoolKnown(school.name)) {
            Alert.alert("Already Known", `You already know ${school.name} magic.`);
            return;
        }
        setSelectedSchool(school);
        setModalVisible(true);
    };

    const handleLearnSchool = () => {
        if (!selectedSchool) return;

        const school: Omit<MagicSchool, "id"> = {
            name: selectedSchool.name,
            description: selectedSchool.description,
        };

        // Check if character has a magic school credit or enough build points
        if (magic.magicSchoolCredit) {
            dispatch(addMagicSchool(school));
            dispatch(setMagicSchoolCredit(false));
            setModalVisible(false);
            Alert.alert("School Learned!", `You have learned ${selectedSchool.name} using your free magic school credit.`);
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
            Alert.alert("School Learned!", `You have learned ${selectedSchool.name} for ${MAGIC_SCHOOL_COST} build points.`);
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

        // Count spells from this school
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
        const spellCount = magic.spells?.filter((spell) => spell.school === school.name).length || 0;

        if (known) {
            return (
                <View
                    key={school.name}
                    style={[
                        cssStyle.card,
                        {
                            marginBottom: 12,
                            borderWidth: 2,
                            borderColor: school.color,
                            backgroundColor: school.color + "15",
                            overflow: "visible",
                        },
                    ]}
                >
                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: school.color,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >
                            <FontAwesome name={school.icon as any} size={24} color="white" />
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <ThemedText style={[cssStyle.subtitle, { color: school.color, flex: 1 }]}>{school.name}</ThemedText>
                                <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 0 }}>
                                    <ThemedText style={[cssStyle.label, { marginRight: 8 }]}>
                                        {spellCount} spell{spellCount !== 1 ? "s" : ""}
                                    </ThemedText>
                                    <Pressable
                                        onPress={() => handleRemoveSchool(school.name)}
                                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                        style={({ pressed }) => ({
                                            padding: 8,
                                            backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
                                            borderRadius: 4,
                                            minWidth: 40,
                                            minHeight: 40,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        })}
                                    >
                                        <FontAwesome name="trash" size={16} color="#e74c3c" />
                                    </Pressable>
                                </View>
                            </View>
                            <ThemedText style={[cssStyle.bodyText, { marginTop: 4 }]}>{school.description}</ThemedText>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <Pressable
                    key={school.name}
                    style={[
                        cssStyle.card,
                        {
                            marginBottom: 12,
                            borderWidth: 2,
                            borderColor: "#e0e0e0",
                            backgroundColor: "#f8f8f8",
                        },
                    ]}
                    onPress={() => handleSchoolSelect(school)}
                >
                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: "#e0e0e0",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >
                            <FontAwesome name={school.icon as any} size={24} color="white" />
                        </View>

                        <View style={{ flex: 1 }}>
                            <ThemedText style={[cssStyle.subtitle, { color: "#333" }]}>{school.name}</ThemedText>
                            <ThemedText style={[cssStyle.bodyText, { marginTop: 4 }]}>{school.description}</ThemedText>
                            <View style={{ marginTop: 8 }}>
                                <ThemedText style={[cssStyle.label, { color: "#666" }]}>Example spells: {school.spellExamples.join(", ")}</ThemedText>
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                    <FontAwesome name="graduation-cap" size={14} color="#666" style={{ marginRight: 4 }} />
                                    <ThemedText style={[cssStyle.label, { color: magic.magicSchoolCredit ? "#27ae60" : "#666" }]}>
                                        {magic.magicSchoolCredit ? "Free with credit!" : `${MAGIC_SCHOOL_COST} Build Points`}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                </Pressable>
            );
        }
    };

    return (
        <ThemedView style={cssStyle.container}>
            <View style={[cssStyle.headerRow, { marginBottom: 16 }]}>
                <View>
                    <ThemedText style={cssStyle.title}>Magic Schools</ThemedText>
                    <ThemedText style={cssStyle.label}>
                        {magic.magicSchools?.length || 0} of {MAGIC_SCHOOLS.length} schools learned
                    </ThemedText>
                </View>
                {magic.magicSchoolCredit && (
                    <View style={[cssStyle.badge, { backgroundColor: "#27ae60" }]}>
                        <ThemedText style={{ color: "white", fontSize: 12 }}>Free Credit Available!</ThemedText>
                    </View>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Known Schools */}
                {magic.magicSchools && magic.magicSchools.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <ThemedText style={[cssStyle.subtitle, { marginBottom: 8 }]}>Your Schools</ThemedText>
                        {MAGIC_SCHOOLS.filter((school) => isSchoolKnown(school.name)).map(renderSchoolCard)}
                    </View>
                )}

                {/* Available Schools */}
                <View>
                    <ThemedText style={[cssStyle.subtitle, { marginBottom: 8 }]}>
                        Available Schools
                        {base.buildPointsRemaining < MAGIC_SCHOOL_COST && !magic.magicSchoolCredit && (
                            <ThemedText style={[cssStyle.label, { color: "#e74c3c" }]}>
                                {" "}
                                (Need {MAGIC_SCHOOL_COST - base.buildPointsRemaining} more BP)
                            </ThemedText>
                        )}
                    </ThemedText>
                    {MAGIC_SCHOOLS.filter((school) => !isSchoolKnown(school.name)).map(renderSchoolCard)}
                </View>
            </ScrollView>

            {/* Learn School Confirmation Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <Pressable style={cssStyle.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={cssStyle.modalView} onStartShouldSetResponder={() => true}>
                        {selectedSchool && (
                            <>
                                <View
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        backgroundColor: selectedSchool.color,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 16,
                                        alignSelf: "center",
                                    }}
                                >
                                    <FontAwesome name={selectedSchool.icon as any} size={40} color="white" />
                                </View>

                                <ThemedText style={cssStyle.title}>Learn {selectedSchool.name}?</ThemedText>
                                <ThemedText style={[cssStyle.bodyText, { textAlign: "center", marginVertical: 16 }]}>{selectedSchool.description}</ThemedText>

                                <View style={[cssStyle.card, { backgroundColor: "#f0f0f0", marginBottom: 16 }]}>
                                    <ThemedText style={[cssStyle.label, { marginBottom: 8 }]}>Example Spells:</ThemedText>
                                    {selectedSchool.spellExamples.map((spell, index) => (
                                        <ThemedText key={index} style={cssStyle.bodyText}>
                                            • {spell}
                                        </ThemedText>
                                    ))}
                                </View>

                                <ThemedText style={[cssStyle.subtitle, { textAlign: "center", marginBottom: 20 }]}>
                                    Cost:{" "}
                                    {magic.magicSchoolCredit ? (
                                        <ThemedText style={{ color: "#27ae60" }}>FREE (using credit)</ThemedText>
                                    ) : (
                                        <ThemedText>{MAGIC_SCHOOL_COST} Build Points</ThemedText>
                                    )}
                                </ThemedText>

                                <View style={{ flexDirection: "row", gap: 12 }}>
                                    <Pressable style={[cssStyle.defaultButton, cssStyle.secondaryButton, { flex: 1 }]} onPress={() => setModalVisible(false)}>
                                        <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                                    </Pressable>
                                    <Pressable
                                        style={[cssStyle.defaultButton, cssStyle.primaryButton, { flex: 1, backgroundColor: selectedSchool.color }]}
                                        onPress={handleLearnSchool}
                                    >
                                        <ThemedText style={[cssStyle.buttonText, { color: "white" }]}>Learn</ThemedText>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </Pressable>
            </Modal>
        </ThemedView>
    );
}