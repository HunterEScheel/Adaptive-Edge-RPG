import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Tether {
    id: string;
    name: string;
    description: string;
    obligationLevel: number;
}

export interface TethersState {
    tethers: Tether[];
    minimumTotalObligation: number;
}

const initialState: TethersState = {
    tethers: [],
    minimumTotalObligation: 10, // Default minimum, can be set by DM
};

const tethersSlice = createSlice({
    name: "tethers",
    initialState,
    reducers: {
        addTether: (state, action: PayloadAction<Omit<Tether, "id">>) => {
            const newTether: Tether = {
                ...action.payload,
                id: `tether_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };
            state.tethers.push(newTether);
        },
        updateTether: (state, action: PayloadAction<Tether>) => {
            const index = state.tethers.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) {
                state.tethers[index] = action.payload;
            }
        },
        removeTether: (state, action: PayloadAction<string>) => {
            state.tethers = state.tethers.filter((t) => t.id !== action.payload);
        },
        setMinimumTotalObligation: (state, action: PayloadAction<number>) => {
            state.minimumTotalObligation = action.payload;
        },
        setTethersState: (state, action: PayloadAction<TethersState>) => {
            return action.payload;
        },
    },
});

export const { addTether, updateTether, removeTether, setMinimumTotalObligation, setTethersState } = tethersSlice.actions;
export default tethersSlice.reducer;