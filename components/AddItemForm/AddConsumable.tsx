import { ThemedText } from "@/components/ThemedText";
import { Consumable, eItemClassifications, iItem } from "@/constants/Item";
import { ePlayerStat, pStatOptions } from "@/constants/Stats";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { default as VersatileInput } from "../Input";

type AddConsumableProps = {
  onChange: (item: Partial<iItem>) => void;
};

// Get screen dimensions for responsive layout
const { width } = Dimensions.get("window");

export function AddConsumable({ onChange }: AddConsumableProps) {
  const [consumable, setConsumable] = useState<Partial<Consumable>>({
    class: eItemClassifications.consumable,
    name: "",
    qty: 1,
    value: 0,
    statEffected: ePlayerStat.hp,
    statModifier: 0,
  });

  // Update parent component when consumable state changes
  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the first render to prevent initial state update loop
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange(consumable);
  }, [consumable]);

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <ThemedText style={styles.sectionTitle}>Consumable Details</ThemedText>

      {/* Basic Info Section */}
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionSubtitle}>Basic Information</ThemedText>
        <View style={styles.formRow}>
          <VersatileInput 
            label="Name" 
            type="string" 
            value={consumable.name || ""} 
            onChangeText={(text) => setConsumable({ ...consumable, name: text })} 
            style={styles.fullWidth} 
            placeholder="Enter consumable name" 
          />
        </View>

        <View style={styles.formRow}>
          <VersatileInput
            label="Quantity"
            type="number"
            value={consumable.qty !== undefined ? consumable.qty.toString() : "1"}
            onChangeText={(text) => setConsumable({ ...consumable, qty: parseInt(text) || 0 })}
            style={styles.halfWidth}
            placeholder="1"
          />
          <VersatileInput
            label="Value (gold)"
            type="number"
            value={consumable.value !== undefined ? consumable.value.toString() : "0"}
            onChangeText={(text) => setConsumable({ ...consumable, value: parseInt(text) || 0 })}
            style={styles.halfWidth}
            placeholder="0"
          />
        </View>
      </View>

      {/* Effect Section */}
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionSubtitle}>Consumable Effects</ThemedText>

        <View style={styles.formRow}>
          <View style={styles.halfWidth}>
            <ThemedText style={styles.label}>Affects Stat</ThemedText>
            <Dropdown
              data={pStatOptions}
              labelField="name"
              valueField="value"
              value={consumable.statEffected}
              onChange={(item) => setConsumable({ ...consumable, statEffected: item.value })}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              placeholder="Select stat"
              search={false}
              renderLeftIcon={() => <FontAwesome name="flask" size={16} color="#555" style={{ marginRight: 10 }} />}
            />
          </View>
          <VersatileInput
            label="Modifier Value"
            type="number"
            value={consumable.statModifier !== undefined ? consumable.statModifier.toString() : "0"}
            onChangeText={(text) => setConsumable({ ...consumable, statModifier: parseInt(text) || 0 })}
            style={styles.halfWidth}
            placeholder="0"
          />
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    width: "100%",
    flexGrow: 1,
  },
  container: {
    width: "100%",
    gap: 12,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionContainer: {
    width: "100%",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    paddingBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#555",
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
    marginBottom: 10,
    flexWrap: width < 400 ? "wrap" : "nowrap",
  },
  fullWidth: {
    width: "100%",
  },
  halfWidth: {
    width: width < 400 ? "100%" : "48%",
    marginBottom: width < 400 ? 10 : 0,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  dropdown: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#333",
  },
});
