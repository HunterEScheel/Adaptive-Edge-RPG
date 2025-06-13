import { MagicSchoolManager } from "@/components/Spellcasting/MagicSchoolManager";
import { SpellManager } from "@/components/Spellcasting/SpellManager";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MagicScreen() {
  // Define sections for the FlatList
  const sections = [
    { id: "header", type: "header" },
    { id: "magicSchools", type: "magicSchools" },
    { id: "spells", type: "spells" },
  ];

  const renderItem = ({ item }: { item: { id: string; type: string } }) => {
    switch (item.type) {
      case "header":
        return (
          <ThemedView style={styles.header}>
            <ThemedText type="title">Magic</ThemedText>
          </ThemedView>
        );
      case "magicSchools":
        return (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Magic Schools
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Learn new schools of magic for 25 build points each. Your first school is free.</ThemedText>
            <MagicSchoolManager />
          </ThemedView>
        );
      case "spells":
        return (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Spells
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Spells from your known magic schools will appear here.</ThemedText>
            <SpellManager />
          </ThemedView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={sections} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.scrollView} contentContainerStyle={styles.scrollContent} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40, // Add extra padding at the bottom for better scrolling
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 16,
    fontSize: 14,
    color: "#666",
  },
  comingSoon: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
  },
});
