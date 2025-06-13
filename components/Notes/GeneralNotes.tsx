import { RootState } from "@/store/rootReducer";
import { addNote, Note, removeNote, updateNote } from "@/store/slices/notesSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Collapsible } from "../Collapsible";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const GeneralNotes: React.FC = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.character.notes.notes || []);

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      dispatch(
        addNote({
          title: newNoteTitle,
          content: newNoteContent,
        })
      );

      // Reset form
      setNewNoteTitle("");
      setNewNoteContent("");
      setIsAddingNote(false);
    } else {
      Alert.alert("Invalid Input", "Title and content are required.");
    }
  };

  const handleUpdateNote = () => {
    if (editingNote && (editingTitle.trim() || editingContent.trim())) {
      dispatch(
        updateNote({
          id: editingNote.id,
          title: editingTitle,
          content: editingContent,
        })
      );

      // Reset form
      setEditingNote(null);
      setEditingTitle("");
      setEditingContent("");
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(removeNote(noteId)),
      },
    ]);
  };

  const startEditingNote = (note: Note) => {
    setEditingNote(note);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };

  const renderNote = ({ item }: { item: Note }) => {
    const isEditing = editingNote?.id === item.id;

    if (isEditing) {
      return (
        <ThemedView style={styles.noteCard}>
          <TextInput style={styles.titleInput} value={editingTitle} onChangeText={setEditingTitle} placeholder="Note Title" placeholderTextColor="#aaa" />
          <TextInput style={styles.contentInput} value={editingContent} onChangeText={setEditingContent} placeholder="Note Content" placeholderTextColor="#aaa" multiline />
          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.saveButton]} onPress={handleUpdateNote}>
              <ThemedText style={styles.buttonText}>Save</ThemedText>
            </Pressable>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={() => setEditingNote(null)}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.noteCard}>
        <ThemedText style={styles.noteTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.noteDate}>
          {new Date(item.updatedAt).toLocaleDateString()} {new Date(item.updatedAt).toLocaleTimeString()}
        </ThemedText>
        <ThemedText style={styles.noteContent}>{item.content}</ThemedText>
        <View style={styles.actionButtons}>
          <Pressable style={styles.iconButton} onPress={() => startEditingNote(item)}>
            <MaterialIcons name="edit" size={20} color="#444" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => handleDeleteNote(item.id)}>
            <MaterialIcons name="delete" size={20} color="#ff4444" />
          </Pressable>
        </View>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Collapsible title="General Notes">
        <ThemedView style={styles.notesContainer}>
          {notes.length === 0 && !isAddingNote ? (
            <ThemedText style={styles.emptyText}>No notes yet. Add your first note!</ThemedText>
          ) : (
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              renderItem={renderNote}
              contentContainerStyle={styles.notesList}
              scrollEnabled={false} // Let parent scroll view handle scrolling
            />
          )}

          {isAddingNote ? (
            <ThemedView style={styles.addNoteForm}>
              <TextInput style={styles.titleInput} value={newNoteTitle} onChangeText={setNewNoteTitle} placeholder="Note Title" placeholderTextColor="#aaa" />
              <TextInput style={styles.contentInput} value={newNoteContent} onChangeText={setNewNoteContent} placeholder="Note Content" placeholderTextColor="#aaa" multiline />
              <View style={styles.buttonRow}>
                <Pressable style={[styles.button, styles.saveButton]} onPress={handleAddNote}>
                  <ThemedText style={styles.buttonText}>Add</ThemedText>
                </Pressable>
                <Pressable style={[styles.button, styles.cancelButton]} onPress={() => setIsAddingNote(false)}>
                  <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                </Pressable>
              </View>
            </ThemedView>
          ) : (
            <Pressable style={styles.addButton} onPress={() => setIsAddingNote(true)}>
              <MaterialIcons name="add" size={24} color="#fff" />
              <ThemedText style={styles.addButtonText}>Add Note</ThemedText>
            </Pressable>
          )}
        </ThemedView>
      </Collapsible>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  notesContainer: {
    padding: 10,
  },
  notesList: {
    marginBottom: 10,
  },
  noteCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  noteDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontStyle: "italic",
    color: "#888",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  addNoteForm: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  titleInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 16,
    color: "#333",
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    minHeight: 100,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
