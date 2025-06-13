import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { MagicSchool, addMagicSchool, removeMagicSchool, setMagicSchoolCredit } from "@/store/slices/magicSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

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
      Alert.alert("Not Enough Build Points", `You need ${MAGIC_SCHOOL_COST} build points to learn a new magic school. You currently have ${base.buildPointsRemaining}.`);
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Magic Schools</ThemedText>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <FontAwesome name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={magic.magicSchools || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.schoolItem}>
            <View style={styles.schoolInfo}>
              <ThemedText style={styles.schoolName}>{item.name}</ThemedText>
              <ThemedText style={styles.schoolDescription}>{item.description}</ThemedText>
            </View>
            <Pressable style={styles.removeButton} onPress={() => handleRemoveSchool(item.id)}>
              <FontAwesome name="trash" size={18} color="#F44336" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No magic schools learned yet.</ThemedText>}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText style={styles.modalTitle}>Learn Magic School (25 BP)</ThemedText>

            <FlatList
              data={availableSchools}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Pressable style={styles.schoolOption} onPress={() => handleLearnSchool(item)}>
                  <ThemedText style={styles.schoolOptionName}>{item.name}</ThemedText>
                  <ThemedText style={styles.schoolOptionDescription}>{item.description}</ThemedText>
                </Pressable>
              )}
              ListEmptyComponent={<ThemedText style={styles.emptyText}>You've learned all available magic schools!</ThemedText>}
            />

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </Pressable>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  schoolItem: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 6,
    marginBottom: 8,
    alignItems: "center",
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  schoolDescription: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  schoolOption: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 6,
    marginBottom: 8,
  },
  schoolOptionName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  schoolOptionDescription: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
