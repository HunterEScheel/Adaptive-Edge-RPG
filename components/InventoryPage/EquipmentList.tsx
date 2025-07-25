import { useResponsive, useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ListManager } from "@/components/Common/ListManager";
import { Equipment } from "@/constants/Item";
import { ePlayerStat } from "@/constants/Stats";
import { RootState } from "@/store/rootReducer";
import { removeEquipment, toggleAttunementEquipment, toggleEquipEquipment } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ListManagerMobile } from "../Common/ListManager.mobile";
import { ThemedText } from "../ThemedText";
import { EquipmentModal } from "./EquipmentModal";

interface EquipmentListProps {
  variant?: "full" | "compact" | "mini";
}

export function EquipmentList({ variant = "full" }: EquipmentListProps) {
  const cssStyle = useResponsiveStyles();
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();
  const equipment = useSelector((state: RootState) => state.character.inventory?.equipment || []);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);

  // Count attuned items
  const attunedItemsCount = equipment.filter((item) => item.attunement).length;
  const totalValue = equipment.reduce((sum, item) => sum + item.value * (item.qty || 1), 0);

  const handleRemoveEquipment = (equipmentId: string) => {
    dispatch(removeEquipment(equipmentId));
  };

  const handleEquipToggle = (equipmentId: string) => {
    dispatch(toggleEquipEquipment(equipmentId));
  };

  const handleAttunementToggle = (equipmentId: string) => {
    const item = equipment.find((e) => e.id === equipmentId);
    if (!item) return;

    // Check if we can attune more items (limit is 3)
    if (!item.attunement && attunedItemsCount >= 3) {
      Alert.alert("Attunement Limit", "You can only attune to 3 items at a time. Remove attunement from another item first.");
      return;
    }

    dispatch(toggleAttunementEquipment(equipmentId));
  };

  const getStatName = (stat: number) => {
    switch (stat) {
      case ePlayerStat.hp:
        return "HP";
      case ePlayerStat.energy:
        return "Energy";
      case ePlayerStat.bp:
        return "BP";
      case ePlayerStat.evasion:
        return "Evasion";
      case ePlayerStat.pow:
        return "POW";
      case ePlayerStat.agi:
        return "AGI";
      case ePlayerStat.lor:
        return "LOR";
      case ePlayerStat.ins:
        return "INS";
      case ePlayerStat.inf:
        return "INF";
      case ePlayerStat.movement:
        return "Speed";
      default:
        return "Unknown";
    }
  };

  const renderEquipmentItem = ({ item }: { item: Equipment }) => {
    const effectDisplay = item.statModifier ? `${getStatName(item.statEffected)} +${item.statModifier}` : "No effect";

    return (
      <View style={cssStyle.itemContainer}>
        <View style={cssStyle.itemHeader}>
          <View style={{}}>
            <ThemedText style={cssStyle.subtitle} numberOfLines={1}>
              {item.name} {item.equipped && <ThemedText style={cssStyle.hint}>(Equipped)</ThemedText>}
            </ThemedText>
            <ThemedText style={cssStyle.description}>
              {effectDisplay}
              {item.requiresAttunement && " • Requires Attunement"}
              {item.attunement && " • Attuned"}
            </ThemedText>
          </View>
          <View style={[cssStyle.row, { gap: 8 }]}>
            <Pressable style={[cssStyle.condensedButton, item.equipped ? cssStyle.secondaryColors : cssStyle.primaryColors]} onPress={() => handleEquipToggle(item.id)}>
              <ThemedText style={item.equipped ? cssStyle.secondaryText : cssStyle.primaryText}>{item.equipped ? "Unequip" : "Equip"}</ThemedText>
            </Pressable>
            {item.requiresAttunement && (
              <Pressable style={[cssStyle.condensedButton, item.attunement ? cssStyle.primaryColors : cssStyle.secondaryColors]} onPress={() => handleAttunementToggle(item.id)}>
                <FontAwesome name={item.attunement ? "star" : "star-o"} size={14} color={item.attunement ? "white" : "#666"} />
              </Pressable>
            )}
            <Pressable style={[cssStyle.condensedButton, cssStyle.secondaryColors]} onPress={() => handleRemoveEquipment(item.id)}>
              <FontAwesome name="trash" size={14} color="white" />
            </Pressable>
          </View>
        </View>
        {item.charges !== undefined && item.maxCharges > 0 && (
          <ThemedText style={cssStyle.smallText}>
            Charges: {item.charges}/{item.maxCharges}
            {item.recharge && " (Recharges)"}
          </ThemedText>
        )}
      </View>
    );
  };

  const renderMiniEquipmentItem = ({ item }: { item: Equipment }) => {
    return (
      <ThemedText style={{ fontSize: 11 }} numberOfLines={1}>
        • {item.name} ({getStatName(item.statEffected)} +{item.statModifier}){item.equipped && " [E]"}
        {item.attunement && " [A]"}
      </ThemedText>
    );
  };

  // Handle mini variant
  if (variant === "mini") {
    return (
      <>
        <ListManagerMobile<Equipment>
          title={`Equipment (${attunedItemsCount}/3 attuned)`}
          data={equipment}
          renderItem={renderMiniEquipmentItem}
          keyExtractor={(item) => item.id}
          onAddPress={() => setEquipmentModalOpen(true)}
          emptyStateText="No equipment"
        />
        <EquipmentModal visible={equipmentModalOpen} onClose={() => setEquipmentModalOpen(false)} />
      </>
    );
  }

  // Handle compact variant or phone view
  if (variant === "compact" || isMobile) {
    return (
      <>
        <ListManagerMobile<Equipment>
          title={`Equipment (${attunedItemsCount}/3)`}
          data={equipment}
          renderItem={renderEquipmentItem}
          keyExtractor={(item) => item.id}
          onAddPress={() => setEquipmentModalOpen(true)}
          addButtonText="Add"
          emptyStateText="No equipment in inventory"
        />
        <EquipmentModal visible={equipmentModalOpen} onClose={() => setEquipmentModalOpen(false)} />
      </>
    );
  }

  // Full variant
  return (
    <>
      <ListManager
        title="Equipment"
        description={`${equipment.length} item${equipment.length !== 1 ? "s" : ""} • ${attunedItemsCount}/3 attuned • Total value: ${totalValue} gp`}
        data={equipment}
        renderItem={renderEquipmentItem}
        keyExtractor={(item: Equipment) => item.id}
        onAddPress={() => setEquipmentModalOpen(true)}
        addButtonText="Add Equipment"
        emptyStateText="No equipment in your inventory. Add equipment to enhance your abilities!"
      />
      <EquipmentModal visible={equipmentModalOpen} onClose={() => setEquipmentModalOpen(false)} />
    </>
  );
}
