import { calculateSkillCost, calculateTotalSkillCost } from "@/constants/Skills";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { updateWeaponSkills } from "@/store/slices/skillsSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
export type WeaponSkill = {
  id: number;
  level: number;
  weaponHeft: "Unarmed" | "2-handed" | "1-handed" | "Versatile";
  weaponType: "Stab" | "Swing" | "Fire" | "Draw";
};
export type DefensiveSkill = {
  skillLevel: number;
  skillName: "Dodge" | "Parry";
};

const weaponOptions: WeaponSkill[] = [
  {
    weaponHeft: "2-handed",
    id: 1,
    level: 1,
    weaponType: "Stab",
  },
  {
    id: 2,
    level: 1,
    weaponHeft: "2-handed",
    weaponType: "Swing",
  },
  {
    id: 3,
    level: 1,
    weaponHeft: "2-handed",
    weaponType: "Draw",
  },
  {
    id: 4,
    level: 1,
    weaponHeft: "2-handed",
    weaponType: "Fire",
  },
  {
    id: 5,
    level: 1,
    weaponHeft: "1-handed",
    weaponType: "Fire",
  },
  {
    id: 6,
    level: 1,
    weaponHeft: "1-handed",
    weaponType: "Swing",
  },
  {
    id: 7,
    level: 1,
    weaponHeft: "1-handed",
    weaponType: "Stab",
  },
  {
    id: 8,
    level: 1,
    weaponHeft: "1-handed",
    weaponType: "Draw",
  },
  {
    id: 9,
    level: 1,
    weaponHeft: "Unarmed",
    weaponType: "Swing",
  },
  {
    id: 13,
    level: 1,
    weaponHeft: "Versatile",
    weaponType: "Stab",
  },
  {
    id: 14,
    level: 1,
    weaponHeft: "Versatile",
    weaponType: "Swing",
  },
];
export function WeaponSkillManager() {
  const dispatch = useDispatch();
  const { base } = useSelector((state: RootState) => state.character);
  const { weaponSkills } = useSelector((state: RootState) => state.character.skills);
  const [modalVisible, setModalVisible] = useState(false);

  const skills = weaponSkills || [];

  // Calculate total BP spent on skills
  const totalSkillPoints = skills.reduce((total, skill) => {
    return total + calculateTotalSkillCost(skill.level);
  }, 0);

  // Select a suggested skill
  const selectWeaponSkill = (newSkill: WeaponSkill) => {
    // Update skills array with new skill
    const updatedSkills = [...skills, newSkill];
    dispatch(updateWeaponSkills(updatedSkills));

    // Update build points (cost of level 1 skill)
    const costLevel1 = calculateSkillCost(1);
    // Update both buildPointsRemaining and buildPointsSpent
    dispatch(
      updateMultipleFields([
        {
          field: "buildPointsRemaining",
          value: base.buildPointsRemaining - costLevel1,
        },
        {
          field: "buildPointsSpent",
          value: base.buildPointsSpent + costLevel1,
        },
      ])
    );
    setModalVisible(false); // Close the modal
  };

  const handleLevelChange = (skill: WeaponSkill, increase: boolean) => {
    const updatedSkills = [...skills];
    const index = updatedSkills.findIndex((s) => s.id === skill.id);
    if (index === -1) return;

    const currentLevel = skill.level;
    const newLevel = increase ? currentLevel + 1 : currentLevel - 1;

    // Validate level range (1-10)
    if (newLevel < 1 || newLevel > 10) return;

    // Calculate BP cost difference
    const costDifference = increase ? calculateSkillCost(newLevel) : -calculateSkillCost(currentLevel);

    // Check if character has enough build points for increase
    if (increase && base.buildPointsRemaining < costDifference) {
      Alert.alert("Not Enough Build Points", `You need ${costDifference} BP to upgrade this skill.`);
      return;
    }

    // Update skill level
    updatedSkills[index] = { ...skill, level: newLevel };

    // Update skills and adjust build points
    dispatch(updateWeaponSkills(updatedSkills));
    // Update both buildPointsRemaining and buildPointsSpent
    dispatch(
      updateMultipleFields([
        {
          field: "buildPointsRemaining",
          value: base.buildPointsRemaining - costDifference,
        },
        {
          field: "buildPointsSpent",
          value: base.buildPointsSpent + costDifference,
        },
      ])
    );
  };

  const handleDeleteSkill = (skill: WeaponSkill) => {
    Alert.alert("Delete Skill", `Are you sure you want to delete this skill"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // Calculate BP refund (full cost of the skill)
          const refund = calculateTotalSkillCost(skill.level);

          // Remove skill and refund BP
          const updatedSkills = skills.filter((s) => s.id !== skill.id);
          dispatch(updateWeaponSkills(updatedSkills));
          // Update both buildPointsRemaining and buildPointsSpent
          dispatch(
            updateMultipleFields([
              {
                field: "buildPointsRemaining",
                value: base.buildPointsRemaining + refund,
              },
              {
                field: "buildPointsSpent",
                value: base.buildPointsSpent - refund,
              },
            ])
          );
        },
      },
    ]);
  };

  const renderSkillItem = ({ item }: { item: WeaponSkill }) => {
    const nextLevelCost = item.level < 10 ? calculateSkillCost(item.level + 1) : null;

    return (
      <View style={styles.skillItem}>
        <View style={styles.skillHeader}>
          <View style={styles.skillNameContainer}>
            <ThemedText style={styles.skillName} numberOfLines={1} ellipsizeMode="tail">
              {item.weaponHeft} - {item.weaponType}
            </ThemedText>
          </View>
          <View style={styles.levelContainer}>
            <Pressable style={[styles.levelButton, styles.decreaseButton]} onPress={() => handleLevelChange(item, false)} disabled={item.level <= 1}>
              <ThemedText style={styles.levelButtonText}>-</ThemedText>
            </Pressable>
            <View style={styles.levelDisplay}>
              <ThemedText style={styles.levelValue}>{item.level}</ThemedText>
            </View>
            <Pressable style={[styles.levelButton, styles.increaseButton]} onPress={() => handleLevelChange(item, true)} disabled={item.level >= 10}>
              <ThemedText style={styles.levelButtonText}>+</ThemedText>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => handleDeleteSkill(item)}>
              <FontAwesome name="trash" size={14} color="#F44336" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.sectionTitle}>Weapon Skills</ThemedText>
        <View>
          <ThemedText style={styles.pointsSpent}>{totalSkillPoints} BP spent</ThemedText>
          <ThemedText style={styles.pointsRemaining}>BP remaining: {base.buildPointsRemaining}</ThemedText>
        </View>
      </View>

      {skills.length > 0 ? (
        <FlatList data={skills} renderItem={renderSkillItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.skillsList} />
      ) : (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>No skills added yet. Add your first skill!</ThemedText>
        </ThemedView>
      )}

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <FontAwesome name="plus" size={20} color="#FFFFFF" />
        <ThemedText style={styles.addButtonText}>Add Skill</ThemedText>
      </Pressable>

      {/* Add Skill Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add New Skill</ThemedText>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.suggestionsContainer}>
                <ScrollView>
                  {weaponOptions.map((weapon, index) => (
                    <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => selectWeaponSkill(weapon)}>
                      <ThemedText>
                        {weapon.weaponHeft} - {weapon.weaponType}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.costInfoContainer}>
              <ThemedText>Cost: {calculateSkillCost(1)} BP</ThemedText>
            </View>

            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pointsRemaining: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pointsSpent: {
    fontSize: 14,
    color: "#666",
  },
  skillsList: {
    paddingBottom: 80, // Space for add button
  },
  skillItem: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillNameContainer: {
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  skillName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  decreaseButton: {
    backgroundColor: "#F44336",
  },
  increaseButton: {
    backgroundColor: "#4CAF50",
  },
  levelButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  levelDisplay: {
    alignItems: "center",
    marginHorizontal: 4,
    width: 20,
  },
  levelValue: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  skillDescription: {
    fontSize: 12,
    color: "#666",
  },
  skillFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  costInfo: {
    fontSize: 12,
    color: "#666",
  },
  costInfoContainer: {
    marginBottom: 16,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
  emptyStateText: {
    color: "#666",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#007AFF",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxWidth: 500,
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
    marginBottom: 16,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dropdown: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#CCCCCC",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  onlineIndicator: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
  },
  offlineIndicator: {
    color: "#F44336",
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIndicator: {
    position: "absolute",
    right: 10,
  },
  suggestionsContainer: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    maxHeight: 200,
  },
  suggestionsScrollView: {
    maxHeight: 180,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },
  similarityText: {
    fontSize: 12,
    color: "#666",
  },
});
