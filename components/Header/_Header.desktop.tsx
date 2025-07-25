import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { resetCharacterLoaded } from "@/store/characterAuthSlice";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StatAdjuster } from "../MainPage/StatAdjuster";
import { StatUpgrader } from "../MainPage/StatUpgrader";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { calculateTotalDamageReduction, calculateTotalEvasion } from "../Utility/CalculateTotals";
import { EvasionBreakdownModal } from "./EvasionBreakdownModal";
import { LongRestButton } from "./LongRestButton";
import { SaveButton } from "./SaveButton";
import { BuildPointManager } from "./StatAdjustments/BuildPointManager";

const localStyles = StyleSheet.create({
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export function CharacterHeaderDesktop() {
  const styles = useResponsiveStyles();
  const character = useSelector((state: RootState) => state.character);
  const base = useSelector((state: RootState) => state.character.base);
  const dispatch = useDispatch();
  const [hpModalVisible, setHpModalVisible] = useState(false);
  const [energyModalVisible, setEnergyModalVisible] = useState(false);
  const [evasionBreakdownModalVisible, setEvasionBreakdownModalVisible] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(base?.name || "");

  const isTablet = false; // You can determine this based on screen size if needed

  useEffect(() => {
    if (base?.name) {
      setNameValue(base.name);
    }
  }, [base?.name]);

  const handleHeal = (statType: "hp" | "energy") => {
    const currentValue = statType === "hp" ? base.hitPoints : base.energy;
    const maxValue = statType === "hp" ? base.maxHitPoints : base.maxEnergy;
    const fieldName = statType === "hp" ? "hitPoints" : "energy";

    if (currentValue < maxValue) {
      dispatch(updateMultipleFields([{ field: fieldName, value: Math.min(currentValue + 1, maxValue) }]));
    }
  };

  const handleDamage = (statType: "hp" | "energy") => {
    const currentValue = statType === "hp" ? base.hitPoints : base.energy;
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

  if (!base) {
    return (
      <View style={styles.sectionHeaderContainer}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView>
      <View style={styles.row}>
        <Pressable style={[styles.defaultButton, styles.primaryColors]} onPress={() => dispatch(resetCharacterLoaded())}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Pressable>
        {/* Character Name (Editable) */}
        {isEditingName ? (
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={nameValue} onChangeText={setNameValue} autoFocus onBlur={handleNameEdit} />
            <Pressable style={styles.primaryButton} onPress={handleNameEdit}>
              <ThemedText style={styles.primaryText}>Save</ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
            <Pressable onPress={handleNameClick}>
              <ThemedText type="subtitle" style={styles.input}>
                {base.name || "Unnamed Character"}
                <ThemedText style={styles.primaryText}> ✎</ThemedText>
              </ThemedText>
            </Pressable>
            <View style={{ padding: 10 }}>
              <LongRestButton />
            </View>
            <View style={{ padding: 10 }}>
              <SaveButton />
            </View>
            <BuildPointManager />
          </View>
        )}
      </View>
      <ThemedView style={[styles.sectionHeaderContainer, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
        {/* Attributes Section */}
        <ThemedView style={[styles.attributeSectionContainer, {}]}>
          <ThemedView style={styles.attributeRowContainer}>
            <StatAdjuster statName="POW" fieldName="pow" minValue={-4} maxValue={5} compact={true} isAttribute />
            <StatAdjuster statName="AGI" fieldName="agi" minValue={-4} maxValue={5} compact={true} isAttribute />
          </ThemedView>
          <ThemedView style={styles.attributeRowContainer}>
            <StatAdjuster statName="LOR" fieldName="lor" minValue={-4} maxValue={5} compact={true} isAttribute />
            <StatAdjuster statName="INS" fieldName="ins" minValue={-4} maxValue={5} compact={true} isAttribute />
            <StatAdjuster statName="INF" fieldName="inf" minValue={-4} maxValue={5} compact={true} isAttribute />
          </ThemedView>
        </ThemedView>

        {/* Stats Section */}
        <ThemedView style={{}}>
          <View style={styles.statRow}>
            <View style={[styles.sectionContainer, { width: isTablet ? 100 : 120, margin: 4 }]}>
              <View style={[styles.row, { justifyContent: "center" }]}>
                <Pressable
                  style={[styles.condensedButton, styles.secondaryColors, { width: 30, height: 30, padding: 4, marginHorizontal: 8 }]}
                  onPress={() => handleDamage("hp")}
                  disabled={base.hitPoints <= 0}
                >
                  <ThemedText style={[styles.description, styles.secondaryText, { fontSize: 12 }]}>+</ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.condensedButton, styles.primaryColors, { width: 30, height: 30, padding: 4, marginHorizontal: 8 }]}
                  onPress={() => handleHeal("hp")}
                  disabled={base.hitPoints >= base.maxHitPoints}
                >
                  <ThemedText style={[styles.description, styles.primaryText, { fontSize: 12 }]}>-</ThemedText>
                </Pressable>
              </View>
              <Pressable style={[styles.sectionHeaderContainer, { paddingHorizontal: 4 }]} onPress={() => setHpModalVisible(true)}>
                <ThemedText style={[styles.description, styles.defaultBold, { fontSize: 16 }]}>HP</ThemedText>
                <ThemedText style={[styles.description, { fontSize: 16 }]}>
                  {base.hitPoints}/{base.maxHitPoints}
                </ThemedText>
              </Pressable>

              <StatUpgrader statType="hp" visible={hpModalVisible} onClose={() => setHpModalVisible(false)} />
            </View>
            <View style={[styles.sectionContainer, { width: isTablet ? 100 : 120, margin: 4 }]}>
              <View style={[styles.row, { justifyContent: "center" }]}>
                <Pressable
                  style={[styles.condensedButton, styles.secondaryColors, { width: 30, height: 30, padding: 4, marginHorizontal: 8 }]}
                  onPress={() => handleDamage("energy")}
                  disabled={base.hitPoints <= 0}
                >
                  <ThemedText style={[styles.description, styles.secondaryText, { fontSize: 12 }]}>-</ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.condensedButton, styles.primaryColors, { width: 30, height: 30, padding: 4, marginHorizontal: 8 }]}
                  onPress={() => handleHeal("energy")}
                  disabled={base.energy >= base.maxEnergy}
                >
                  <ThemedText style={[styles.description, styles.primaryText, { fontSize: 12 }]}>+</ThemedText>
                </Pressable>
              </View>
              <View>
                <Pressable style={[styles.sectionHeaderContainer, { paddingHorizontal: 4 }]} onPress={() => setEnergyModalVisible(true)}>
                  <ThemedText style={[styles.description, styles.defaultBold, { fontSize: 16 }]}>EP</ThemedText>
                  <ThemedText style={[styles.description, { fontSize: 16 }]}>
                    {base.energy}/{base.maxEnergy}
                  </ThemedText>
                </Pressable>
              </View>
              <StatUpgrader statType="energy" visible={energyModalVisible} onClose={() => setEnergyModalVisible(false)} />
            </View>
            <View style={[styles.sectionContainer, { width: isTablet ? 90 : 100, margin: 4 }]}>
              <Pressable onPress={() => setEvasionBreakdownModalVisible(true)} style={{ alignItems: "center" }}>
                <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>Evasion: {calculateTotalEvasion(character)}</ThemedText>
                <ThemedText style={{ fontSize: 14 }}>DR: {calculateTotalDamageReduction(character)}</ThemedText>
              </Pressable>
              <ThemedText style={{ fontSize: 12, textAlign: "center" }}>{character.inventory.armor?.armorClassification ? character.inventory.armor.armorClassification : "No Armor"}</ThemedText>
            </View>
            <View style={[styles.sectionContainer, { width: isTablet ? 90 : 100, margin: 4 }]}>
              <EvasionBreakdownModal visible={evasionBreakdownModalVisible} onClose={() => setEvasionBreakdownModalVisible(false)} character={character} />
              <StatAdjuster statName="Speed" fieldName="movement" compact={true} />
            </View>
          </View>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
