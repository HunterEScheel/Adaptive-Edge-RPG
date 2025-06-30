import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Simple ID generator function
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export type MagicSchool = {
    id: string;
    name: string;
    description: string;
};

export type Spell = {
    id: string;
    name: string;
    school: string; // Name of the magic school this spell belongs to
    description: string;
    energyCost: number; // Energy cost to cast
    buildPointCost: number; // Cost to learn the spell
    damage?: string; // Optional damage information
    range?: string; // Optional range information
    duration?: string; // Optional duration information
    area?: string; // Optional area of effect
};

export interface MagicState {
    magicSchools: MagicSchool[];
    spells: Spell[];
    magicSchoolCredit: boolean; // Whether the character has a free magic school credit
}

const initialState: MagicState = {
    magicSchools: [],
    spells: [],
    magicSchoolCredit: false,
};

const magicSlice = createSlice({
    name: "magic",
    initialState,
    reducers: {
        setMagicState: (state, action: PayloadAction<MagicState>) => {
            return action.payload;
        },
        // Magic Schools
        addMagicSchool: (state, action: PayloadAction<Omit<MagicSchool, "id">>) => {
            const newSchool = {
                ...action.payload,
                id: generateId(),
            };
            state.magicSchools.push(newSchool);
            return state;
        },
        removeMagicSchool: (state, action: PayloadAction<string>) => {
            state.magicSchools = state.magicSchools.filter((school) => school.id !== action.payload);
            return state;
        },
        updateMagicSchool: (state, action: PayloadAction<{ id: string; name?: string; description?: string }>) => {
            const { id, ...updates } = action.payload;
            const schoolIndex = state.magicSchools.findIndex((school) => school.id === id);

            if (schoolIndex >= 0) {
                state.magicSchools[schoolIndex] = { ...state.magicSchools[schoolIndex], ...updates };
            }
            return state;
        },
        // Spells
        addSpell: (state, action: PayloadAction<Omit<Spell, "id">>) => {
            const newSpell = {
                ...action.payload,
                id: generateId(),
            };
            state.spells.push(newSpell);
            return state;
        },
        removeSpell: (state, action: PayloadAction<string>) => {
            console.log(action.payload);
            state.spells = state.spells.filter((spell) => spell.id !== action.payload);
            return state;
        },
        updateSpell: (
            state,
            action: PayloadAction<{
                id: string;
                name?: string;
                school?: string;
                description?: string;
                energyCost?: number;
                buildPointCost?: number;
                damage?: string;
                range?: string;
                duration?: string;
                area?: string;
            }>
        ) => {
            const { id, ...updates } = action.payload;
            const spellIndex = state.spells.findIndex((spell) => spell.id === id);

            if (spellIndex >= 0) {
                state.spells[spellIndex] = { ...state.spells[spellIndex], ...updates };
            }
            return state;
        },
        // Magic School Credit
        setMagicSchoolCredit: (state, action: PayloadAction<boolean>) => {
            state.magicSchoolCredit = action.payload;
            return state;
        },
        useMagicSchoolCredit: (state) => {
            state.magicSchoolCredit = false;
            return state;
        },
    },
});

export const {
    setMagicState,
    addMagicSchool,
    removeMagicSchool,
    updateMagicSchool,
    addSpell,
    removeSpell,
    updateSpell,
    setMagicSchoolCredit,
    useMagicSchoolCredit,
} = magicSlice.actions;

export default magicSlice.reducer;
