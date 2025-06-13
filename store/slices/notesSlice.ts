import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Simple ID generator function
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export type RelationshipLevel = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export type NPC = {
  id: string;
  name: string;
  description: string;
  relationshipLevel: RelationshipLevel; // -3 to +3 scale
  notes: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export interface NotesState {
  notes: Note[];
  npcs: NPC[];
}

const initialState: NotesState = {
  notes: [],
  npcs: []
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotesState: (state, action: PayloadAction<NotesState>) => {
      return action.payload;
    },
    // Notes
    addNote: (state, action: PayloadAction<Omit<Note, "id" | "createdAt" | "updatedAt">>) => {
      const now = new Date().toISOString();
      const newNote = {
        ...action.payload,
        id: generateId(),
        createdAt: now,
        updatedAt: now
      };
      state.notes.push(newNote);
      return state;
    },
    updateNote: (state, action: PayloadAction<{ id: string, title?: string, content?: string }>) => {
      const { id, ...updates } = action.payload;
      const noteIndex = state.notes.findIndex(note => note.id === id);
      
      if (noteIndex >= 0) {
        state.notes[noteIndex] = { 
          ...state.notes[noteIndex], 
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return state;
    },
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
      return state;
    },
    // NPCs
    addNPC: (state, action: PayloadAction<Omit<NPC, "id">>) => {
      const newNPC = {
        ...action.payload,
        id: generateId()
      };
      state.npcs.push(newNPC);
      return state;
    },
    updateNPC: (state, action: PayloadAction<{ id: string, name?: string, description?: string, notes?: string }>) => {
      const { id, ...updates } = action.payload;
      const npcIndex = state.npcs.findIndex(npc => npc.id === id);
      
      if (npcIndex >= 0) {
        state.npcs[npcIndex] = { ...state.npcs[npcIndex], ...updates };
      }
      return state;
    },
    updateNPCRelationship: (state, action: PayloadAction<{ id: string, relationshipLevel: RelationshipLevel }>) => {
      const { id, relationshipLevel } = action.payload;
      const npcIndex = state.npcs.findIndex(npc => npc.id === id);
      
      if (npcIndex >= 0) {
        state.npcs[npcIndex].relationshipLevel = relationshipLevel;
      }
      return state;
    },
    removeNPC: (state, action: PayloadAction<string>) => {
      state.npcs = state.npcs.filter(npc => npc.id !== action.payload);
      return state;
    }
  }
});

export const {
  setNotesState,
  addNote,
  updateNote,
  removeNote,
  addNPC,
  updateNPC,
  updateNPCRelationship,
  removeNPC
} = notesSlice.actions;

export default notesSlice.reducer;
