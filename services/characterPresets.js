// Character Presets Service
// Handles saving, loading, and managing character presets

import { supabase } from "./supabase";

class CharacterPresetsService {
  /**
   * Save a character as a preset
   * @param {string} presetName - Name for the preset
   * @param {string} description - Optional description
   * @param {import("@/store/reducers/characterReducer").Character} character - The complete character object from Redux state
   * @param {string[]} tags - Optional tags for categorization
   * @returns {Promise<Object>} - The created preset or error
   */
  async savePreset(presetName, description, character, tags = []) {
    try {
      // Insert the main character preset record
      const { data: presetData, error: presetError } = await supabase
        .from("character_presets")
        .insert({
          preset_name: presetName,
          // Character basic info
          character_name: character.name,
          character_class: character.class,
          character_level: character.level,
          build_points: character.buildPoints,
          energy: character.energy,
          max_energy: character.maxEnergy,
          hit_points: character.hitPoints,
          max_hit_points: character.maxHitPoints,
          ac: character.ac,
          movement: character.movement,
          // Stats
          str: character.str,
          dex: character.dex,
          con: character.con,
          int: character.int,
          wis: character.wis,
          cha: character.cha,
          // Other fields
          gold: character.gold,
          magic_school_credit: character.magicSchoolCredit,
        })
        .select()
        .single();

      if (presetError) {
        console.error("Error saving character preset:", presetError);
        return { success: false, error: presetError };
      }

      const presetId = presetData.id;

      // Save skills
      if (character.skills && character.skills.length > 0) {
        const skillsToInsert = character.skills.map((skill) => ({
          preset_id: presetId,
          skill_name: skill.name,
          skill_level: skill.level,
          description: skill.description || "",
        }));

        const { error: skillsError } = await supabase.from("preset_skills").insert(skillsToInsert);

        if (skillsError) {
          console.error("Error saving skills:", skillsError);
          // We continue even if skills insertion fails
        }
      }

      // Save magic schools
      if (character.magicSchools && character.magicSchools.length > 0) {
        const schoolsToInsert = character.magicSchools.map((school) => ({
          preset_id: presetId,
          name: school.name,
          description: school.description || "",
        }));

        const { error: schoolsError } = await supabase.from("preset_magic_schools").insert(schoolsToInsert);

        if (schoolsError) {
          console.error("Error saving magic schools:", schoolsError);
        }
      }

      // Save spells
      if (character.spells && character.spells.length > 0) {
        const spellsToInsert = character.spells.map((spell) => ({
          preset_id: presetId,
          name: spell.name,
          school: spell.school,
          description: spell.description || "",
          energy_cost: spell.energyCost,
          build_point_cost: spell.buildPointCost,
          damage: spell.damage,
          range: spell.range,
          duration: spell.duration,
          area: spell.area,
        }));

        const { error: spellsError } = await supabase.from("preset_spells").insert(spellsToInsert);

        if (spellsError) {
          console.error("Error saving spells:", spellsError);
        }
      }

      // Save flaws
      if (character.flaws && character.flaws.length > 0) {
        const flawsToInsert = character.flaws.map((flaw) => ({
          preset_id: presetId,
          name: flaw.name,
          description: flaw.description || "",
          severity: flaw.severity,
        }));

        const { error: flawsError } = await supabase.from("preset_flaws").insert(flawsToInsert);

        if (flawsError) {
          console.error("Error saving flaws:", flawsError);
        }
      }

      // Save attacks
      if (character.attacks && character.attacks.length > 0) {
        const attacksToInsert = character.attacks.map((attack) => ({
          preset_id: presetId,
          name: attack.name,
          description: attack.description || "",
          build_point_cost: attack.buildPointCost,
          energy_cost: attack.energyCost,
        }));

        const { error: attacksError } = await supabase.from("preset_attacks").insert(attacksToInsert);

        if (attacksError) {
          console.error("Error saving attacks:", attacksError);
        }
      }

      // Save passives
      if (character.passives && character.passives.length > 0) {
        const passivesToInsert = character.passives.map((passive) => ({
          preset_id: presetId,
          name: passive.name,
          description: passive.description || "",
          build_point_cost: passive.buildPointCost,
        }));

        const { error: passivesError } = await supabase.from("preset_passives").insert(passivesToInsert);

        if (passivesError) {
          console.error("Error saving passives:", passivesError);
        }
      }

      // Save notes
      if (character.notes && character.notes.length > 0) {
        const notesToInsert = character.notes.map((note) => ({
          preset_id: presetId,
          title: note.title,
          content: note.content || "",
        }));

        const { error: notesError } = await supabase.from("preset_notes").insert(notesToInsert);

        if (notesError) {
          console.error("Error saving notes:", notesError);
        }
      }

      // Save NPCs
      if (character.npcs && character.npcs.length > 0) {
        const npcsToInsert = character.npcs.map((npc) => ({
          preset_id: presetId,
          name: npc.name,
          description: npc.description || "",
          relationship_level: npc.relationshipLevel,
          notes: npc.notes || "",
        }));

        const { error: npcsError } = await supabase.from("preset_npcs").insert(npcsToInsert);

        if (npcsError) {
          console.error("Error saving NPCs:", npcsError);
        }
      }

      return {
        success: true,
        data: {
          id: presetId,
          preset_name: presetName,
          description: description || "",
        },
      };
    } catch (error) {
      console.error("Unexpected error in savePreset:", error);
      return { success: false, error };
    }
  }

  /**
   * Get all available character presets
   * @param {boolean} includeFullData - Whether to include character data
   * @returns {Promise<Array>} - List of all presets
   */
  async getPresets(includeFullData = false) {
    try {
      // Select basic preset info or include character stats
      const query = includeFullData
        ? supabase.from("character_presets").select("*")
        : supabase.from("character_presets").select("id, preset_name, description, created_at, updated_at, tags, character_name, character_race, character_class, character_level");

      const { data: presets, error } = await query.order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching presets:", error);
        return { success: false, error };
      }

      // Format the response for consistent API
      const formattedPresets =
        presets?.map((preset) => ({
          id: preset.id,
          preset_name: preset.preset_name,
          description: preset.description,
          created_at: preset.created_at,
          updated_at: preset.updated_at,
          tags: preset.tags || [],
          // Include a basic character summary
          character_summary: {
            name: preset.character_name,
            race: preset.character_race,
            class: preset.character_class,
            level: preset.character_level,
          },
        })) || [];

      return { success: true, data: formattedPresets };
    } catch (error) {
      console.error("Unexpected error in getPresets:", error);
      return { success: false, error };
    }
  }

  /**
   * Search for character presets by tags or name
   * @param {string} searchTerm - Text to search for in names
   * @param {string[]} tags - Tags to filter by
   * @returns {Promise<Array>} - List of matching presets
   */
  async searchPresets(searchTerm = "", tags = []) {
    try {
      let query = supabase.from("character_presets").select("id, preset_name, description, created_at, updated_at, tags");

      // Apply filters if provided
      if (searchTerm) {
        query = query.ilike("preset_name", `%${searchTerm}%`);
      }

      if (tags && tags.length > 0) {
        // Filter by any of the provided tags
        query = query.contains("tags", tags);
      }

      const { data: presets, error } = await query.order("updated_at", { ascending: false });

      if (error) {
        console.error("Error searching presets:", error);
        return { success: false, error };
      }

      return { success: true, data: presets || [] };
    } catch (error) {
      console.error("Unexpected error in searchPresets:", error);
      return { success: false, error };
    }
  }

  /**
   * Get a specific character preset by ID
   * @param {number} presetId - The ID of the preset to load
   * @returns {Promise<Object>} - The complete preset with character data
   */
  async getPresetById(presetId) {
    try {
      // Get the main preset data
      const { data: preset, error: presetError } = await supabase.from("character_presets").select("*").eq("id", presetId).single();

      if (presetError) {
        console.error("Error fetching preset:", presetError);
        return { success: false, error: presetError };
      }

      // Get related data for this preset
      const [skillsResult, magicSchoolsResult, spellsResult, flawsResult, attacksResult, passivesResult, notesResult, npcsResult] = await Promise.all([
        supabase.from("preset_skills").select("*").eq("preset_id", presetId),
        supabase.from("preset_magic_schools").select("*").eq("preset_id", presetId),
        supabase.from("preset_spells").select("*").eq("preset_id", presetId),
        supabase.from("preset_flaws").select("*").eq("preset_id", presetId),
        supabase.from("preset_attacks").select("*").eq("preset_id", presetId),
        supabase.from("preset_passives").select("*").eq("preset_id", presetId),
        supabase.from("preset_notes").select("*").eq("preset_id", presetId),
        supabase.from("preset_npcs").select("*").eq("preset_id", presetId),
      ]);

      // Map the DB fields to Redux character format
      const character = {
        // Basic info
        name: preset.character_name,
        race: preset.character_race,
        class: preset.character_class,
        level: preset.character_level,
        buildPoints: preset.build_points,
        energy: preset.energy,
        maxEnergy: preset.max_energy,
        hitPoints: preset.hit_points,
        maxHitPoints: preset.max_hit_points,
        ac: preset.ac,
        movement: preset.movement,

        // Stats
        str: preset.str,
        dex: preset.dex,
        con: preset.con,
        int: preset.int,
        wis: preset.wis,
        cha: preset.cha,

        // Items - initialize empty arrays since we're ignoring items for now
        items: {
          weapons: [],
          equipment: [],
          consumables: [],
        },

        // Arrays of character data
        skills:
          skillsResult.data?.map((skill) => ({
            id: skill.id.toString(),
            name: skill.skill_name,
            level: skill.skill_level,
            description: skill.description || "",
          })) || [],

        magicSchools:
          magicSchoolsResult.data?.map((school) => ({
            id: school.id.toString(),
            name: school.name,
            description: school.description || "",
          })) || [],

        spells:
          spellsResult.data?.map((spell) => ({
            id: spell.id.toString(),
            name: spell.name,
            school: spell.school,
            description: spell.description || "",
            energyCost: spell.energy_cost,
            buildPointCost: spell.build_point_cost,
            damage: spell.damage,
            range: spell.range,
            duration: spell.duration,
            area: spell.area,
          })) || [],

        flaws:
          flawsResult.data?.map((flaw) => ({
            id: flaw.id.toString(),
            name: flaw.name,
            description: flaw.description || "",
            severity: flaw.severity,
          })) || [],

        attacks:
          attacksResult.data?.map((attack) => ({
            id: attack.id.toString(),
            name: attack.name,
            description: attack.description || "",
            buildPointCost: attack.build_point_cost,
            energyCost: attack.energy_cost,
          })) || [],

        passives:
          passivesResult.data?.map((passive) => ({
            id: passive.id.toString(),
            name: passive.name,
            description: passive.description || "",
            buildPointCost: passive.build_point_cost,
          })) || [],

        notes:
          notesResult.data?.map((note) => ({
            id: note.id.toString(),
            title: note.title,
            content: note.content || "",
            createdAt: note.created_at,
            updatedAt: note.updated_at,
          })) || [],

        npcs:
          npcsResult.data?.map((npc) => ({
            id: npc.id.toString(),
            name: npc.name,
            description: npc.description || "",
            relationshipLevel: npc.relationship_level,
            notes: npc.notes || "",
          })) || [],

        // Other fields
        gold: preset.gold,
        magicSchoolCredit: preset.magic_school_credit,
      };

      const result = {
        id: preset.id,
        preset_name: preset.preset_name,
        description: preset.description,
        created_at: preset.created_at,
        updated_at: preset.updated_at,
        tags: preset.tags,
        character: character,
      };

      return { success: true, data: result };
    } catch (error) {
      console.error("Unexpected error in getPresetById:", error);
      return { success: false, error };
    }
  }

  /**
   * Delete a character preset
   * @param {number} presetId - The ID of the preset to delete
   * @returns {Promise<Object>} - Result of the deletion
   */
  async deletePreset(presetId) {
    try {
      const { error } = await supabase.from("character_presets").delete().eq("id", presetId);

      if (error) {
        console.error("Error deleting preset:", error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error in deletePreset:", error);
      return { success: false, error };
    }
  }

  /**
   * Update an existing character preset
   * @param {number} presetId - The ID of the preset to update
   * @param {Object} updates - The properties to update
   * @returns {Promise<Object>} - Result of the update
   */
  async updatePreset(presetId, updates) {
    try {
      const { preset_name, description, character_data, tags } = updates;
      const updateData = {};

      // Only include fields that are provided
      if (preset_name !== undefined) updateData.preset_name = preset_name;
      if (description !== undefined) updateData.description = description;
      if (character_data !== undefined) updateData.character_data = character_data;
      if (tags !== undefined) updateData.tags = tags;

      const { data, error } = await supabase.from("character_presets").update(updateData).eq("id", presetId).select().single();

      if (error) {
        console.error("Error updating preset:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error in updatePreset:", error);
      return { success: false, error };
    }
  }

  /**
   * Update tags for a preset
   * @param {number} presetId - The ID of the preset
   * @param {string[]} tags - New tags array
   * @returns {Promise<Object>} - Result of the update
   */
  async updatePresetTags(presetId, tags) {
    try {
      const { data, error } = await supabase.from("character_presets").update({ tags }).eq("id", presetId).select("id, preset_name, tags").single();

      if (error) {
        console.error("Error updating preset tags:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error in updatePresetTags:", error);
      return { success: false, error };
    }
  }
}

export const characterPresetsService = new CharacterPresetsService();
