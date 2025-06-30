import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
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

export function ListManagerDesktop<T>({ 
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
    
    return (
        <View style={[cssStyle.container, { padding: 24, marginVertical: 16 }]}>
            {/* Header with title and description */}
            <View style={[cssStyle.sectionContainer, cssStyle.row, { justifyContent: "space-between", marginBottom: 20 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedText style={[cssStyle.sectionTitle, { fontSize: 24, marginBottom: 4 }]}>{title}</ThemedText>
                    {description && <ThemedText style={[cssStyle.hint, { fontSize: 16 }]}>{description}</ThemedText>}
                </View>
                {showAddButton && (
                    <TouchableOpacity 
                        style={[cssStyle.primaryButton, { paddingHorizontal: 24, paddingVertical: 12 }]} 
                        onPress={onAddPress}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesome name="plus" size={16} color="white" style={{ marginRight: 8 }} />
                            <ThemedText style={[cssStyle.buttonText, { fontSize: 16, color: "white" }]}>
                                {addButtonText}
                            </ThemedText>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {/* List content */}
            {data.length === 0 ? (
                <ThemedView style={[cssStyle.emptyState, { padding: 48, minHeight: 200 }]}>
                    <ThemedText style={[cssStyle.emptyStateText, { fontSize: 18, textAlign: "center" }]}>
                        {emptyStateText}
                    </ThemedText>
                </ThemedView>
            ) : (
                <FlatList 
                    data={data} 
                    renderItem={renderItem} 
                    keyExtractor={keyExtractor} 
                    style={cssStyle.list}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}