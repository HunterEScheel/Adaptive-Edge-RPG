import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, TouchableOpacity, View, Pressable } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface MiniListManagerProps<T> {
    title: string;
    data: T[];
    renderItem: ({ item }: { item: T }) => React.ReactElement;
    renderMiniItem?: ({ item }: { item: T }) => React.ReactElement;
    keyExtractor: (item: T) => string;
    onAddPress: () => void;
    emptyStateText: string;
    maxDisplayItems?: number;
}

export function MiniListManager<T>({ 
    title, 
    data, 
    renderItem,
    renderMiniItem,
    keyExtractor, 
    onAddPress, 
    emptyStateText,
    maxDisplayItems = 3
}: MiniListManagerProps<T>) {
    const cssStyle = useResponsiveStyles();
    const [modalVisible, setModalVisible] = useState(false);
    
    const displayData = data.slice(0, maxDisplayItems);
    const hasMore = data.length > maxDisplayItems;
    
    return (
        <>
            <View style={[cssStyle.container, { padding: 6, marginVertical: 2 }]}>
                {/* Ultra-compact header */}
                <View style={[cssStyle.row, { justifyContent: "space-between", alignItems: "center", marginBottom: 4 }]}>
                    <ThemedText style={[cssStyle.label, { fontSize: 12, fontWeight: "600" }]}>
                        {title} ({data.length})
                    </ThemedText>
                    <View style={[cssStyle.row, { gap: 4 }]}>
                        <TouchableOpacity 
                            style={[
                                cssStyle.condensedButton, 
                                cssStyle.primaryColors,
                                { padding: 4, minWidth: 24, height: 24 }
                            ]} 
                            onPress={onAddPress}
                        >
                            <FontAwesome name="plus" size={10} color="white" />
                        </TouchableOpacity>
                        {data.length > 0 && (
                            <TouchableOpacity 
                                style={[
                                    cssStyle.condensedButton, 
                                    cssStyle.secondaryColors,
                                    { padding: 4, minWidth: 24, height: 24 }
                                ]} 
                                onPress={() => setModalVisible(true)}
                            >
                                <FontAwesome name="expand" size={10} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Mini list content */}
                {data.length === 0 ? (
                    <ThemedText style={[cssStyle.hint, { fontSize: 11, fontStyle: "italic" }]}>
                        {emptyStateText}
                    </ThemedText>
                ) : (
                    <View>
                        {displayData.map((item, index) => (
                            <View key={keyExtractor(item)} style={{ marginVertical: 1 }}>
                                {renderMiniItem ? renderMiniItem({ item }) : (
                                    <ThemedText style={{ fontSize: 11 }} numberOfLines={1}>
                                        • Item {index + 1}
                                    </ThemedText>
                                )}
                            </View>
                        ))}
                        {hasMore && (
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <ThemedText style={[cssStyle.hint, { fontSize: 10, marginTop: 2 }]}>
                                    +{data.length - maxDisplayItems} more...
                                </ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            {/* Full view modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={cssStyle.modalOverlay}>
                    <View style={[cssStyle.modalView, { maxHeight: "80%" }]}>
                        <View style={cssStyle.modalHeader}>
                            <ThemedText style={cssStyle.modalTitle}>{title}</ThemedText>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <FontAwesome name="times" size={20} color="#333" />
                            </Pressable>
                        </View>
                        
                        <View style={cssStyle.modalContent}>
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
                        </View>
                        
                        <View style={cssStyle.modalButtons}>
                            <TouchableOpacity 
                                style={[cssStyle.defaultButton, cssStyle.primaryColors]} 
                                onPress={() => {
                                    setModalVisible(false);
                                    onAddPress();
                                }}
                            >
                                <FontAwesome name="plus" size={16} color="white" />
                                <ThemedText style={cssStyle.primaryText}>Add New</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}