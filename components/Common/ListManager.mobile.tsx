import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface ListManagerProps<T> {
    title: string;
    description?: string;
    data: T[];
    renderItem: ({ item }: { item: T }) => React.ReactElement;
    keyExtractor: (item: T) => string;
    onAddPress: () => void;
    addButtonText?: string;
    emptyStateText: string;
    showAddButton?: boolean;
}

export function ListManagerMobile<T>({ 
    title, 
    description, 
    data, 
    renderItem, 
    keyExtractor, 
    onAddPress, 
    addButtonText = "Add", 
    emptyStateText,
    showAddButton = true 
}: ListManagerProps<T>) {
    const cssStyle = useResponsiveStyles();
    
    // Format title to include count for mobile
    const mobileTitle = description && description.includes('spell') 
        ? `${title} (${data.length})`
        : title;
    
    return (
        <View style={[cssStyle.container, { padding: 8, marginVertical: 4 }]}>
            {/* Compact header with title and add button */}
            <View style={[cssStyle.row, { justifyContent: "space-between", alignItems: "center", marginBottom: 8 }]}>
                <ThemedText style={[cssStyle.sectionHeader, { fontSize: 16, marginBottom: 0 }]}>{mobileTitle}</ThemedText>
                {showAddButton && (
                    <TouchableOpacity 
                        style={[
                            cssStyle.condensedButton, 
                            cssStyle.primaryColors,
                            { paddingHorizontal: 12, paddingVertical: 6, minWidth: 60 }
                        ]} 
                        onPress={onAddPress}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesome name="plus" size={12} color="white" />
                            <ThemedText style={[cssStyle.primaryText, { fontSize: 12, marginLeft: 4 }]}>
                                {addButtonText.replace(/^(Add|Learn)\s+/, '')}
                            </ThemedText>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {/* List content */}
            {data.length === 0 ? (
                <ThemedView style={[cssStyle.lightContainer, { padding: 12, minHeight: 60 }]}>
                    <ThemedText style={[cssStyle.emptyStateText, { fontSize: 14 }]}>{emptyStateText}</ThemedText>
                </ThemedView>
            ) : (
                <View style={[cssStyle.list, { maxHeight: 300 }]}>
                    {data.map((item) => (
                        <View key={keyExtractor(item)}>
                            {renderItem({ item })}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}