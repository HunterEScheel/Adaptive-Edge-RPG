import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { RootState } from "@/store/rootReducer";
import { addNote, Note, removeNote, updateNote } from "@/store/slices/notesSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ListManager } from "../Common/ListManager";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const GeneralNotes: React.FC = () => {
    const cssStyle = useResponsiveStyles();
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
                <ThemedView style={cssStyle.noteCard}>
                    <TextInput
                        style={[cssStyle.title, cssStyle.input]}
                        value={editingTitle}
                        onChangeText={setEditingTitle}
                        placeholder="Note Title"
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        style={[cssStyle.input]}
                        value={editingContent}
                        onChangeText={setEditingContent}
                        placeholder="Note Content"
                        placeholderTextColor="#aaa"
                        multiline
                    />
                    <View style={[cssStyle.row]}>
                        <Pressable style={[cssStyle.primaryButton]} onPress={handleUpdateNote}>
                            <ThemedText style={cssStyle.buttonText}>Save</ThemedText>
                        </Pressable>
                        <Pressable style={[cssStyle.defaultButton, cssStyle.secondaryButton]} onPress={() => setEditingNote(null)}>
                            <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                        </Pressable>
                    </View>
                </ThemedView>
            );
        }

        return (
            <ThemedView style={cssStyle.noteCard}>
                <ThemedText style={cssStyle.title}>{item.title}</ThemedText>
                <ThemedText style={cssStyle.bodyText}>
                    {new Date(item.updatedAt).toLocaleDateString()} {new Date(item.updatedAt).toLocaleTimeString()}
                </ThemedText>
                <ThemedText style={cssStyle.bodyText}>{item.content}</ThemedText>
                <View style={cssStyle.buttonGroup}>
                    <Pressable style={cssStyle.primaryButton} onPress={() => startEditingNote(item)}>
                        <MaterialIcons name="edit" size={20} color="#444" />
                    </Pressable>
                    <Pressable style={cssStyle.secondaryButton} onPress={() => handleDeleteNote(item.id)}>
                        <MaterialIcons name="delete" size={20} color="#ff4444" />
                    </Pressable>
                </View>
            </ThemedView>
        );
    };

    return (
        <ThemedView style={cssStyle.container}>
            <ListManager
                data={notes}
                title="General Notes"
                renderItem={renderNote}
                keyExtractor={(item: Note) => item.id}
                onAddPress={() => setIsAddingNote(true)}
                emptyStateText="No notes available."
                showAddButton={!isAddingNote}
            />
            <Modal animationType="fade" transparent={true} visible={isAddingNote} onRequestClose={() => setIsAddingNote(false)}>
                <ThemedView style={[cssStyle.modalOverlay]}>
                    <ThemedView style={cssStyle.modalContent}>
                        <TextInput
                            style={cssStyle.input}
                            value={newNoteTitle}
                            onChangeText={setNewNoteTitle}
                            placeholder="Note Title"
                            placeholderTextColor="#aaa"
                        />
                        <TextInput
                            style={cssStyle.input}
                            value={newNoteContent}
                            onChangeText={setNewNoteContent}
                            placeholder="Note Content"
                            placeholderTextColor="#aaa"
                            multiline
                        />
                        <View style={cssStyle.buttonGroup}>
                            <Pressable style={[cssStyle.primaryButton]} onPress={handleAddNote}>
                                <ThemedText style={cssStyle.buttonText}>Add</ThemedText>
                            </Pressable>
                            <Pressable style={[cssStyle.secondaryButton]} onPress={() => setIsAddingNote(false)}>
                                <ThemedText style={cssStyle.buttonText}>Cancel</ThemedText>
                            </Pressable>
                        </View>
                    </ThemedView>
                </ThemedView>
            </Modal>
        </ThemedView>
    );
};
