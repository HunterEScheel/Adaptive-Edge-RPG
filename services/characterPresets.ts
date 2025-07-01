// Character Presets Service
// Handles saving, loading, and managing character presets

import { Armor } from "@/constants/Item";
import { Skill } from "@/constants/Skills";
import { Attack, Flaw, Passive } from "@/store/slices/abilitiesSlice";
import { BaseState } from "@/store/slices/baseSlice";
import { Character } from "@/store/slices/characterSlice";
import { MagicSchool, Spell } from "@/store/slices/magicSlice";
import { supabase } from "./supabase";

export async function savePreset(presetName: string, description: string, character: Character, tags = []) {
    try {
        // Insert the main character preset record
        const { data: presetData, error: presetError } = await supabase
            .from("character_presets")
            .insert({
                preset_name: presetName,
                // Character basic info
                build_points_spent: character.base.buildPointsSpent,
                build_points_remaining: character.base.buildPointsRemaining,
                max_energy: character.base.maxEnergy,
                max_hit_points: character.base.maxHitPoints,
                movement: character.base.movement,
                dodge: character.skills?.dodge || 0,
                parry: character.skills?.parry || 0,
                // Stats
                str: character.base.str,
                dex: character.base.dex,
                con: character.base.con,
                int: character.base.int,
                foc: character.base.foc,
                cha: character.base.cha,
            })
            .select()
            .single();

        if (presetError) {
            console.error("Error saving character preset:", presetError);
            return { success: false, error: presetError };
        }

        const presetId = presetData.id;

        // Save skills
        if (character.skills && character.skills.skills.length > 0) {
            const skillsToInsert = character.skills.skills.map((skill: Skill) => ({
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
        if (character.magic.magicSchools && character.magic.magicSchools.length > 0) {
            const schoolsToInsert = character.magic.magicSchools.map((school: MagicSchool) => ({
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
        if (character.magic.spells && character.magic.spells.length > 0) {
            const spellsToInsert = character.magic.spells.map((spell: Spell) => ({
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
        if (character.abilities.flaws && character.abilities.flaws.length > 0) {
            const flawsToInsert = character.abilities.flaws.map((flaw: Flaw) => ({
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
        if (character.abilities.attacks && character.abilities.attacks.length > 0) {
            const attacksToInsert = character.abilities.attacks.map((attack: Attack) => ({
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
        if (character.abilities.passives && character.abilities.passives.length > 0) {
            const passivesToInsert = character.abilities.passives.map((passive: Passive) => ({
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
export async function getPresets() {
    try {
        // Select basic preset info or include character stats
        const query = supabase.from("character_presets").select("*");

        const { data: presets, error } = await query.order("updated_at", { ascending: false });

        if (error) {
            console.error("Error fetching presets:", error);
            return { success: false, error };
        }

        // Format the response for consistent API
        const formattedPresets: BaseState[] = presets.map((preset) => ({
            id: preset.id,
            preset_name: preset.preset_name,
            created_at: preset.created_at,
            updated_at: preset.updated_at,
            buildPointsRemaining: 0,
            buildPointsSpent: preset.build_points_spent,
            name: preset.preset_name,
            cha: preset.cha,
            con: preset.con,
            dex: preset.dex,
            int: preset.int,
            foc: preset.foc,
            hitPoints: preset.hit_points,
            maxEnergy: preset.max_energy,
            maxHitPoints: preset.max_hit_points,
            movement: preset.movement,
            str: preset.str,
            energy: preset.energy,
        }));
        console.log(formattedPresets);
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
export async function searchPresets(searchTerm = "", tags = []) {
    try {
        let query = supabase.from("character_presets").select("id, preset_name, created_at, updated_at, tags");

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
 * @param {string} presetId - The ID of the preset to load
 * @returns {Promise<Object>} - The complete preset with character data
 */
export async function getPresetById(presetId: string) {
    try {
        // Get the main preset data
        const { data: preset, error: presetError } = await supabase.from("character_presets").select("*").eq("id", presetId).single();

        if (presetError) {
            console.error("Error fetching preset:", presetError);
            return { success: false, error: presetError };
        }

        // Get related data for this preset
        const [skillsResult, magicSchoolsResult, spellsResult, flawsResult, attacksResult, passivesResult] = await Promise.all([
            supabase.from("preset_skills").select("*").eq("preset_id", presetId),
            supabase.from("preset_magic_schools").select("*").eq("preset_id", presetId),
            supabase.from("preset_spells").select("*").eq("preset_id", presetId),
            supabase.from("preset_flaws").select("*").eq("preset_id", presetId),
            supabase.from("preset_attacks").select("*").eq("preset_id", presetId),
            supabase.from("preset_passives").select("*").eq("preset_id", presetId),
        ]);

        // Map the DB fields to Redux character format
        const character: Character = {
            // Basic info
            base: {
                id: preset.id,
                name: preset.preset_name,
                buildPointsSpent: preset.build_points_spent,
                buildPointsRemaining: preset.build_points_remaining,
                energy: preset.max_energy, // Default to max when loading preset
                maxEnergy: preset.max_energy,
                hitPoints: preset.max_hit_points, // Default to max when loading preset
                maxHitPoints: preset.max_hit_points,
                movement: preset.movement,

                // Stats
                str: preset.str,
                dex: preset.dex,
                con: preset.con,
                int: preset.int,
                foc: preset.foc,
                cha: preset.cha,
            },
            // Items - initialize empty arrays since we're ignoring items for now
            inventory: {
                weapons: [],
                equipment: [],
                consumables: [],
                armor: {} as Armor,
                gold: 0,
            },

            // Arrays of character data
            skills: {
                skills:
                    skillsResult.data?.map((skill) => ({
                        id: skill.id.toString(),
                        name: skill.skill_name,
                        level: skill.skill_level,
                        description: skill.description || "",
                    })) || [],
                dodge: preset.dodge || 0,
                parry: preset.parry || 0,
                weaponSkills: [],
            },

            magic: {
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
                magicSchoolCredit: !magicSchoolsResult.data?.length,
            },
            abilities: {
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
            },
            notes: {
                notes: [],
                npcs: [],
            },
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
 * @param {string} presetId - The ID of the preset to delete
 * @returns {Promise<Object>} - Result of the deletion
 */
export async function deletePreset(presetId: string) {
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
 * @param {string} presetId - The ID of the preset to update
 * @param {Object} updates - The properties to update
 * @returns {Promise<Object>} - Result of the update
 */
export async function updatePreset(presetId: string, updates: { preset_name?: string; description?: string; character?: Character; tags?: string[] }) {
    try {
        const { preset_name, description, character, tags } = updates;
        const updateData: any = {};

        // Only include fields that are provided
        if (preset_name !== undefined) updateData.preset_name = preset_name;
        if (description !== undefined) updateData.description = description;
        if (tags !== undefined) updateData.tags = tags;

        // If character data is provided, update the character fields
        if (character !== undefined) {
            updateData.character_name = character.base.name;
            updateData.build_points_spent = character.base.buildPointsSpent;
            updateData.build_points_remaining = character.base.buildPointsRemaining;
            updateData.max_energy = character.base.maxEnergy;
            updateData.max_hit_points = character.base.maxHitPoints;
            updateData.movement = character.base.movement;
            updateData.dodge = character.skills?.dodge || 0;
            updateData.parry = character.skills?.parry || 0;

            // Stats
            updateData.str = character.base.str;
            updateData.dex = character.base.dex;
            updateData.con = character.base.con;
            updateData.int = character.base.int;
            updateData.foc = character.base.foc;
            updateData.cha = character.base.cha;
        }

        const { data, error } = await supabase.from("character_presets").update(updateData).eq("id", presetId).select().single();

        if (error) {
            console.error("Error updating preset:", error);
            return { success: false, error };
        }

        // If character data was provided, also update the related tables
        if (character !== undefined) {
            // Delete existing related data
            await Promise.all([
                supabase.from("preset_skills").delete().eq("preset_id", presetId),
                supabase.from("preset_magic_schools").delete().eq("preset_id", presetId),
                supabase.from("preset_spells").delete().eq("preset_id", presetId),
                supabase.from("preset_flaws").delete().eq("preset_id", presetId),
                supabase.from("preset_attacks").delete().eq("preset_id", presetId),
                supabase.from("preset_passives").delete().eq("preset_id", presetId),
            ]);

            // Re-insert updated data
            // Save skills
            if (character.skills && character.skills.skills.length > 0) {
                const skillsToInsert = character.skills.skills.map((skill: Skill) => ({
                    preset_id: presetId,
                    skill_name: skill.name,
                    skill_level: skill.level,
                    description: skill.description || "",
                }));
                await supabase.from("preset_skills").insert(skillsToInsert);
            }

            // Save magic schools
            if (character.magic.magicSchools && character.magic.magicSchools.length > 0) {
                const schoolsToInsert = character.magic.magicSchools.map((school: MagicSchool) => ({
                    preset_id: presetId,
                    name: school.name,
                    description: school.description || "",
                }));
                await supabase.from("preset_magic_schools").insert(schoolsToInsert);
            }

            // Save spells
            if (character.magic.spells && character.magic.spells.length > 0) {
                const spellsToInsert = character.magic.spells.map((spell: Spell) => ({
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
                await supabase.from("preset_spells").insert(spellsToInsert);
            }

            // Save flaws
            if (character.abilities.flaws && character.abilities.flaws.length > 0) {
                const flawsToInsert = character.abilities.flaws.map((flaw: Flaw) => ({
                    preset_id: presetId,
                    name: flaw.name,
                    description: flaw.description || "",
                    severity: flaw.severity,
                }));
                await supabase.from("preset_flaws").insert(flawsToInsert);
            }

            // Save attacks
            if (character.abilities.attacks && character.abilities.attacks.length > 0) {
                const attacksToInsert = character.abilities.attacks.map((attack: Attack) => ({
                    preset_id: presetId,
                    name: attack.name,
                    description: attack.description || "",
                    build_point_cost: attack.buildPointCost,
                    energy_cost: attack.energyCost,
                }));
                await supabase.from("preset_attacks").insert(attacksToInsert);
            }

            // Save passives
            if (character.abilities.passives && character.abilities.passives.length > 0) {
                const passivesToInsert = character.abilities.passives.map((passive: Passive) => ({
                    preset_id: presetId,
                    name: passive.name,
                    description: passive.description || "",
                    build_point_cost: passive.buildPointCost,
                }));
                await supabase.from("preset_passives").insert(passivesToInsert);
            }
        }

        return { success: true, data };
    } catch (error) {
        console.error("Unexpected error in updatePreset:", error);
        return { success: false, error };
    }
}
