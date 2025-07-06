import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { Armor } from "@/constants/Item";
import { addArmor } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch } from "react-redux";

interface AddArmorProps {
  onChange?: (armor: Armor) => void;
}

const armorOptions: Armor[] = [
  {
    name: "Light Armor",
    armorClassification: "Light",
    id: 1,
    statUpdates: {
      evasionReduction: 2,
      damageReduction: "d4",
      threshold: 4,
      durability: 8,
    },
  },
  {
    name: "Reinforced Armor",
    armorClassification: "Reinforced",
    id: 2,
    statUpdates: {
      evasionReduction: 3,
      damageReduction: "d4",
      threshold: 5,
      durability: 10,
    },
  },
  {
    name: "Medium Armor",
    armorClassification: "Medium",
    id: 3,
    statUpdates: {
      evasionReduction: 4,
      damageReduction: "d6",
      threshold: 6,
      durability: 10,
    },
  },
  {
    name: "Heavy Armor",
    armorClassification: "Heavy",
    id: 4,
    statUpdates: {
      evasionReduction: 5,
      damageReduction: "d8",
      threshold: 8,
      durability: 10,
    },
  },
  {
    name: "Fortified Armor",
    armorClassification: "Fortified",
    id: 5,
    statUpdates: {
      evasionReduction: 6,
      damageReduction: "d10",
      threshold: 10,
      durability: 20,
    },
  },
];

export function AddArmor({ onChange }: AddArmorProps) {
  const cssStyle = useResponsiveStyles();
  const dispatch = useDispatch();
  const [armor, setArmor] = useState<Armor>({
    name: "Unarmored",
    armorClassification: "Unarmored",
    id: 1,
  });

  // Update parent component when armor state changes
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange?.(armor);
  }, [armor, onChange]);

  const handleAddArmor = () => {
    dispatch(addArmor(armor));

    // Reset form
    setArmor({
      name: "Unarmored",
      armorClassification: "Unarmored",
      id: 1,
    });
  };

  return (
    <View style={cssStyle.container}>
      <ThemedText style={cssStyle.title}>Add Armor</ThemedText>

      <View style={cssStyle.formRow}>
        <ThemedText style={cssStyle.label}>Armor Type</ThemedText>
        <Dropdown
          data={armorOptions.map((option) => ({
            label: option.armorClassification,
            value: option.id,
          }))}
          labelField="label"
          valueField="value"
          value={armor.id}
          onChange={(item) => setArmor(armorOptions.find((option) => option.id === item.value) || armor)}
          style={cssStyle.dropdown}
          placeholder="Select armor type"
        />
      </View>
      <TextInput style={[cssStyle.input]} value={armor.name} onChangeText={(text) => setArmor({ ...armor, name: text })} placeholder="Custom name" />

      <View style={cssStyle.formRow}>
        <ThemedText style={cssStyle.smallText}>
          Damage Reduction: <ThemedText style={cssStyle.valueText}>{armor.statUpdates?.damageReduction ?? 0}</ThemedText>
        </ThemedText>
        {armor.statUpdates?.evasionReduction ? (
          <ThemedText style={cssStyle.smallText}>
            Dodge Penalty: <ThemedText style={cssStyle.valueText}>-{armor.statUpdates.evasionReduction}</ThemedText>
          </ThemedText>
        ) : null}
        <Dropdown
          data={[
            { label: "No", value: undefined },
            { label: "+1", value: 1 },
            { label: "+2", value: 2 },
            { label: "+3", value: 3 },
          ]}
          labelField="label"
          valueField="value"
          value={armor.enchantmentBonus || undefined}
          onChange={(item) => setArmor({ ...armor, enchantmentBonus: item.value })}
          style={cssStyle.dropdown}
          placeholder="Select enchantment bonus"
        />
      </View>

      <Pressable style={cssStyle.primaryButton} onPress={handleAddArmor}>
        <FontAwesome name="plus" size={16} color="white" />
        <ThemedText style={cssStyle.buttonText}>Add Armor</ThemedText>
      </Pressable>
    </View>
  );
}
