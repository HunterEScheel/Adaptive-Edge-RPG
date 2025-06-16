import { TextStyle, ViewStyle } from "react-native";

export const app_theme = {
    primary_component_bg: "#5A3",
    secondary_component_bg: "#821",
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
}

// Comprehensive type definition for responsive stylesheets
// This ensures all device stylesheets (phone.tsx, tablet.tsx, desktop.tsx) have consistent properties
export interface ConsistentStyles {
    // BUTTONS
    defaultButton: ViewStyle;
    condensedButton: ViewStyle;
    disabledButton: ViewStyle;
    clickableStat: ViewStyle;

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

    //Containers
    row: ViewStyle;

    //Modals
    modal: ViewStyle;
    modalContent: ViewStyle;

    //Inputs
    input: TextStyle;
    inputContainer: ViewStyle;
}
