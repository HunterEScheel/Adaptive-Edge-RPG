import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StatAdjuster } from "../MainPage/StatAdjuster";
import { StatUpgrader } from "../MainPage/StatUpgrader";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { calculateTotalAC } from "../Utility/CalculateTotals";
import { BuildPointManager } from "./BuildPointManager";
import { LongRestButton } from "./LongRestButton";
import { PresetManagerButton } from "./PresetManagerButton";
import { SaveButton } from "./SaveButton";

export function CharacterHeader() {
  const character = useSelector((state: RootState) => state.character.base);
  const dispatch = useDispatch();
  const [hpModalVisible, setHpModalVisible] = useState(false);
  const [energyModalVisible, setEnergyModalVisible] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

  const handleHeal = (statType: "hp" | "energy") => {
    const currentValue = statType === "hp" ? character.hitPoints : character.energy;
    const maxValue = statType === "hp" ? character.maxHitPoints : character.maxEnergy;
    const fieldName = statType === "hp" ? "hitPoints" : "energy";

    if (currentValue < maxValue) {
      dispatch(updateMultipleFields([{ field: fieldName, value: Math.min(currentValue + 1, maxValue) }]));
    }
  };

  const handleDamage = (statType: "hp" | "energy") => {
    const currentValue = statType === "hp" ? character.hitPoints : character.energy;
    const fieldName = statType === "hp" ? "hitPoints" : "energy";

    if (currentValue > 0) {
      dispatch(updateMultipleFields([{ field: fieldName, value: currentValue - 1 }]));
    }
  };

  const handleNameEdit = () => {
    dispatch(updateMultipleFields([{ field: "name", value: nameValue }]));
    setIsEditingName(false);
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  if (!character) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topRow}>
        {/* Character Name (Editable) */}
        <View style={styles.nameContainer}>
          {isEditingName ? (
            <View style={styles.nameEditContainer}>
              <TextInput style={styles.nameInput} value={nameValue} onChangeText={setNameValue} autoFocus onBlur={handleNameEdit} />
            </View>
          ) : (
            <Pressable onPress={handleNameClick}>
              <ThemedText type="subtitle" style={styles.characterName}>
                {character.name || "Unnamed Character"}
                <ThemedText style={styles.editIcon}> ✎</ThemedText>
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Header Actions */}
        <View style={styles.headerActions}>
          <LongRestButton compact={true} />
          <View style={styles.headerSaveButton}>
            <SaveButton compact={true} />
          </View>
          <PresetManagerButton compact={true} />
          <BuildPointManager compact={true} />
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Left Side - Ability Scores */}
        <View style={styles.abilityScoresContainer}>
          <View style={styles.abilityScoreRow}>
            <StatAdjuster statName="STR" fieldName="str" minValue={-4} maxValue={5} compact={true} />
            <StatAdjuster statName="DEX" fieldName="dex" minValue={-4} maxValue={5} compact={true} />
            <StatAdjuster statName="CON" fieldName="con" minValue={-4} maxValue={5} compact={true} />
          </View>
          <View style={styles.abilityScoreRow}>
            <StatAdjuster statName="INT" fieldName="int" minValue={-4} maxValue={5} compact={true} />
            <StatAdjuster statName="WIS" fieldName="wis" minValue={-4} maxValue={5} compact={true} />
            <StatAdjuster statName="CHA" fieldName="cha" minValue={-4} maxValue={5} compact={true} />
          </View>
        </View>

        {/* Right Side - Character Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {/* HP with current/max display */}
            <View style={[styles.statItem, styles.largeStatItem]}>
              <ThemedText style={styles.statLabel}>HP</ThemedText>
              <View style={styles.statValueContainer}>
                <View style={styles.currentValueContainer}>
                  <Pressable style={[styles.adjustButton, styles.healButton]} onPress={() => handleHeal("hp")} disabled={character.hitPoints >= character.maxHitPoints}>
                    <ThemedText style={styles.adjustButtonText}>HEAL</ThemedText>
                  </Pressable>
                  <ThemedText style={styles.statValue}>{character.hitPoints}</ThemedText>
                  <Pressable style={[styles.adjustButton, styles.damageButton]} onPress={() => handleDamage("hp")} disabled={character.hitPoints <= 0}>
                    <ThemedText style={styles.adjustButtonText}>DAMAGE</ThemedText>
                  </Pressable>
                </View>
                <ThemedText style={styles.statSeparator}>/</ThemedText>
                <Pressable onPress={() => setHpModalVisible(true)} style={styles.maxValueButton}>
                  <ThemedText style={[styles.statValue, styles.maxValue]}>{character.maxHitPoints}</ThemedText>
                </Pressable>
                <StatUpgrader statType="hp" visible={hpModalVisible} onClose={() => setHpModalVisible(false)} />
              </View>
            </View>
            {/* Energy with current/max display */}
            <View style={[styles.statItem, styles.largeStatItem]}>
              <ThemedText style={styles.statLabel}>Energy</ThemedText>
              <View style={styles.statValueContainer}>
                <View style={styles.currentValueContainer}>
                  <Pressable style={[styles.adjustButton, styles.healButton]} onPress={() => handleHeal("energy")} disabled={character.energy >= character.maxEnergy}>
                    <ThemedText style={styles.adjustButtonText}>ABSORB</ThemedText>
                  </Pressable>
                  <ThemedText style={styles.statValue}>{character.energy}</ThemedText>
                  <Pressable style={[styles.adjustButton, styles.damageButton]} onPress={() => handleDamage("energy")} disabled={character.energy <= 0}>
                    <ThemedText style={styles.adjustButtonText}>EXPEND</ThemedText>
                  </Pressable>
                </View>
                <ThemedText style={styles.statSeparator}>/</ThemedText>
                <Pressable onPress={() => setEnergyModalVisible(true)} style={styles.maxValueButton}>
                  <ThemedText style={[styles.statValue, styles.maxValue]}>{character.maxEnergy}</ThemedText>
                </Pressable>
                <StatUpgrader statType="energy" visible={energyModalVisible} onClose={() => setEnergyModalVisible(false)} />
              </View>
            </View>
            {/* AC */}
            <View style={[styles.statItem, styles.smallStatItem]}>
              <ThemedText>AC: {calculateTotalAC(character)}</ThemedText>
            </View>

            {/* Speed */}
            <View style={[styles.statItem, styles.smallStatItem]}>
              <StatAdjuster statName="Speed" fieldName="movement" compact={true} />
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40, // Extra padding for system icons
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  nameContainer: {
    flex: 1,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameInput: {
    fontSize: 18,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
    paddingVertical: 4,
    flex: 1,
  },
  saveNameButton: {
    padding: 8,
  },
  characterName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editIcon: {
    fontSize: 14,
    color: "#007AFF",
  },
  buildPointsContainer: {
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerSaveButton: {
    marginHorizontal: 4,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  abilityScoresContainer: {
    flex: 0.4,
    flexDirection: "column",
  },
  abilityScoreRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
  },
  statsContainer: {
    flex: 1,
    paddingLeft: 40,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
  statItem: {
    flex: 1,
  },
  largeStatItem: {
    maxWidth: 140,
  },
  smallStatItem: {
    maxWidth: 65,
    transform: [{ scale: 0.85 }],
    marginHorizontal: -4,
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  maxValue: {
    textDecorationLine: "underline",
    color: "#007AFF",
  },
  currentValueContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  adjustButton: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    minWidth: 54,
    opacity: 1,
  },
  healButton: {
    backgroundColor: "#4CAF50",
  },
  damageButton: {
    backgroundColor: "#f44336",
  },
  adjustButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  statSeparator: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 3,
  },
  maxValueButton: {
    padding: 6,
    borderRadius: 4,
    marginLeft: -2,
  },
});
