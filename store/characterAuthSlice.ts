import { createSlice } from "@reduxjs/toolkit";

// Define the authentication state type
interface CharacterAuthState {
  isCharacterLoaded: boolean;
}

// Initial state
const initialState: CharacterAuthState = {
  isCharacterLoaded: false,
};

// Create the slice
const characterAuthSlice = createSlice({
  name: "characterAuth",
  initialState,
  reducers: {
    setCharacterLoaded: (state) => {
      state.isCharacterLoaded = true;
    },
    resetCharacterLoaded: (state) => {
      state.isCharacterLoaded = false;
    },
  },
});

// Export actions and reducer
export const { setCharacterLoaded, resetCharacterLoaded } = characterAuthSlice.actions;
export default characterAuthSlice.reducer;
