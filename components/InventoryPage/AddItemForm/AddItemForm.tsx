import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { eItemClassifications, Equipment, iItem, itemClassifications, Weapon } from "@/constants/Item";
import { addEquipment, addWeapon } from "@/store/slices/inventorySlice";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, Modal, Pressable, ScrollView, View } from "react-native";
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

const ArmorForm = React.memo(({ onChange }: { onChange: (item: any) => void }) => {
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
    const cssStyle = useResponsiveStyles();
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
        <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={handleClose}>
            <View style={cssStyle.modalOverlay}>
                <View style={cssStyle.modalView}>
                    <View style={cssStyle.modalHeader}>
                        <ThemedText style={cssStyle.modalTitle}>Add New Item</ThemedText>
                        <Pressable style={cssStyle.centered} onPress={handleClose}>
                            <FontAwesome name="times" size={20} color="#FFF" />
                        </Pressable>
                    </View>

                    <View style={cssStyle.modalContent}>
                        <View style={cssStyle.formGroup}>
                            <ThemedText style={cssStyle.subtitle}>Item Type</ThemedText>
                            <Dropdown
                                data={itemClassifications}
                                style={cssStyle.dropdown}
                                placeholderStyle={cssStyle.placeholderStyle}
                                selectedTextStyle={cssStyle.selectedTextStyle}
                                iconStyle={cssStyle.iconStyle}
                                labelField="label"
                                valueField="value"
                                placeholder="Select item type"
                                value={itemClass}
                                onChange={(item) => {
                                    setItemClass(item.value);
                                }}
                            />
                        </View>

                        <ScrollView style={cssStyle.formContent} contentContainerStyle={cssStyle.formContentContainer}>
                            {itemClass === eItemClassifications.weapon && <WeaponForm onChange={handleItemChange} />}
                            {itemClass === eItemClassifications.equipment && <EquipmentForm onChange={handleItemChange} />}
                            {itemClass === eItemClassifications.armor && <ArmorForm onChange={handleItemChange} />}
                            {itemClass === eItemClassifications.consumable && <ConsumableForm onChange={handleItemChange} />}
                            {itemClass === eItemClassifications.other && <OtherForm />}
                        </ScrollView>
                    </View>

                    <View style={cssStyle.modalButtons}>
                        <Pressable style={cssStyle.secondaryButton} onPress={handleClose}>
                            <ThemedText style={cssStyle.secondaryButtonText}>Cancel</ThemedText>
                        </Pressable>
                        <Pressable
                            style={cssStyle.primaryButton}
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
                            <ThemedText style={cssStyle.buttonText}>Add Item</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
