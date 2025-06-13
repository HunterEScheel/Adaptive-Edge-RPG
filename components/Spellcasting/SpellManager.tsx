import { RootState } from "@/store/rootReducer";
import { updateField, updateMultipleFields } from "@/store/slices/baseSlice";
import { Spell, addSpell, removeSpell } from "@/store/slices/magicSlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// List of available spells organized by school
const AVAILABLE_SPELLS: Omit<Spell, "id">[] = [
  {
    name: "Fireball",
    school: "Evocation",
    description: "A bright streak flashes from your pointing finger to a point you choose and then blossoms with a low roar into an explosion of flame.",
    energyCost: 13,
    buildPointCost: 18,
    damage: "8d6 fire damage",
    range: "150 feet",
    area: "20-foot radius sphere",
    duration: "Instantaneous",
  },
  // More spells can be added here
];

export function SpellManager() {
  const magic = useSelector((state: RootState) => state.character?.magic || { magicSchools: [], spells: [], magicSchoolCredit: false });
  const base = useSelector((state: RootState) => state.character?.base || { buildPointsRemaining: 0, buildPointsSpent: 0, energy: 0 });
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  // Filter spells based on known magic schools
  const availableSpells = AVAILABLE_SPELLS.filter((spell) => magic.magicSchools?.some((school) => school.name === spell.school) && !magic.spells?.some((knownSpell) => knownSpell.name === spell.name));

  const handleLearnSpell = (spell: Omit<Spell, "id">) => {
    // Check if character has enough build points
    if (base.buildPointsRemaining >= spell.buildPointCost) {
      // Deduct build points and add the spell
      const newBuildPoints = base.buildPointsRemaining - spell.buildPointCost;
      dispatch(addSpell(spell));
      // Update both buildPointsRemaining and buildPointsSpent
      dispatch(
        updateMultipleFields([
          { field: "buildPointsRemaining", value: newBuildPoints },
          { field: "buildPointsSpent", value: base.buildPointsSpent + spell.buildPointCost },
        ])
      );
      setModalVisible(false);
    } else {
      Alert.alert("Not Enough Build Points", `You need ${spell.buildPointCost} build points to learn this spell. You currently have ${base.buildPointsRemaining}.`);
    }
  };

  const handleRemoveSpell = (spellId: string) => {
    // Find the spell to get its cost for refund
    const spell = magic.spells?.find((s) => s.id === spellId);
    if (!spell) return;

    // Confirm before removing
    Alert.alert("Remove Spell", `Are you sure you want to remove ${spell.name}? You will receive ${spell.buildPointCost} build points back.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          // Refund build points and remove the spell
          const newBuildPoints = base.buildPointsRemaining + spell.buildPointCost;
          dispatch(removeSpell(spellId));
          // Update both buildPointsRemaining and buildPointsSpent
          dispatch(
            updateMultipleFields([
              { field: "buildPointsRemaining", value: newBuildPoints },
              { field: "buildPointsSpent", value: base.buildPointsSpent - spell.buildPointCost },
            ])
          );
        },
      },
    ]);
  };

  // Handle using a spell (spending energy)
  const handleUseSpell = (spell: Spell) => {
    // Check if character has enough energy
    if ((base.energy || 0) < spell.energyCost) {
      Alert.alert("Not Enough Energy", `You need ${spell.energyCost} energy to cast ${spell.name}. You have ${base.energy || 0} energy.`);
      return;
    }

    // Spend the energy
    dispatch(
      updateField({
        field: "energy",
        value: base.energy - spell.energyCost,
      })
    );

    // Show success message
    Alert.alert("Spell Cast", `${spell.name} cast successfully! ${spell.energyCost} energy spent.`, [{ text: "OK" }]);
  };

  // Group spells by school for display
  const groupedSpells: { [key: string]: Spell[] } = {};
  magic.spells?.forEach((spell) => {
    if (!groupedSpells[spell.school]) {
      groupedSpells[spell.school] = [];
    }
    groupedSpells[spell.school].push(spell);
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Spellbook</ThemedText>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)} disabled={magic.magicSchools?.length === 0}>
          <FontAwesome name="plus" size={18} color="white" />
        </Pressable>
      </View>

      {Object.keys(groupedSpells).length > 0 ? (
        Object.entries(groupedSpells).map(([school, spells]) => (
          <View key={school} style={styles.schoolSection}>
            <ThemedText style={styles.schoolTitle}>{school}</ThemedText>
            {spells.map((spell) => (
              <View key={spell.id} style={styles.spellItem}>
                <View style={styles.spellHeader}>
                  <ThemedText style={styles.spellName}>{spell.name}</ThemedText>
                  <Pressable style={styles.removeButton} onPress={() => handleRemoveSpell(spell.id)}>
                    <FontAwesome name="trash" size={16} color="#f44336" />
                  </Pressable>
                </View>
                <ThemedText style={styles.spellDescription}>{spell.description}</ThemedText>
                <View style={styles.spellDetails}>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Energy Cost:</ThemedText>
                    <ThemedText style={styles.detailValue}>{spell.energyCost}</ThemedText>
                  </View>
                  {spell.damage && (
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Damage:</ThemedText>
                      <ThemedText style={styles.detailValue}>{spell.damage}</ThemedText>
                    </View>
                  )}
                  {spell.range && (
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Range:</ThemedText>
                      <ThemedText style={styles.detailValue}>{spell.range}</ThemedText>
                    </View>
                  )}
                  {spell.area && (
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Area:</ThemedText>
                      <ThemedText style={styles.detailValue}>{spell.area}</ThemedText>
                    </View>
                  )}
                  {spell.duration && (
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Duration:</ThemedText>
                      <ThemedText style={styles.detailValue}>{spell.duration}</ThemedText>
                    </View>
                  )}
                  <Pressable
                    style={[styles.useSpellButton, (base.energy || 0) < spell.energyCost && styles.disabledButton]}
                    onPress={() => handleUseSpell(spell)}
                    disabled={(base.energy || 0) < spell.energyCost}
                  >
                    <ThemedText style={styles.useSpellButtonText}>Cast Spell</ThemedText>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ))
      ) : (
        <ThemedText style={styles.emptyText}>You haven't learned any spells yet. Learn a magic school first, then add spells from that school.</ThemedText>
      )}

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText style={styles.modalTitle}>Learn New Spell</ThemedText>

            <FlatList
              data={availableSpells}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Pressable style={styles.spellOption} onPress={() => handleLearnSpell(item)}>
                  <View style={styles.spellOptionHeader}>
                    <ThemedText style={styles.spellOptionName}>{item.name}</ThemedText>
                    <ThemedText style={styles.spellOptionCost}>{item.buildPointCost} BP</ThemedText>
                  </View>
                  <ThemedText style={styles.spellOptionSchool}>{item.school}</ThemedText>
                  <ThemedText style={styles.spellOptionDescription}>{item.description}</ThemedText>
                  <View style={styles.spellOptionDetails}>
                    <ThemedText style={styles.spellOptionDetail}>Energy: {item.energyCost}</ThemedText>
                    {item.damage ? <ThemedText style={styles.spellOptionDetail}>Damage: {item.damage}</ThemedText> : null}
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <ThemedText style={styles.emptyText}>
                  {magic.magicSchools?.length > 0 ? "You've learned all available spells for your magic schools!" : "You need to learn a magic school before you can learn spells."}
                </ThemedText>
              }
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
  schoolSection: {
    marginBottom: 15,
  },
  schoolTitle: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  spellItem: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 6,
    marginBottom: 8,
  },
  spellHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  spellName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  spellDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  spellDetails: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 8,
    borderRadius: 4,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
    color: "#555",
  },
  detailValue: {
    fontSize: 12,
    color: "#555",
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
  spellOption: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 6,
    marginBottom: 8,
  },
  spellOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spellOptionName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  spellOptionCost: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  spellOptionSchool: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 4,
  },
  spellOptionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  spellOptionDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  spellOptionDetail: {
    fontSize: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
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
  useSpellButton: {
    backgroundColor: "#673AB7", // Purple for magic
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: "center",
  },
  useSpellButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
});
