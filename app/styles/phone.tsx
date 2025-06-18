import { StyleSheet } from "react-native";
import { ResponsiveStyles } from "./theme";

export const cssStyle = StyleSheet.create<ResponsiveStyles>({
    attributeRowContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingHorizontal: 4,
        marginVertical: 2,
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
        borderRadius: 8,
        padding: 8,
        marginVertical: 4,
        maxWidth: "100%",
    },
    sectionHeaderContainer: {
        alignItems: "center",
        marginBottom: 4,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    sectionItem: {
        flex: 1,
        width: "100%",
        height: 40,
    },
    attributeSectionContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingVertical: 8,
    },
    attribute: {
        minWidth: 50,
        height: 50,
        paddingHorizontal: 8,
        paddingVertical: 4,
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    clickableStat: {
        backgroundColor: "#888",
        borderRadius: 8,
        padding: 8,
        minWidth: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    headerContainer: {
        flexDirection: "column",
    },
});
