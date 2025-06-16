import { cssStyle } from "@/app/styles/responsive";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface ListManagerProps<T> {
    title: string;
    description: string;
    data: T[];
    renderItem: ({ item }: { item: T }) => React.ReactElement;
    keyExtractor: (item: T) => string;
    onAddPress: () => void;
    addButtonText: string;
    emptyStateText: string;
}

export function ListManager<T>({ title, description, data, renderItem, keyExtractor, onAddPress, addButtonText, emptyStateText }: ListManagerProps<T>) {
    return (
        <View style={[cssStyle.container]}>
            {/* Header with title and description */}
            <View style={[cssStyle.sectionContainer, cssStyle.row, { justifyContent: "space-between" }]}>
                <ThemedText style={cssStyle.sectionTitle}>{title}</ThemedText>
                <ThemedText style={cssStyle.hint}>{description}</ThemedText>
            </View>

            {/* List content */}
            {data.length === 0 ? (
                <ThemedView style={cssStyle.emptyState}>
                    <ThemedText style={cssStyle.emptyStateText}>{emptyStateText}</ThemedText>
                </ThemedView>
            ) : (
                <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} style={cssStyle.list} />
            )}

            {/* Add button */}
            <TouchableOpacity style={[cssStyle.defaultButton, cssStyle.primaryColors]} onPress={onAddPress}>
                <FontAwesome name="plus" size={16} color="white" />
                <ThemedText style={cssStyle.primaryText}>{addButtonText}</ThemedText>
            </TouchableOpacity>
        </View>
    );
}
