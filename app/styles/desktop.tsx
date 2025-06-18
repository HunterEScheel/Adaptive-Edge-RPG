/**
 * Desktop-optimized styles for the app.
 *
 * Based on phone.tsx but with larger sizes and spacing appropriate for desktop screens.
 * Use these styles throughout the app to avoid duplication and keep a consistent look.
 */
import { StyleSheet } from "react-native";
import { ResponsiveStyles } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStyles>({
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
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 12,
    },
    sectionItem: {
        flex: 1,
        width: "100%",
        height: 40,
    },
    attributeRowContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    attributeSectionContainer: {
        width: "40%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    attribute: {
        width: "100%",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    clickableStat: {
        backgroundColor: "#888",
        borderRadius: 16,
        padding: 20,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 24,
        paddingHorizontal: 16,
    },
});
