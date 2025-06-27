/**
 * Tablet-optimized styles for the app.
 *
 * Based on phone.tsx but with medium sizes and spacing appropriate for tablet screens.
 * Use these styles throughout the app to avoid duplication and keep a consistent look.
 */
import { StyleSheet } from "react-native";
import { ConsistentStyles, app_theme } from "./theme";

export const cssStyle = StyleSheet.create<ConsistentStyles>({
    defaultButton: {
        borderRadius: 10,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    condensedButton: {
        borderRadius: 50,
        padding: 8,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    primaryButton: {
        backgroundColor: app_theme.primary_component_bg,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 100,
    },
    secondaryButton: {
        backgroundColor: app_theme.secondary_component_bg,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 100,
    },

    // Text for buttons
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    smallButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
    },
    secondaryButtonText: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "600",
    },

    // Color themes
    primaryColors: {
        backgroundColor: app_theme.primary_component_bg,
    },
    secondaryColors: {
        backgroundColor: app_theme.secondary_component_bg,
    },
    containerColors: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    disabledColors: {
        backgroundColor: "#ccc",
    },

    // Text Styles
    defaultBold: {
        fontWeight: "bold",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    description: {
        fontSize: 16,
    },
    hint: {
        fontSize: 14,
        fontStyle: "italic",
    },
    primaryText: {
        color: app_theme.primary_component_text,
    },
    secondaryText: {
        color: app_theme.secondary_component_text,
    },
    smallText: {
        fontSize: 12,
        color: "#666",
    },
    valueText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    largeValue: {
        fontSize: 32,
        fontWeight: "bold",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },

    //Containers
    container: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        display: "flex",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 16,
    },
    adjustmentRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 12,
        paddingHorizontal: 20,
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },

    //Modals
    modal: {
        flex: 1,
    },
    modalFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.1)",
    },
    modalCloseButton: {
        padding: 8,
        marginLeft: 12,
        borderRadius: 8,
    },

    //Inputs
    input: {
        borderWidth: 1,
        borderColor: "#c0c0c0",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
    },
    inputContainer: {
        marginBottom: 12,
    },

    // Misc UI elements
    bonusIndicator: {
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
    },
    bonusText: {
        color: "#4CAF50",
        fontSize: 12,
        fontWeight: "600",
    },

    // Component-specific buttons
    saveButton: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: app_theme.primary_component_bg,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    compactSaveButton: {
        backgroundColor: app_theme.primary_component_bg,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    tabButton: {
        flex: 1,
        padding: 10,
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },

    // Lists and content containers
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    flatList: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
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

    // Form elements
    formContent: {
        padding: 20,
    },
    formContentContainer: {
        flex: 1,
    },
    formGroup: {
        marginBottom: 16,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#c0c0c0",
        borderRadius: 12,
        backgroundColor: "#fff",
        minHeight: 50,
        minWidth: 200,
    },
    inputIndicator: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: [{ translateY: -8 }],
    },
    textArea: {
        borderWidth: 1,
        borderColor: "#c0c0c0",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
        minHeight: 100,
        textAlignVertical: "top",
    },
    checkboxIcon: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: "#c0c0c0",
        borderRadius: 4,
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    // Layout elements
    divider: {
        height: 1,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        marginVertical: 16,
    },
    parallaxContainer: {
        flex: 1,
    },
    parallaxContent: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: "hidden",
    },
    parallaxHeader: {
        backgroundColor: app_theme.primary_component_bg,
        padding: 20,
    },
    fullWidth: {
        width: "100%",
    },
    halfWidth: {
        width: "48%",
    },

    // UI state and feedback
    activeTab: {
        borderBottomColor: app_theme.primary_component_bg,
    },
    activeDot: {
        backgroundColor: app_theme.primary_component_bg,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    noteCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    onlineIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#4CAF50",
    },
    offlineIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#f44336",
    },
    badge: {
        backgroundColor: app_theme.secondary_component_bg,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 8,
    },

    // Specific component containers
    levelContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    levelDisplay: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
        padding: 8,
        marginLeft: 8,
    },
    costContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 8,
    },
    costInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    currentValueContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
    },
    lightContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
        padding: 16,
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 16,
    },
    suggestionsContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    suggestionsScrollView: {
        maxHeight: 200,
    },
    relationshipScale: {
        height: 4,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        marginVertical: 8,
    },
    relationshipDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: app_theme.primary_component_bg,
        position: "absolute",
        top: -6,
    },

    // Additional text styles
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    activeTabText: {
        color: app_theme.primary_component_bg,
        fontWeight: "600",
    },
    tabText: {
        fontSize: 14,
        color: "#666",
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 6,
        color: "#333",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    costText: {
        fontSize: 14,
        color: app_theme.secondary_component_bg,
        fontWeight: "600",
    },
    costLabel: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },
    currentValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: app_theme.primary_component_bg,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        fontStyle: "italic",
    },
    emptyStateText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 8,
    },
    themedTextDefault: {
        fontSize: 16,
        color: "#000",
    },
    themedTextLink: {
        fontSize: 16,
        color: app_theme.primary_component_bg,
        textDecorationLine: "underline",
    },

    // Ability/skill related
    abilityItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    abilityFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.1)",
    },
    abilityName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    abilityDescription: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    skillItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    skillName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    skillDescription: {
        fontSize: 14,
        color: "#666",
    },
    skillNameContainer: {
        flex: 1,
    },
    passiveTag: {
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 8,
    },

    // Additional form and UI elements
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
    },
    checkboxText: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    placeholderStyle: {
        fontSize: 16,
        color: "#999",
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "#333",
    },
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },
    suggestionItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    iconStyle: {
        width: 24,
        height: 24,
    },

    // Header stat display
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        borderRadius: 8,
        marginTop: 8,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    statLabelSmall: {
        fontSize: 10,
        color: "#666",
        marginTop: 2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    compactStatContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
