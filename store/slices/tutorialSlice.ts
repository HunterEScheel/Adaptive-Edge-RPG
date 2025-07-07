import { createSlice } from "@reduxjs/toolkit";

// Define the initial state as a constant for clarity
const initialState = 0;

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    startTutorial: () => {
      return 1;
    },
    nextTutorialStep: (state) => {
      return state + 1;
    },
    prevTutorialStep: (state) => {
      return Math.max(0, state - 1);
    },
    endTutorial: () => {
      return 0;
    },
  },
});

export const { startTutorial, nextTutorialStep, prevTutorialStep, endTutorial } = tutorialSlice.actions;
export default tutorialSlice.reducer;
