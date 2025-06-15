/**
 * Tablet-optimized styles for the app.
 *
 * Based on phone.tsx but with medium sizes and spacing appropriate for tablet screens.
 * Use these styles throughout the app to avoid duplication and keep a consistent look.
 */
import { StyleSheet } from "react-native";
import { ResponsiveStylesheet, app_theme } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStylesheet>({
    // BUTTONS - Slightly larger for tablet touch targets
    defaultButton: {
        borderRadius: 10,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    condensedButton: {
        borderRadius: 50,
        padding: 15,
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
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

    //Containers
    container: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        display: "flex",
    },
    sectionContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 20,
        marginVertical: 12,
        maxWidth: "40%",
    },
    card: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    //Modals
    modal: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
    },
    modalContent: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
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
});
