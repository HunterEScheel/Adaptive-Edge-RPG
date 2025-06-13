import { ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { FlawManager } from "@/components/MainPage/FlawManager";
import { SkillManager } from "@/components/MainPage/SkillManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RootState } from "@/store/rootReducer";

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
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {/* Character information moved to header */}

        {/* Skills System */}
        <SkillManager />

        {/* Flaws System */}
        <FlawManager />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  nameContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  characterName: {
    fontSize: 28,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  abilityScoresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  abilityBox: {
    width: "30%",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  abilityLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  abilityValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "22%",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
  },
  buildPointsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  buildPointsValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  buildPointsLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  quickStatsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 15,
    gap: 8,
  },
});
