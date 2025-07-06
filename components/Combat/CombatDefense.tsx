import React from "react";
import { Pressable, View } from "react-native";

import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { calculateSkillCost } from "@/constants/Skills";
import { RootState } from "@/store/rootReducer";
import { updateMultipleFields } from "@/store/slices/baseSlice";
import { updateDodge, updateParry } from "@/store/slices/skillsSlice";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { calculateTotalDamageReduction } from "../Utility/CalculateTotals";

export function CombatDefense() {
  const cssStyle = useResponsiveStyles();
  const character = useSelector((state: RootState) => state.character);
  const { isMobile, responsiveStyle } = useResponsive();
  const dispatch = useDispatch();
  // Handle skill level changes
  const handleSkillChange = (skillName: "dodge" | "parry", delta: number) => {
    const currentLevel = character.skills[skillName] || 0;
    const newLevel = Math.max(0, currentLevel + delta);
    const currentCost = calculateSkillCost(currentLevel);
    let cost = currentLevel > newLevel ? -currentCost : calculateSkillCost(newLevel);
    if (character.base.buildPointsRemaining < cost && cost > currentCost) {
      alert(`Not enough build points to upgrade ${skillName}. Need ${cost} more.`);
      return;
    } else {
      dispatch(
        updateMultipleFields([
          { field: "buildPointsRemaining", value: character.base.buildPointsRemaining - cost },
          { field: "buildPointsSpent", value: character.base.buildPointsSpent + cost },
        ])
      );
      skillName === "dodge" ? dispatch(updateDodge(newLevel)) : dispatch(updateParry(newLevel));
    }
  };

  return (
    <View>
      <ThemedText style={[cssStyle.subtitle, { textAlign: "center" }]}>Defensive Skills</ThemedText>
      <ThemedView
        style={[
          cssStyle.container,
          responsiveStyle(
            { flexDirection: "column" }, // Phone: stack vertically
            { flexDirection: "row", justifyContent: "space-between", gap: 16 } // Tablet/Desktop: side-by-side
          ),
        ]}
      >
        {/* Dodge Skill */}
        <ThemedView style={[cssStyle.row, { justifyContent: "space-around" }]}>
          <ThemedView style={[cssStyle.sectionContainer]}>
            <ThemedView style={[cssStyle.containerColors, { padding: 8 }]}>
              <ThemedText style={[cssStyle.skillName, { textAlign: "center" }]}>Dodge</ThemedText>
            </ThemedView>
            <ThemedView style={[cssStyle.containerColors, { flexDirection: "row", alignItems: "center" }]}>
              <Pressable style={[cssStyle.defaultButton, cssStyle.secondaryColors]} onPress={() => handleSkillChange("dodge", -1)}>
                <ThemedText style={cssStyle.secondaryText}>-</ThemedText>
              </Pressable>
              <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>{character.skills.dodge || 0}</ThemedText>
              <Pressable style={[cssStyle.defaultButton, cssStyle.primaryColors]} onPress={() => handleSkillChange("dodge", 1)}>
                <ThemedText style={cssStyle.primaryText}>+</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>

          {/* Parry Skill */}
          <ThemedView style={[cssStyle.sectionContainer, { paddingVertical: 8 }]}>
            <ThemedView style={[cssStyle.containerColors, { padding: 8 }]}>
              <ThemedText style={[cssStyle.skillName, { textAlign: "center" }]}>Parry</ThemedText>
            </ThemedView>
            <ThemedView style={[cssStyle.containerColors, { flexDirection: "row", alignItems: "center" }]}>
              <Pressable style={[cssStyle.defaultButton, cssStyle.secondaryColors]} onPress={() => handleSkillChange("parry", -1)}>
                <ThemedText style={cssStyle.secondaryText}>-</ThemedText>
              </Pressable>
              <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>{character.skills.parry || 0}</ThemedText>
              <Pressable style={[cssStyle.defaultButton, cssStyle.primaryColors]} onPress={() => handleSkillChange("parry", 1)}>
                <ThemedText style={cssStyle.primaryText}>+</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <ThemedView style={[cssStyle.sectionContainer, { paddingVertical: 8 }]}>
          <ThemedView style={[cssStyle.containerColors, { padding: 8 }]}>
            <ThemedText style={[cssStyle.skillName, { textAlign: "center" }]}>Armor: {character.inventory.armor.name}</ThemedText>
          </ThemedView>
          <ThemedView style={[cssStyle.sectionItem, cssStyle.row]}>
            <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>Damage Reduction: {calculateTotalDamageReduction(character)}</ThemedText>
            <ThemedText style={[cssStyle.description, { marginHorizontal: 16 }]}>threshold: {character.inventory.armor.statUpdates?.threshold}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </View>
  );
}
