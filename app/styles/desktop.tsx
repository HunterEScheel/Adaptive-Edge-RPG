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
    
    // Modal responsive styles for desktop
    modalView: {
        width: '70%',
        maxWidth: 900,
        maxHeight: '80%',
        backgroundColor: "white",
        borderRadius: 24,
        padding: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: "600",
        color: "#333",
        flex: 1,
    },
    modalContent: {
        flex: 1,
        paddingBottom: 16,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 20,
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    modalTable: {
        padding: 16,
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    modalTableText: {
        fontSize: 14,
        color: "#333",
    },
});
