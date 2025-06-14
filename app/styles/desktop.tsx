import { StyleSheet } from "react-native";
import { app_theme } from "./theme";

export const cssStyle = StyleSheet.create({
    buttonPrimary: {
        color: app_theme.primary_component_text,
        backgroundColor: app_theme.primary_component_bg,
        borderRadius: 8,
        padding: 10,
    },
    buttonSeconry: {
        color: app_theme.secondary_comonent_text,
        backgroundColor: app_theme.secondary_component_bg,
        borderRadius: 8,
        padding: 10,
    },
    buttonRounded: {
        color: app_theme.primary_component_text,
        backgroundColor: app_theme.primary_component_bg,
        borderRadius: 50,
        padding: 10,
    },
    attributeWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 4,
    },
});
