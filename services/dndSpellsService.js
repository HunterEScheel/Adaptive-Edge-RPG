import { supabase } from './supabase';

// Fetch all spells with optional filters
export const fetchDndSpells = async (filters = {}) => {
  try {
    let query = supabase
      .from('dnd_spells')
      .select('*')
      .order('level')
      .order('name');

    // Apply filters if provided
    if (filters.level !== undefined && filters.level !== null) {
      query = query.eq('level', filters.level);
    }

    if (filters.school) {
      query = query.eq('school', filters.school);
    }

    if (filters.ritual !== undefined) {
      query = query.eq('ritual', filters.ritual);
    }

    if (filters.concentration !== undefined) {
      query = query.eq('concentration', filters.concentration);
    }

    if (filters.classes && filters.classes.length > 0) {
      // Filter by any of the provided classes
      query = query.contains('classes', filters.classes);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching D&D spells:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching D&D spells:', error);
    return { success: false, error };
  }
};

// Search spells by name or description
export const searchDndSpells = async (searchQuery) => {
  try {
    if (!searchQuery || searchQuery.trim() === '') {
      return fetchDndSpells();
    }

    const { data, error } = await supabase
      .rpc('search_dnd_spells', { search_query: searchQuery });

    if (error) {
      console.error('Error searching D&D spells:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception searching D&D spells:', error);
    return { success: false, error };
  }
};

// Get spells by specific class
export const fetchSpellsByClass = async (className) => {
  try {
    const { data, error } = await supabase
      .rpc('get_spells_by_class', { class_name: className });

    if (error) {
      console.error('Error fetching spells by class:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching spells by class:', error);
    return { success: false, error };
  }
};

// Get spells by level
export const fetchSpellsByLevel = async (level) => {
  try {
    const { data, error } = await supabase
      .rpc('get_spells_by_level', { spell_level: level });

    if (error) {
      console.error('Error fetching spells by level:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching spells by level:', error);
    return { success: false, error };
  }
};

// Get all unique spell schools
export const fetchSpellSchools = async () => {
  try {
    const { data, error } = await supabase
      .from('dnd_spells')
      .select('school')
      .order('school');

    if (error) {
      console.error('Error fetching spell schools:', error);
      return { success: false, error };
    }

    // Extract unique schools
    const uniqueSchools = [...new Set(data.map(item => item.school))];

    return { success: true, data: uniqueSchools };
  } catch (error) {
    console.error('Exception fetching spell schools:', error);
    return { success: false, error };
  }
};

// Get spell details by ID
export const fetchSpellById = async (spellId) => {
  try {
    const { data, error } = await supabase
      .from('dnd_spells')
      .select('*')
      .eq('id', spellId)
      .single();

    if (error) {
      console.error('Error fetching spell by ID:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching spell by ID:', error);
    return { success: false, error };
  }
};

// Get spell details by name
export const fetchSpellByName = async (spellName) => {
  try {
    const { data, error } = await supabase
      .from('dnd_spells')
      .select('*')
      .eq('name', spellName)
      .single();

    if (error) {
      console.error('Error fetching spell by name:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching spell by name:', error);
    return { success: false, error };
  }
};