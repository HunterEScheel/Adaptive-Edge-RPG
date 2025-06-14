/**
 * Centralized, generic styles for the app.
 *
 * Use these styles throughout the app to avoid duplication and keep a consistent look.
 * Only add new styles here if they are likely to be reused in multiple places.
 * For component-specific tweaks, use inline styles or extend these base styles.
 */
import { StyleSheet } from "react-native";
import { app_theme } from "./theme";

export const cssStyle = StyleSheet.create({
    // BUTTONS - Consolidated and theme-consistent
    primaryButton: {
        color: app_theme.primary_component_text,
        backgroundColor: app_theme.primary_component_bg,
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    secondaryButton: {
        color: app_theme.secondary_component_text,
        backgroundColor: app_theme.secondary_component_bg,
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    actionButton: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    dangerButton: {
        backgroundColor: "#e74c3c",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    successButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    compactButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    smallButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },

    // CONTAINERS & LAYOUT - Unified
    container: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        marginVertical: 8,
    },
    card: {
        padding: 16,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },

    // MODALS
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: "#8E8E93",
    },
    saveButton: {
        backgroundColor: "#007AFF",
    },

    // TEXT STYLES - Simplified hierarchy
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    bodyText: {
        fontSize: 14,
        lineHeight: 20,
    },
    smallText: {
        fontSize: 12,
        color: "#666",
    },
    valueText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    largeValue: {
        fontSize: 24,
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        fontStyle: "italic",
        color: "#666",
        padding: 20,
    },

    // LAYOUT UTILITIES
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    spaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    centered: {
        alignItems: "center",
        justifyContent: "center",
    },

    // INPUT STYLES
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },

    // ITEM STYLES - Generic for skills, spells, items, etc.
    itemContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    levelBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 60,
        justifyContent: "center",
    },

    // STAT DISPLAY
    statContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 80,
    },
    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    bonusIndicator: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 4,
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    bonusText: {
        fontSize: 10,
        color: "#4CAF50",
        fontWeight: "bold",
    },

    // ADJUSTMENT CONTROLS
    adjustmentRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20,
        gap: 8,
    },
    adjustmentButtons: {
        flexDirection: "row",
        gap: 8,
    },

    // COMBAT ABILITY STYLES
    abilityItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    abilityHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    abilityName: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
    },
    abilityDescription: {
        marginBottom: 10,
        color: "#333",
    },
    abilityFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.05)",
        paddingTop: 8,
    },
    costText: {
        fontSize: 12,
        color: "#666",
    },
    costLabel: {
        fontWeight: "bold",
    },
    passiveTag: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4CAF50",
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderRadius: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
    },
    activeTab: {
        borderBottomColor: "#007AFF",
    },
    tabText: {
        fontSize: 16,
        color: "rgba(0, 0, 0, 0.6)",
    },
    activeTabText: {
        fontWeight: "bold",
        color: "#007AFF",
    },
    emptyState: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 5,
        minHeight: 150,
    },
    emptyStateText: {
        textAlign: "center",
        color: "#666",
        fontSize: 14,
    },
    list: {
        flex: 1,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: "#F44336",
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 8,
    },
    addButton: {
        backgroundColor: "#007AFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginTop: 15,
    },

    // SKILL-SPECIFIC STYLES
    skillItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    skillHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    skillNameContainer: {
        flex: 1,
        marginRight: 10,
    },
    skillName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    skillDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    levelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    levelButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007AFF",
    },
    decreaseButton: {
        backgroundColor: "#FF3B30",
    },
    increaseButton: {
        backgroundColor: "#34C759",
    },
    levelButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    levelDisplay: {
        minWidth: 40,
        alignItems: "center",
    },
    levelValue: {
        fontSize: 16,
        fontWeight: "bold",
    },
    skillsList: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    costInfoContainer: {
        alignItems: "flex-end",
    },
    costInfo: {
        fontSize: 12,
        color: "#666",
        textAlign: "right",
    },

    // STATUS INDICATORS
    onlineIndicator: {
        fontSize: 12,
        color: "#34C759",
        fontWeight: "bold",
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: "rgba(52, 199, 89, 0.1)",
        borderRadius: 4,
    },
    offlineIndicator: {
        fontSize: 12,
        color: "#FF3B30",
        fontWeight: "bold",
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: "rgba(255, 59, 48, 0.1)",
        borderRadius: 4,
    },
    inputIndicator: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: [{ translateY: -10 }],
    },

    // SUGGESTIONS STYLES
    suggestionsTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    suggestionsScrollView: {
        maxHeight: 150,
    },
    similarityText: {
        fontSize: 12,
        color: "#666",
        fontStyle: "italic",
    },
    suggestionsContainer: {
        marginTop: 8,
        backgroundColor: "#F8F9FA",
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        maxHeight: 200,
    },
    suggestionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E1E1",
    },

    // FORM STYLES
    formGroup: {
        width: "100%",
        marginBottom: 15,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    formRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    formContent: {
        width: "100%",
        padding: 15,
        flexGrow: 1,
    },
    formContentContainer: {
        flexGrow: 1,
        paddingBottom: 10,
    },

    // DROPDOWN STYLES
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

    // STATUS INDICATORS
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },

    // THEMED TEXT COMPATIBILITY (minimal)
    themedTextDefault: {
        fontSize: 16,
        lineHeight: 24,
    },
    themedTextTitle: {
        fontSize: 32,
        fontWeight: "bold",
        lineHeight: 32,
    },
    themedTextLink: {
        lineHeight: 30,
        fontSize: 16,
        color: "#0a7ea4",
    },

    // COMPONENT-SPECIFIC (only when truly unique)
    parallaxContainer: {
        flex: 1,
    },
    parallaxHeader: {
        overflow: "hidden",
    },
    parallaxContent: {
        flex: 1,
        padding: 32,
        gap: 16,
    },
    relationshipScale: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    relationshipDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    activeDot: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: "#333",
    },
    noteCard: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderLeftWidth: 4,
        borderLeftColor: "#4CAF50",
    },

    // LEGACY COMPATIBILITY (minimal)
    attributeRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 4,
    },
    detailItem: {
        flexDirection: "row",
        marginBottom: 2,
    },

    // COMBAT SCREEN SPECIFIC STYLES
    headerImage: {
        alignSelf: "center",
        marginBottom: 16,
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    sectionContainer: {
        marginVertical: 10,
        padding: 16,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    defensiveSkillsContainer: {
        marginVertical: 10,
    },
    compactSkillRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    skillInfo: {
        flex: 1,
        marginRight: 10,
    },
    skillPenalty: {
        fontSize: 12,
        color: "#666",
        fontStyle: "italic",
        marginTop: 2,
    },
    skillControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    skillLevel: {
        fontSize: 16,
        fontWeight: "bold",
        minWidth: 30,
        textAlign: "center",
    },
    tableContainer: {
        marginVertical: 10,
    },
    table: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 8,
    },
    tableHeader: {
        backgroundColor: "#f0f0f0",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        height: 40,
    },
    tableHeaderText: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    tableRow: {
        height: 40,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    tableRowText: {
        fontSize: 12,
        textAlign: "center",
        color: "#333",
    },

    // MODAL SPECIFIC STYLES
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
    },
    modalButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },

    // COMBAT SPECIFIC STYLES
    costContainer: {
        flex: 1,
    },
    useButton: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    useButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },

    // WEAPON SKILL MANAGER STYLES
    pointsSpent: {
        fontSize: 14,
        color: "#666",
        textAlign: "right",
    },

    // STAT UPGRADER STYLES
    upgradeControls: {
        flex: 1,
        alignItems: "center",
        marginLeft: 20,
    },
    adjustRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 15,
    },
    decrementButtons: {
        flexDirection: "row",
        gap: 8,
    },
    incrementButtons: {
        flexDirection: "row",
        gap: 8,
    },
    currentValueContainer: {
        alignItems: "center",
        minWidth: 80,
    },
    currentValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        fontWeight: "600",
        marginBottom: 4,
    },
    quickButton: {
        backgroundColor: "#007AFF",
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    decrementButton: {
        backgroundColor: "#FF3B30",
    },
    divider: {
        height: 1,
        backgroundColor: "#E1E1E1",
        width: "100%",
        marginVertical: 10,
    },
});
