import { TextStyle, ViewStyle } from "react-native";

export const app_theme = {
    primary_component_bg: "#260",
    secondary_component_bg: "#600",
    primary_component_text: "#AAF",
    secondary_component_text: "#AAF",
};

export interface ResponsiveStyles {
    card: ViewStyle;
    sectionContainer: ViewStyle;
    sectionHeaderContainer: ViewStyle;
    sectionItem: ViewStyle;
    attributeSectionContainer: ViewStyle;
    attributeRowContainer: ViewStyle;
    attribute: ViewStyle;
    clickableStat: ViewStyle;
    headerContainer: ViewStyle;
}

// Comprehensive type definition for responsive stylesheets
// This ensures all device stylesheets (phone.tsx, tablet.tsx, desktop.tsx) have consistent properties
export interface ConsistentStyles {
    // BUTTONS
    defaultButton: ViewStyle;
    condensedButton: ViewStyle;
    disabledButton: ViewStyle;
    primaryButton: ViewStyle;
    secondaryButton: ViewStyle;

    // Text for buttons
    buttonText: TextStyle;
    smallButtonText: TextStyle;
    secondaryButtonText: TextStyle;

    // Color themes
    primaryColors: ViewStyle;
    secondaryColors: ViewStyle;
    containerColors: ViewStyle;
    disabledColors: ViewStyle;

    // Text Styles
    defaultBold: TextStyle;
    title: TextStyle;
    sectionTitle: TextStyle;
    subtitle: TextStyle;
    description: TextStyle;
    hint: TextStyle;
    primaryText: TextStyle;
    secondaryText: TextStyle;
    smallText: TextStyle;
    valueText: TextStyle;
    label: TextStyle;
    largeValue: TextStyle;
    modalTitle: TextStyle;

    //Containers
    row: ViewStyle;
    container: ViewStyle;
    centered: ViewStyle;
    headerRow: ViewStyle;
    adjustmentRow: ViewStyle;
    formRow: ViewStyle;

    //Modals
    modal: ViewStyle;
    modalContent: ViewStyle;
    modalView: ViewStyle;
    modalOverlay: ViewStyle;
    modalButtons: ViewStyle;
    modalHeader: ViewStyle;
    modalFooter: ViewStyle;
    modalCloseButton: ViewStyle;

    //Inputs
    input: TextStyle;
    inputContainer: ViewStyle;

    // Misc UI elements
    bonusIndicator: ViewStyle;
    bonusText: TextStyle;

    // Component-specific buttons
    saveButton: ViewStyle;
    compactSaveButton: ViewStyle;
    tabButton: ViewStyle;

    // Lists and content containers
    scrollContainer: ViewStyle;
    contentContainer: ViewStyle;
    flatList: ViewStyle;
    list: ViewStyle;
    itemContainer: ViewStyle;
    itemHeader: ViewStyle;

    // Form elements
    formContent: ViewStyle;
    formContentContainer: ViewStyle;
    formGroup: ViewStyle;
    checkboxContainer: ViewStyle;
    dropdown: ViewStyle;
    inputIndicator: ViewStyle;
    textArea: TextStyle;
    checkboxIcon: ViewStyle;

    // Layout elements
    divider: ViewStyle;
    parallaxContainer: ViewStyle;
    parallaxContent: ViewStyle;
    parallaxHeader: ViewStyle;
    fullWidth: ViewStyle;
    halfWidth: ViewStyle;

    // UI state and feedback
    activeTab: ViewStyle;
    activeDot: ViewStyle;
    emptyState: ViewStyle;
    noteCard: ViewStyle;
    onlineIndicator: ViewStyle;
    offlineIndicator: ViewStyle;
    badge: ViewStyle;

    // Specific component containers
    levelContainer: ViewStyle;
    levelDisplay: ViewStyle;
    costContainer: ViewStyle;
    costInfoContainer: ViewStyle;
    currentValueContainer: ViewStyle;
    lightContainer: ViewStyle;
    buttonGroup: ViewStyle;
    suggestionsContainer: ViewStyle;
    suggestionsScrollView: ViewStyle;
    relationshipScale: ViewStyle;
    relationshipDot: ViewStyle;

    // Additional text styles
    headerText: TextStyle;
    modalHeader: TextStyle;
    sectionHeader: TextStyle;
    sectionSubtitle: TextStyle;
    activeTabText: TextStyle;
    tabText: TextStyle;
    inputLabel: TextStyle;
    statLabel: TextStyle;
    costText: TextStyle;
    costLabel: TextStyle;
    currentValue: TextStyle;
    emptyText: TextStyle;
    emptyStateText: TextStyle;
    themedTextDefault: TextStyle;
    themedTextLink: TextStyle;

    // Ability/skill related
    abilityItem: ViewStyle;
    abilityFooter: ViewStyle;
    abilityName: TextStyle;
    abilityDescription: TextStyle;
    skillItem: ViewStyle;
    skillName: TextStyle;
    skillDescription: TextStyle;
    skillNameContainer: TextStyle;
    passiveTag: ViewStyle;

    // Additional form and UI elements
    bodyText: TextStyle;
    checkboxText: TextStyle;
    placeholderStyle: TextStyle;
    selectedTextStyle: TextStyle;
    suggestionsTitle: TextStyle;
    suggestionItem: ViewStyle;
    detailItem: ViewStyle;
    iconStyle: ViewStyle;
    
    // Header stat display
    statRow: ViewStyle;
    statItem: ViewStyle;
    statValue: TextStyle;
    statLabelSmall: TextStyle;
    compactStatContainer: ViewStyle;
}
