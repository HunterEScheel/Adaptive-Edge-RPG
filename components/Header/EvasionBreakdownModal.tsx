import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { calculateTotalDamageReduction } from "@/components/Utility/CalculateTotals";
import { Consumable, Equipment } from "@/constants/Item";
import { ePlayerStat } from "@/constants/Stats";
import { Character } from "@/store/slices/characterSlice";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";

interface EvasionBreakdownModalProps {
  visible: boolean;
  onClose: () => void;
  character: Character;
}

export function EvasionBreakdownModal({ visible, onClose, character }: EvasionBreakdownModalProps) {
  const cssStyle = useResponsiveStyles();
  // Calculate each component of Evasion
  const baseEvasion = 10 + character.base.agi;

  const equipmentEvasion =
    character.inventory?.equipment
      ?.filter((x: Equipment) => x.statEffected === ePlayerStat.evasion && (!x.requiresAttunement || x.attunement) && x.equipped)
      .reduce((total: number, item: Equipment) => total + (item.statModifier || 0), 0) || 0;

  const consumableEvasion =
    character.inventory?.consumables?.filter((x: Consumable) => x.statEffected === ePlayerStat.evasion).reduce((total: number, item: Consumable) => total + (item.statModifier || 0), 0) || 0;

  let dodgeEvasion = character.skills?.dodge || 0;

  // Apply dodge reduction from armor
  const dodgeReduction = character.inventory?.armor?.statUpdates?.evasionReduction || 0;

  // Heavy armor still completely blocks dodge
  if (character.inventory?.armor?.armorClassification === "Heavy") {
    dodgeEvasion = 0;
  }

  const totalEvasion = baseEvasion + equipmentEvasion + consumableEvasion + dodgeEvasion - dodgeReduction;
  const totalDR = calculateTotalDamageReduction(character);

  const equipmentItems = character.inventory?.equipment?.filter((x: Equipment) => x.statEffected === ePlayerStat.evasion && (!x.requiresAttunement || x.attunement) && x.equipped) || [];

  const consumableItems = character.inventory?.consumables?.filter((x: Consumable) => x.statEffected === ePlayerStat.evasion) || [];

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={cssStyle.modalOverlay}>
        <View style={cssStyle.modalView}>
          <View style={cssStyle.modalHeader}>
            <ThemedText style={cssStyle.modalTitle}>Evasion Breakdown</ThemedText>
            <Pressable style={cssStyle.centered} onPress={onClose}>
              <FontAwesome name="times" size={20} color="#FFF" />
            </Pressable>
          </View>

          <View style={cssStyle.modalContent}>
            <ScrollView style={cssStyle.container}>
              <View style={cssStyle.lightContainer}>
                <ThemedText style={cssStyle.largeValue}>Total Evasion: {totalEvasion}</ThemedText>
                <ThemedText style={cssStyle.largeValue}>Damage Reduction: {totalDR}</ThemedText>
              </View>

              <View style={cssStyle.container}>
                <ThemedText style={cssStyle.sectionHeader}>Evasion Breakdown:</ThemedText>

                <View style={cssStyle.row}>
                  <ThemedText style={cssStyle.label}>
                    10 + {character.base.agi}(DEX): {10 + character.base.agi}
                  </ThemedText>
                </View>
                <View style={cssStyle.row}>
                  <ThemedText style={cssStyle.label}>Dodge: +{dodgeEvasion} </ThemedText>
                </View>

                <View style={cssStyle.row}>
                  <ThemedText style={cssStyle.label}>
                    Reduction({character.inventory.armor?.name}): -{dodgeReduction}
                  </ThemedText>
                </View>
                {character.inventory.armor && (
                  <>
                    <ThemedText style={cssStyle.sectionHeader}>
                      Damage Reduction: {character.inventory.armor.statUpdates?.damageReduction} ({character.inventory.armor.name})
                    </ThemedText>
                  </>
                )}

                {equipmentItems.length > 0 && (
                  <>
                    <ThemedText style={cssStyle.subtitle}>Equipment Bonuses:</ThemedText>
                    {equipmentItems.map((item: Equipment, index: number) => (
                      <View key={index} style={cssStyle.row}>
                        <ThemedText style={cssStyle.label}>{item.name}</ThemedText>
                        <ThemedText style={cssStyle.valueText}>+{item.statModifier}</ThemedText>
                      </View>
                    ))}
                  </>
                )}

                {consumableItems.length > 0 && (
                  <>
                    <ThemedText style={cssStyle.subtitle}>Consumable Effects:</ThemedText>
                    {consumableItems.map((item: Consumable, index: number) => (
                      <View key={index} style={cssStyle.row}>
                        <ThemedText style={cssStyle.label}>{item.name}</ThemedText>
                        <ThemedText style={cssStyle.valueText}>+{item.statModifier}</ThemedText>
                      </View>
                    ))}
                  </>
                )}

                {(dodgeReduction > 0 || character.inventory.armor.armorClassification === "Heavy") && (
                  <View style={cssStyle.lightContainer}>
                    <ThemedText style={cssStyle.subtitle}>Armor Penalties:</ThemedText>
                    <ThemedText style={cssStyle.emptyText}>This armor reduces Dodge skill by {dodgeReduction}</ThemedText>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          <View style={cssStyle.modalButtons}>
            <Pressable style={cssStyle.primaryButton} onPress={onClose}>
              <ThemedText style={cssStyle.buttonText}>Close</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
