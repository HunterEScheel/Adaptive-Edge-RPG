import { TextStyle, ViewStyle } from "react-native";

export const app_theme = {
    primary_component_bg: "#5A3",
    secondary_component_bg: "#821",
    primary_component_text: "#AAF",
    secondary_component_text: "#AAF",
};

// Comprehensive type definition for responsive stylesheets
// This ensures all device stylesheets (phone.tsx, tablet.tsx, desktop.tsx) have consistent properties
export interface ResponsiveStylesheet {
    // BUTTONS
    defaultButton: ViewStyle;
    condensedButton: ViewStyle;
    disabledButton: ViewStyle;

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
    sectionContainer: ViewStyle;
    container: ViewStyle;
    card: ViewStyle;
    row: ViewStyle;

    //Modals
    modal: ViewStyle;
    modalContent: ViewStyle;

    //Inputs
    input: TextStyle;
    inputContainer: ViewStyle;
}
