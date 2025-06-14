import { ScrollView } from "react-native";
import { useSelector } from "react-redux";

import { FlawManager } from "@/components/MainPage/FlawManager";
import { SkillManager } from "@/components/MainPage/SkillManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RootState } from "@/store/rootReducer";
import { cssStyle as styles } from "../styles/phone";

export default function HomeScreen() {
    const character = useSelector((state: RootState) => state.character);

    // Handle the case where character might be undefined or null
    if (!character) {
        return (
            <ThemedView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ThemedText>Loading character data...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                {/* Character information moved to header */}

                {/* Skills System */}
                <SkillManager />

                {/* Flaws System */}
                <FlawManager />
            </ScrollView>
        </ThemedView>
    );
}
