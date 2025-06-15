import { ImageStyle, TextStyle, ViewStyle } from "react-native";

export const app_theme = {
    primary_component_bg: "#35F",
    secondary_component_bg: "#5F3",
    primary_component_text: "#AAF",
    secondary_component_text: "#AAF",
};

// Comprehensive type definition for responsive stylesheets
// This ensures all device stylesheets (phone.tsx, tablet.tsx, desktop.tsx) have consistent properties
export interface ResponsiveStylesheet {
    // BUTTONS
    button: ViewStyle;
    primaryButton: ViewStyle;
    secondaryButton: ViewStyle;
    actionButton: ViewStyle;
    dangerButton: ViewStyle;
    successButton: ViewStyle;
    disabledButton: ViewStyle;
    compactButton: ViewStyle;
    levelButton: ViewStyle;
    buttonText: TextStyle;
    smallButtonText: TextStyle;

    // CONTAINERS
    lightContainer: ViewStyle;
    whiteContainer: ViewStyle;
    container: ViewStyle;
    card: ViewStyle;
    itemContainer: ViewStyle;

    // MODALS
    modalOverlay: ViewStyle;
    modalView: ViewStyle;
    modalHeader: ViewStyle;
    modalButtons: ViewStyle;
    modalTitle: TextStyle;

    // TEXT STYLES
    headerText: TextStyle;
    sectionHeader: TextStyle;
    sectionTitle: TextStyle;
    title: TextStyle;
    subtitle: TextStyle;
    label: TextStyle;
    bodyText: TextStyle;
    smallText: TextStyle;
    skillPenalty: TextStyle;
    valueText: TextStyle;
    largeValue: TextStyle;
    emptyText: TextStyle;

    // LAYOUT UTILITIES
    row: ViewStyle;
    headerRow: ViewStyle;
    centered: ViewStyle;
    buttonGroup: ViewStyle;

    // INPUT STYLES
    inputContainer: ViewStyle;
    input: TextStyle;
    textArea: TextStyle;

    // SPECIFIC COMPONENT STYLES
    levelBadge: ViewStyle;
    bonusContainer: ViewStyle;
    bonusIndicator: TextStyle;
    bonusText: TextStyle;
    divider: ViewStyle;

    // COMBAT ABILITY STYLES
    abilityItem: ViewStyle;
    abilityName: TextStyle;
    abilityDescription: TextStyle;
    abilityFooter: ViewStyle;
    costText: TextStyle;
    costLabel: TextStyle;
    passiveTag: TextStyle;
    tabButton: ViewStyle;
    activeTab: ViewStyle;
    tabText: TextStyle;
    activeTabText: TextStyle;
    emptyState: ViewStyle;
    emptyStateText: TextStyle;
    list: ViewStyle;

    // SKILL-SPECIFIC STYLES
    skillContainer: ViewStyle;
    sectionContainer: ViewStyle;
    defensiveSkillsContainer: ViewStyle;
    compactSkillRow: ViewStyle;
    skillInfo: ViewStyle;
    skillControls: ViewStyle;
    tableContainer: ViewStyle;
    table: ViewStyle;
    tableHeader: ViewStyle;
    tableHeaderText: TextStyle;
    tableRow: ViewStyle;
    tableRowText: TextStyle;
    costContainer: ViewStyle;
    upgradeControls: ViewStyle;
    adjustmentRow: ViewStyle;
    currentValueContainer: ViewStyle;
    currentValue: TextStyle;
    statLabel: TextStyle;
    skillItem: ViewStyle;
    skillNameContainer: ViewStyle;
    skillName: TextStyle;
    skillDescription: TextStyle;
    levelContainer: ViewStyle;
    levelDisplay: ViewStyle;
    skillsList: ViewStyle;
    costInfoContainer: ViewStyle;

    // STATUS INDICATORS
    statusIndicator: TextStyle;
    onlineIndicator: TextStyle;
    offlineIndicator: TextStyle;
    inputIndicator: ViewStyle;

    // SUGGESTIONS STYLES
    suggestionsTitle: TextStyle;
    suggestionsScrollView: ViewStyle;
    suggestionsContainer: ViewStyle;
    suggestionItem: ViewStyle;

    // FORM STYLES
    formGroup: ViewStyle;
    formRow: ViewStyle;
    formContent: ViewStyle;
    formContentContainer: ViewStyle;

    // DROPDOWN STYLES
    dropdown: ViewStyle;
    placeholderStyle: TextStyle;
    selectedTextStyle: TextStyle;
    iconStyle: ImageStyle;

    // THEMED TEXT COMPATIBILITY
    themedTextDefault: TextStyle;
    themedTextTitle: TextStyle;
    themedTextLink: TextStyle;

    // COMPONENT-SPECIFIC (unique patterns)
    parallaxContainer: ViewStyle;
    parallaxHeader: ViewStyle;
    parallaxContent: ViewStyle;
    relationshipScale: ViewStyle;
    relationshipDot: ViewStyle;
    activeDot: ViewStyle;
    noteCard: ViewStyle;
    headerImage: ViewStyle;

    // LEGACY COMPATIBILITY
    attributeRow: ViewStyle;
    detailItem: ViewStyle;
    itemHeader: ViewStyle;
    statContainer: ViewStyle;
}
