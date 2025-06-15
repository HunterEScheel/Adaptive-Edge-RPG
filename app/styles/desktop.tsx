/**
 * Desktop-optimized styles for the app.
 *
 * Based on phone.tsx but with larger sizes and spacing appropriate for desktop screens.
 * Use these styles throughout the app to avoid duplication and keep a consistent look.
 */
import { StyleSheet } from "react-native";
import { app_theme, ResponsiveStylesheet } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStylesheet>({
    // BUTTONS - Desktop-optimized sizes
    button: {
        borderRadius: 6,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButton: {
        backgroundColor: app_theme.primary_component_bg,
    },
    secondaryButton: {
        backgroundColor: app_theme.secondary_component_bg,
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    centered: {
        width: 44,
        height: 44,
        borderRadius: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 18,
        padding: 7,
    },
    smallButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },

    // CONTAINERS - Desktop-optimized
    lightContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    whiteContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    container: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 20,
        marginVertical: 12,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    itemContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },

    // MODALS
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 28,
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
        marginBottom: 28,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 28,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

    // TEXT STYLES - Desktop-optimized
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 14,
        color: "#333",
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 14,
        color: "#333",
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 14,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    bodyText: {
        fontSize: 18,
        lineHeight: 24,
    },
    smallText: {
        fontSize: 14,
        color: "#666",
    },
    skillPenalty: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        marginTop: 2,
    },
    valueText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    largeValue: {
        fontSize: 28,
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        fontStyle: "italic",
        color: "#666",
        padding: 28,
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
    buttonGroup: {
        flexDirection: "row",
        gap: 12,
    },

    // INPUT STYLES
    inputContainer: {
        width: "100%",
        marginBottom: 18,
    },
    input: {
        borderColor: "#c0c0c0",
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        backgroundColor: "#fff",
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },

    // SPECIFIC COMPONENT STYLES
    levelBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minWidth: 75,
        justifyContent: "center",
    },
    bonusContainer: {
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderRadius: 12,
        padding: 10,
        marginTop: 8,
    },
    bonusIndicator: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 8,
        marginTop: 8,
    },
    bonusText: {
        color: "#4CAF50",
        fontSize: 14,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 14,
    },

    // COMBAT ABILITY STYLES
    abilityItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    abilityName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    abilityDescription: {
        fontSize: 16,
        color: "#666",
        marginTop: 4,
    },
    abilityFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.1)",
        paddingTop: 12,
    },
    costText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "600",
    },
    costLabel: {
        fontSize: 13,
        color: "#999",
        marginBottom: 2,
    },
    passiveTag: {
        fontSize: 12,
        color: "#007AFF",
        fontWeight: "bold",
        backgroundColor: "rgba(0, 122, 255, 0.1)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        overflow: "hidden",
    },
    tabButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 18,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
    activeTab: {
        backgroundColor: "#007AFF",
    },
    tabText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666",
    },
    activeTabText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    emptyState: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
    },
    emptyStateText: {
        fontSize: 18,
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
        borderRadius: 12,
        padding: 18,
        marginVertical: 10,
    },
    sectionContainer: {
        marginVertical: 14,
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
    },
    defensiveSkillsContainer: {
        marginVertical: 14,
    },
    compactSkillRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    skillInfo: {
        flex: 1,
        marginRight: 14,
    },
    skillControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    tableContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
        padding: 16,
        marginVertical: 12,
    },
    table: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
    },
    tableHeader: {
        backgroundColor: "#f0f0f0",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 14,
    },
    tableHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    tableRow: {
        height: 48,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    tableRowText: {
        fontSize: 15,
        textAlign: "center",
        color: "#333",
    },
    costContainer: {
        flex: 1,
    },
    upgradeControls: {
        flex: 1,
        alignItems: "center",
        marginLeft: 24,
    },
    adjustmentRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 28,
        gap: 12,
    },
    currentValueContainer: {
        alignItems: "center",
        minWidth: 100,
    },
    currentValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "600",
        marginBottom: 6,
    },
    skillItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,
    },
    skillNameContainer: {
        flex: 1,
        marginRight: 14,
    },
    skillName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    skillDescription: {
        fontSize: 16,
        color: "#666",
        marginTop: 4,
    },
    levelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    levelDisplay: {
        minWidth: 50,
        alignItems: "center",
    },
    skillsList: {
        paddingBottom: 24,
    },
    costInfoContainer: {
        alignItems: "flex-end",
    },

    // STATUS INDICATORS
    statusIndicator: {
        fontSize: 14,
        fontWeight: "bold",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    onlineIndicator: {
        fontSize: 14,
        color: "#34C759",
        fontWeight: "bold",
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: "rgba(52, 199, 89, 0.1)",
        borderRadius: 6,
    },
    offlineIndicator: {
        fontSize: 14,
        color: "#FF3B30",
        fontWeight: "bold",
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: "rgba(255, 59, 48, 0.1)",
        borderRadius: 6,
    },
    inputIndicator: {
        position: "absolute",
        right: 14,
        top: "50%",
        transform: [{ translateY: -14 }],
    },

    // SUGGESTIONS STYLES
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    suggestionsScrollView: {
        maxHeight: 200,
    },
    suggestionsContainer: {
        marginTop: 12,
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        maxHeight: 250,
    },
    suggestionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E1E1",
    },

    // FORM STYLES
    formGroup: {
        width: "100%",
        marginBottom: 20,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    formRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 28,
    },
    formContent: {
        width: "100%",
        padding: 20,
        flexGrow: 1,
    },
    formContentContainer: {
        flexGrow: 1,
        paddingBottom: 14,
    },

    // DROPDOWN STYLES
    dropdown: {
        height: 60,
        borderColor: "#c0c0c0",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: "#f9f9f9",
    },
    placeholderStyle: {
        fontSize: 18,
        color: "#888",
    },
    selectedTextStyle: {
        fontSize: 18,
        color: "#333",
    },
    iconStyle: {
        width: 24,
        height: 24,
    },

    // THEMED TEXT COMPATIBILITY
    themedTextDefault: {
        fontSize: 18,
        lineHeight: 28,
    },
    themedTextTitle: {
        fontSize: 36,
        fontWeight: "bold",
        lineHeight: 36,
    },
    themedTextLink: {
        lineHeight: 34,
        fontSize: 18,
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
        padding: 40,
        gap: 20,
    },
    relationshipScale: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    relationshipDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    activeDot: {
        width: 28,
        height: 28,
        borderWidth: 2,
        borderColor: "#333",
    },
    noteCard: {
        padding: 20,
        marginVertical: 12,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderLeftWidth: 4,
        borderLeftColor: "#4CAF50",
    },
    headerImage: {
        alignSelf: "center",
        marginBottom: 20,
    },

    // LEGACY COMPATIBILITY
    attributeRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 6,
    },
    detailItem: {
        flexDirection: "row",
        marginBottom: 4,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    statContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 80,
    },
});
