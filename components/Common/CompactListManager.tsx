import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface CompactListManagerProps<T> {
    title: string;
    data: T[];
    renderItem: ({ item }: { item: T }) => React.ReactElement;
    keyExtractor: (item: T) => string;
    onAddPress: () => void;
    addButtonText?: string;
    emptyStateText: string;
    showAddButton?: boolean;
}

export function CompactListManager<T>({
    title,
    data,
    renderItem,
    keyExtractor,
    onAddPress,
    addButtonText = "Add",
    emptyStateText,
    showAddButton = true,
}: CompactListManagerProps<T>) {
    const cssStyle = useResponsiveStyles();

    return (
        <View style={[cssStyle.container, { padding: 8, marginVertical: 4 }]}>
            {/* Compact header with title and add button */}
            <View style={[cssStyle.row, { justifyContent: "space-between", alignItems: "center", marginBottom: 8 }]}>
                <ThemedText style={[cssStyle.sectionHeader, { fontSize: 16, marginBottom: 0 }]}>{title}</ThemedText>
                {showAddButton && (
                    <TouchableOpacity
                        style={[cssStyle.condensedButton, cssStyle.primaryColors, { paddingHorizontal: 12, paddingVertical: 6, minWidth: 60 }]}
                        onPress={onAddPress}
                    >
                        <FontAwesome name="plus" size={12} color="white" />
                        <ThemedText style={[cssStyle.primaryText, { fontSize: 12, marginLeft: 4 }]}>{addButtonText}</ThemedText>
                    </TouchableOpacity>
                )}
            </View>

            {/* List content */}
            {data.length === 0 ? (
                <ThemedView style={[cssStyle.lightContainer, { padding: 12, minHeight: 60 }]}>
                    <ThemedText style={[cssStyle.emptyStateText, { fontSize: 14 }]}>{emptyStateText}</ThemedText>
                </ThemedView>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={keyExtractor}
                    renderItem={({ item }) => <View style={{ padding: 8 }}>{renderItem({ item })}</View>}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}
