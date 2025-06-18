/**
 * Tablet-optimized styles for the app.
 *
 * Based on phone.tsx but with medium sizes and spacing appropriate for tablet screens.
 * Use these styles throughout the app to avoid duplication and keep a consistent look.
 */
import { StyleSheet } from "react-native";
import { ResponsiveStyles } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStyles>({
    attributeRowContainer: {
        width: "50%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
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
    sectionContainer: {
        backgroundColor: "#fafafa",
        borderRadius: 12,
        padding: 20,
        marginVertical: 12,
        maxWidth: "40%",
    },
    sectionHeaderContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionItem: {
        flex: 1,
        width: "100%",
        height: 40,
    },
    attributeSectionContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    attribute: {
        width: "30%",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    clickableStat: {
        backgroundColor: "#888",
        borderRadius: 14,
        padding: 18,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
    },
});
