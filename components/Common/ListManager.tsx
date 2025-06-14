import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { cssStyle } from "@/app/styles/phone";

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

export function ListManager<T>({
  title,
  description,
  data,
  renderItem,
  keyExtractor,
  onAddPress,
  addButtonText,
  emptyStateText,
}: ListManagerProps<T>) {
  return (
    <View style={cssStyle.container}>
      {/* Header with title and description */}
      <View style={cssStyle.headerRow}>
        <ThemedText style={cssStyle.sectionTitle}>{title}</ThemedText>
        <ThemedText style={cssStyle.pointsSpent}>{description}</ThemedText>
      </View>

      {/* List content */}
      {data.length === 0 ? (
        <ThemedView style={cssStyle.emptyState}>
          <ThemedText style={cssStyle.emptyStateText}>{emptyStateText}</ThemedText>
        </ThemedView>
      ) : (
        <FlatList 
          data={data} 
          renderItem={renderItem} 
          keyExtractor={keyExtractor} 
          style={cssStyle.list} 
        />
      )}

      {/* Add button */}
      <Pressable style={cssStyle.addButton} onPress={onAddPress}>
        <FontAwesome name="plus" size={16} color="white" />
        <ThemedText style={cssStyle.addButtonText}>{addButtonText}</ThemedText>
      </Pressable>
    </View>
  );
}
