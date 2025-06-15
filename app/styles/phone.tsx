import { StyleSheet } from "react-native";
import { ResponsiveStylesheet, app_theme } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStylesheet>({
    // BUTTONS
    defaultButton: {
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    condensedButton: {
        borderRadius: 20,
        padding: 8,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        backgroundColor: "#e0e0e0",
    },

    // Color themes
    primaryColors: {
        backgroundColor: app_theme.primary_component_bg,
    },
    secondaryColors: {
        backgroundColor: app_theme.secondary_component_bg,
    },
    containerColors: {
        backgroundColor: "#f5f5f5",
    },
    disabledColors: {
        backgroundColor: "#e0e0e0",
    },

    // Text Styles
    defaultBold: {
        fontWeight: "bold",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#444",
    },
    description: {
        fontSize: 14,
        color: "#666",
    },
    hint: {
        fontSize: 12,
        color: "#888",
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
        display: "flex",
        flex: 12,
        padding: 16,
    },
    sectionContainer: {
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        minWidth: "100%",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    //Modals
    modal: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 24,
    },

    //Inputs
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#fff",
    },
    inputContainer: {
        marginBottom: 16,
    },
});
