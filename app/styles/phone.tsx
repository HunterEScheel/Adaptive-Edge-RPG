import { StyleSheet } from "react-native";
import { ResponsiveStyles } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStyles>({
    attributeRowContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        maxWidth: "100%",
    },
    sectionHeaderContainer: {
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
    },
});
