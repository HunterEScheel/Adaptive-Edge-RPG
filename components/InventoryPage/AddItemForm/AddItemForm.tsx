import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { eItemClassifications, Equipment, iItem, itemClassifications, Weapon } from "@/constants/Item";
import { addEquipment, addWeapon } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch } from "react-redux";
import { AddArmor } from "./AddArmor";
import { AddConsumable } from "./AddConsumable";
import { AddEquipment } from "./AddEquipment";
import { AddWeapon } from "./AddWeapon";

// Simple ID generator function that doesn't require crypto
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Get screen dimensions for responsive layout
const { width, height } = Dimensions.get("window");

// Separate component for each form type to prevent re-renders
const WeaponForm = React.memo(({ onChange }: { onChange: (item: Partial<iItem>) => void }) => {
  return <AddWeapon onChange={onChange} />;
});

const EquipmentForm = React.memo(({ onChange }: { onChange: (item: Partial<iItem>) => void }) => {
  return <AddEquipment onChange={onChange} />;
});

const ArmorForm = React.memo(({ onChange }: { onChange: (item: Partial<iItem>) => void }) => {
  return <AddArmor onChange={onChange} />;
});

const ConsumableForm = React.memo(({ onChange }: { onChange: (item: Partial<iItem>) => void }) => {
  return <AddConsumable onChange={onChange} />;
});

const OtherForm = React.memo(() => {
  return <ThemedText>Other item types coming soon</ThemedText>;
});

type AddItemFormProps = {
  open?: boolean;
  setOpen?: (e: boolean) => void;
  onClose?: () => void;
};

export function AddItemForm({ open, setOpen, onClose }: AddItemFormProps) {
  // Handle both interface styles
  const isOpen = open !== undefined ? open : true;
  const handleClose = () => {
    if (setOpen) setOpen(false);
    if (onClose) onClose();
  };
  const dispatch = useDispatch();
  const [itemClass, setItemClass] = useState<eItemClassifications>(eItemClassifications.weapon);
  const [itemData, setItemData] = useState<Partial<iItem>>({
    id: generateId(),
    class: eItemClassifications.weapon,
    name: "",
    qty: 1,
    value: 0,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setItemData({
        id: generateId(),
        class: itemClass,
        name: "",
        qty: 1,
        value: 0,
      });
    }
  }, [open]);

  // Update item class in item data when dropdown changes
  useEffect(() => {
    setItemData((prev) => ({
      ...prev,
      class: itemClass,
    }));
  }, [itemClass]);

  // Memoized callback to prevent unnecessary re-renders
  const handleItemChange = useCallback((newData: Partial<iItem>) => {
    setItemData((prev) => ({
      ...prev,
      ...newData,
      // Always preserve the current class and id
      class: prev.class,
      id: prev.id,
    }));
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={handleClose}>
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Add New Item</ThemedText>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <FontAwesome name="times" size={20} color="#FFF" />
            </Pressable>
          </View>

          <View style={styles.formSection}>
            <ThemedText style={styles.sectionLabel}>Item Type</ThemedText>
            <Dropdown
              data={itemClassifications}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              onChange={(item) => {
                setItemClass(item.value);
                setItemData((prev) => ({ ...prev, class: item.value }));
              }}
              value={itemClass}
              labelField={"name"}
              valueField={"value"}
              renderLeftIcon={() => <FontAwesome name="list-ul" size={16} color="#555" style={{ marginRight: 10 }} />}
            />
          </View>

          <ScrollView style={styles.formContent} contentContainerStyle={styles.formContentContainer}>
            {itemClass === eItemClassifications.weapon ? <WeaponForm onChange={handleItemChange} /> : null}
            {itemClass === eItemClassifications.equipment ? <EquipmentForm onChange={handleItemChange} /> : null}
            {itemClass === eItemClassifications.armor ? <ArmorForm onChange={handleItemChange} /> : null}
            {itemClass === eItemClassifications.consumable ? <ConsumableForm onChange={handleItemChange} /> : null}
            {itemClass === eItemClassifications.other ? <OtherForm /> : null}
          </ScrollView>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={styles.saveButton}
              onPress={() => {
                // Validate item data
                if (!itemData.name) {
                  Alert.alert("Missing Information", "Please enter a name for the item.");
                  return;
                }

                // Save logic based on item type
                switch (itemData.class) {
                  case eItemClassifications.weapon:
                    dispatch(addWeapon(itemData as Weapon));
                    break;
                  case eItemClassifications.equipment:
                    dispatch(addEquipment(itemData as Equipment));
                    break;
                  case eItemClassifications.consumable:
                    // Add consumable logic when implemented
                    Alert.alert("Not Implemented", "Adding consumables is not yet implemented.");
                    break;
                  default:
                    // Handle other item types
                    Alert.alert("Not Implemented", "Adding this item type is not yet implemented.");
                    break;
                }

                Alert.alert("Item Added", "Your item has been added to inventory.");
                handleClose();
              }}
            >
              <ThemedText style={styles.buttonText}>Add Item</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: height * 0.05,
  },
  modalView: {
    width: "90%",
    maxHeight: "90%",
    borderRadius: 12,
    padding: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "#4a4a4a",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    width: "100%",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  formContent: {
    width: "100%",
    padding: 15,
    flexGrow: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#9e9e9e",
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  formContentContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
});
