import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Character } from "./characterReducer";

// Define the reducer
const presetSlice = createSlice({
  name: "character",
  initialState: [] as Character[],
  reducers: {
    setPresets: (state, action: PayloadAction<Character[]>) => {
      return action.payload;
    },
  },
});

// Export the actions
export const { setPresets } = presetSlice.actions;

export default presetSlice.reducer;
