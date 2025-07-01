import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseState } from "../slices/baseSlice";

// Define the reducer
const presetSlice = createSlice({
    name: "character",
    initialState: [] as BaseState[],
    reducers: {
        setPresets: (state, action: PayloadAction<BaseState[]>) => {
            return action.payload;
        },
    },
});

// Export the actions
export const { setPresets } = presetSlice.actions;

export default presetSlice.reducer;
