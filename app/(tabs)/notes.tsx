import { GeneralNotes } from "@/components/Notes/GeneralNotes";
import { NPCTracker } from "@/components/Notes/NPCTracker";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function NotesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <GeneralNotes />
        <NPCTracker />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});
