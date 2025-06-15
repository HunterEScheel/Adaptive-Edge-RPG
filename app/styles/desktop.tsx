/**
 * Desktop-optimized styles for the app.
 *
 * Based on phone.tsx but with larger sizes and spacing appropriate for desktop screens.
 * Use these styles throughout the app to avoid duplication and keep a consistent look.
 */
import { StyleSheet } from "react-native";
import { ResponsiveStylesheet, app_theme } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStylesheet>({
    // BUTTONS - Desktop-optimized with larger touch targets
    defaultButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
    },
    condensedButton: {
        borderRadius: 28,
        padding: 12,
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        backgroundColor: "#c0c0c0",
    },

    // Color themes
    primaryColors: {
        backgroundColor: app_theme.primary_component_bg,
    },
    secondaryColors: {
        backgroundColor: app_theme.secondary_component_bg,
    },
    containerColors: {
        backgroundColor: "#fafafa",
    },
    disabledColors: {
        backgroundColor: "#c0c0c0",
    },

    // Text Styles - Larger for desktop viewing
    defaultBold: {
        fontWeight: "600",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "#444",
    },
    description: {
        fontSize: 18,
        color: "#666",
        lineHeight: 28,
    },
    hint: {
        fontSize: 16,
        color: "#888",
        fontStyle: "italic",
    },
    primaryText: {
        color: app_theme.primary_component_text,
    },
    secondaryText: {
        color: app_theme.secondary_component_text,
    },

    //Containers - Maximum spacing for desktop
    container: {
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        display: "flex",
    },
    sectionContainer: {
        backgroundColor: "#fafafa",
        borderRadius: 12,
        padding: 20,
        marginVertical: 12,
        maxWidth: "40%",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 28,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    //Modals - Centered with max width
    modal: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 40,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 32,
        maxWidth: 800,
        alignSelf: "center",
        width: "100%",
    },

    //Inputs - Larger for mouse precision
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 18,
        backgroundColor: "#fff",
    },
    inputText: {
        fontSize: 18,
    },
    inputContainer: {
        marginBottom: 24,
    },
});
