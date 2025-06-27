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
    
    // Modal responsive styles for tablet
    modalView: {
        width: '85%',
        maxWidth: 700,
        maxHeight: '85%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
        flex: 1,
    },
    modalContent: {
        flex: 1,
        paddingBottom: 12,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    modalTable: {
        padding: 12,
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    modalTableText: {
        fontSize: 13,
        color: "#333",
    },
});
