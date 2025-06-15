/**
 * Tablet-optimized styles for the app.
 *
 * Based on phone.tsx but with medium sizes and spacing appropriate for tablet screens.
 * Use these styles throughout the app to avoid duplication and keep a consistent look.
 */
import { StyleSheet } from "react-native";
import { app_theme, ResponsiveStylesheet } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStylesheet>({
    // BUTTONS - Tablet-optimized sizes
    button: {
        borderRadius: 10,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButton: {
        backgroundColor: app_theme.primary_component_bg,
    },
    secondaryButton: {
        backgroundColor: app_theme.secondary_component_bg,
    },
    actionButton: {
        backgroundColor: "#007AFF",
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    dangerButton: {
        backgroundColor: "#F44336",
    },
    successButton: {
        backgroundColor: "#4CAF50",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    compactButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    levelButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#007AFF",
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 17,
        padding: 6,
    },
    smallButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "bold",
    },

    // CONTAINERS
    lightContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },
    whiteContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
        padding: 18,
        marginBottom: 14,
    },
    container: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 10,
        padding: 18,
        marginVertical: 10,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
        padding: 18,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    itemContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },

    // MODALS
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 14,
        padding: 24,
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
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 18,
        textAlign: "center",
    },

    // TEXT STYLES
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 6,
        color: "#333",
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 22,
    },
    smallText: {
        fontSize: 13,
        color: "#666",
    },
    skillPenalty: {
        fontSize: 13,
        color: "#666",
        fontStyle: "italic",
        marginTop: 2,
    },
    valueText: {
        fontSize: 17,
        fontWeight: "bold",
    },
    largeValue: {
        fontSize: 26,
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        fontStyle: "italic",
        color: "#666",
        padding: 24,
    },

    // LAYOUT UTILITIES
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    centered: {
        alignItems: "center",
        justifyContent: "center",
    },
    buttonGroup: {
        flexDirection: "row",
        gap: 10,
    },

    // INPUT STYLES
    inputContainer: {
        width: "100%",
        marginBottom: 16,
    },
    input: {
        borderColor: "#c0c0c0",
        borderWidth: 1,
        borderRadius: 10,
        padding: 14,
        fontSize: 17,
        backgroundColor: "#fff",
    },
    textArea: {
        height: 110,
        textAlignVertical: "top",
    },

    // SPECIFIC COMPONENT STYLES
    levelBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 5,
        minWidth: 65,
        justifyContent: "center",
    },
    bonusContainer: {
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderRadius: 10,
        padding: 8,
        marginTop: 6,
    },
    bonusIndicator: {
        color: "#4CAF50",
        fontSize: 13,
        fontWeight: "bold",
    },
    bonusText: {
        color: "#4CAF50",
        fontSize: 13,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 12,
    },

    // COMBAT ABILITY STYLES
    abilityItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },
    abilityName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    abilityDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    abilityFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.1)",
        paddingTop: 10,
    },
    costText: {
        fontSize: 13,
        color: "#666",
        fontWeight: "600",
    },
    costLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 2,
    },
    passiveTag: {
        fontSize: 11,
        color: "#007AFF",
        fontWeight: "bold",
        backgroundColor: "rgba(0, 122, 255, 0.1)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: "hidden",
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
    activeTab: {
        backgroundColor: "#007AFF",
    },
    tabText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#666",
    },
    activeTabText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    emptyState: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 10,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 100,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#666",
        fontStyle: "italic",
        textAlign: "center",
    },
    list: {
        flex: 1,
    },

    // SKILL-SPECIFIC STYLES
    skillContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
    },
    sectionContainer: {
        marginVertical: 12,
        padding: 18,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 10,
    },
    defensiveSkillsContainer: {
        marginVertical: 12,
    },
    compactSkillRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },
    skillInfo: {
        flex: 1,
        marginRight: 12,
    },
    skillControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    tableContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
        padding: 14,
        marginVertical: 10,
    },
    table: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
    },
    tableHeader: {
        backgroundColor: "#f0f0f0",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 12,
    },
    tableHeaderText: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    tableRow: {
        height: 44,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    tableRowText: {
        fontSize: 13,
        textAlign: "center",
        color: "#333",
    },
    costContainer: {
        flex: 1,
    },
    upgradeControls: {
        flex: 1,
        alignItems: "center",
        marginLeft: 22,
    },
    adjustmentRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 24,
        gap: 10,
    },
    currentValueContainer: {
        alignItems: "center",
        minWidth: 90,
    },
    currentValue: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#333",
    },
    statLabel: {
        fontSize: 13,
        color: "#666",
        fontWeight: "600",
        marginBottom: 5,
    },
    skillItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
    },
    skillNameContainer: {
        flex: 1,
        marginRight: 12,
    },
    skillName: {
        fontSize: 17,
        fontWeight: "bold",
    },
    skillDescription: {
        fontSize: 15,
        color: "#666",
        marginTop: 4,
    },
    levelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    levelDisplay: {
        minWidth: 45,
        alignItems: "center",
    },
    skillsList: {
        paddingBottom: 22,
    },
    costInfoContainer: {
        alignItems: "flex-end",
    },

    // STATUS INDICATORS
    statusIndicator: {
        fontSize: 13,
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 5,
    },
    onlineIndicator: {
        fontSize: 13,
        color: "#34C759",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: "rgba(52, 199, 89, 0.1)",
        borderRadius: 5,
    },
    offlineIndicator: {
        fontSize: 13,
        color: "#FF3B30",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: "rgba(255, 59, 48, 0.1)",
        borderRadius: 5,
    },
    inputIndicator: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: [{ translateY: -12 }],
    },

    // SUGGESTIONS STYLES
    suggestionsTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    suggestionsScrollView: {
        maxHeight: 170,
    },
    suggestionsContainer: {
        marginTop: 10,
        backgroundColor: "#F8F9FA",
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        maxHeight: 220,
    },
    suggestionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E1E1",
    },

    // FORM STYLES
    formGroup: {
        width: "100%",
        marginBottom: 18,
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    formRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 24,
    },
    formContent: {
        width: "100%",
        padding: 18,
        flexGrow: 1,
    },
    formContentContainer: {
        flexGrow: 1,
        paddingBottom: 12,
    },

    // DROPDOWN STYLES
    dropdown: {
        height: 55,
        borderColor: "#c0c0c0",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        backgroundColor: "#f9f9f9",
    },
    placeholderStyle: {
        fontSize: 17,
        color: "#888",
    },
    selectedTextStyle: {
        fontSize: 17,
        color: "#333",
    },
    iconStyle: {
        width: 22,
        height: 22,
    },

    // THEMED TEXT COMPATIBILITY
    themedTextDefault: {
        fontSize: 17,
        lineHeight: 26,
    },
    themedTextTitle: {
        fontSize: 34,
        fontWeight: "bold",
        lineHeight: 34,
    },
    themedTextLink: {
        lineHeight: 32,
        fontSize: 17,
        color: "#0a7ea4",
    },

    // COMPONENT-SPECIFIC (unique patterns)
    parallaxContainer: {
        flex: 1,
    },
    parallaxHeader: {
        overflow: "hidden",
    },
    parallaxContent: {
        flex: 1,
        padding: 36,
        gap: 18,
    },
    relationshipScale: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    relationshipDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    activeDot: {
        width: 26,
        height: 26,
        borderWidth: 2,
        borderColor: "#333",
    },
    noteCard: {
        padding: 18,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderLeftWidth: 4,
        borderLeftColor: "#4CAF50",
    },
    headerImage: {
        alignSelf: "center",
        marginBottom: 18,
    },

    // LEGACY COMPATIBILITY
    attributeRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 5,
    },
    detailItem: {
        flexDirection: "row",
        marginBottom: 3,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    statContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 10,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 70,
    },
});
