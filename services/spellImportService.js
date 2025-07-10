const { supabase } = require("./supabaseNode");
const fs = require("fs");
const path = require("path");

// D&D 5e API base URL
const DND_API_BASE = "https://www.dnd5eapi.co/api/2014";

// Delay between API calls to avoid rate limiting (in milliseconds)
const API_DELAY = 100;

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Transform spell name to API format (lowercase, replace spaces with hyphens)
const transformSpellName = (spellName) => {
    return spellName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/'/g, "")
        .replace(/[^\w-]/g, "");
};

// Fetch spell data from D&D 5e API
async function fetchSpellFromAPI(spellName) {
    const transformedName = transformSpellName(spellName);
    const url = `${DND_API_BASE}/spells/${transformedName}`;

    try {
        console.log(`Fetching spell: ${spellName} (${transformedName})`);
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Failed to fetch ${spellName}: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${spellName}:`, error);
        return null;
    }
}

// Transform API data to match our database schema
function transformSpellData(apiData, originalSpellName, spellLevel, school) {
    if (!apiData) return null;

    return {
        // Basic info
        name: originalSpellName, // Use original name from CSV
        level: spellLevel || apiData.level || 0,
        school: school || apiData.school?.name || "Unknown",

        // API data
        api_index: apiData.index,
        description: apiData.desc ? apiData.desc.join("\n\n") : "",
        higher_level: apiData.higher_level ? apiData.higher_level.join("\n\n") : null,
        range: apiData.range || "",
        components: apiData.components || [],
        duration: apiData.duration || "",
        concentration: apiData.concentration || false,

        // Damage info
        damage_type: apiData.damage?.damage_type?.name || null,
        damage_at_slot_level: apiData.damage?.damage_at_slot_level || null,

        // Healing info
        healing_at_slot_level: apiData.healing_at_slot_level || null,

        // Area of effect
        area_of_effect_type: apiData.area_of_effect?.type || null,
        area_of_effect_size: apiData.area_of_effect?.size || null,

        // DC info
        dc_type: apiData.dc?.dc_type?.name || null,
        dc_success: apiData.dc?.dc_success || null,

        // Attack info
        attack_type: apiData.attack_type || null,

        // Metadata
        updated_at: new Date().toISOString(),
    };
}

// Save spell to database
async function saveSpellToDatabase(spellData) {
    try {
        const { data, error } = await supabase.from("dnd_spells").upsert(spellData, {
            onConflict: "name",
            returning: "minimal",
        });

        if (error) {
            console.error(`Error saving spell ${spellData.name}:`, error);
            return false;
        }

        console.log(`Successfully saved: ${spellData.name}`);
        return true;
    } catch (error) {
        console.error(`Exception saving spell ${spellData.name}:`, error);
        return false;
    }
}

// Read CSV file and return spell list
async function readSpellsFromCSV(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const lines = fileContent.split("\n").filter((line) => line.trim());

        if (lines.length === 0) {
            throw new Error("CSV file is empty");
        }

        // Parse header
        const header = lines[0].split(",").map((col) => col.trim());
        const levelIndex = header.findIndex((col) => col.includes("Level"));
        const nameIndex = header.findIndex((col) => col.includes("Name"));
        const schoolIndex = header.findIndex((col) => col.includes("School"));

        if (nameIndex === -1) {
            throw new Error("Could not find spell name column in CSV");
        }

        // Parse data rows
        const spells = [];
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(",").map((col) => col.trim());

            if (row[nameIndex]) {
                spells.push({
                    level: levelIndex !== -1 ? parseInt(row[levelIndex]) || 0 : 0,
                    name: row[nameIndex],
                    school: schoolIndex !== -1 ? row[schoolIndex] : "Unknown",
                });
            }
        }

        console.log(`Read ${spells.length} spells from CSV`);
        return spells;
    } catch (error) {
        console.error("Error reading CSV file:", error);
        throw error;
    }
}

// Main import function
async function importSpellsFromCSV(csvFilePath) {
    console.log("Starting spell import process...");

    try {
        // Read spells from CSV
        const spells = await readSpellsFromCSV(csvFilePath);

        // Statistics
        let successCount = 0;
        let failCount = 0;
        let skipCount = 0;

        // Process each spell
        for (let i = 0; i < spells.length; i++) {
            const spell = spells[i];
            console.log(`\nProcessing ${i + 1}/${spells.length}: ${spell.name}`);

            // Fetch from API
            const apiData = await fetchSpellFromAPI(spell.name);

            if (!apiData) {
                console.log(`Skipping ${spell.name} - API fetch failed`);
                skipCount++;
                await delay(API_DELAY);
                continue;
            }

            // Transform data
            const transformedData = transformSpellData(apiData, spell.name, spell.level, spell.school);

            if (!transformedData) {
                console.log(`Skipping ${spell.name} - Data transformation failed`);
                skipCount++;
                await delay(API_DELAY);
                continue;
            }

            // Save to database
            const saved = await saveSpellToDatabase(transformedData);

            if (saved) {
                successCount++;
            } else {
                failCount++;
            }

            // Delay to avoid rate limiting
            await delay(API_DELAY);
        }

        // Final report
        console.log("\n=== Import Complete ===");
        console.log(`Total spells: ${spells.length}`);
        console.log(`Successfully imported: ${successCount}`);
        console.log(`Failed to save: ${failCount}`);
        console.log(`Skipped (API fetch failed): ${skipCount}`);

        return {
            total: spells.length,
            success: successCount,
            failed: failCount,
            skipped: skipCount,
        };
    } catch (error) {
        console.error("Import process failed:", error);
        throw error;
    }
}

// Function to import a single spell (useful for testing or individual imports)
async function importSingleSpell(spellName, level = 0, school = "Unknown") {
    try {
        const apiData = await fetchSpellFromAPI(spellName);

        if (!apiData) {
            throw new Error(`Failed to fetch spell data for: ${spellName}`);
        }

        const transformedData = transformSpellData(apiData, spellName, level, school);

        if (!transformedData) {
            throw new Error(`Failed to transform spell data for: ${spellName}`);
        }

        const saved = await saveSpellToDatabase(transformedData);

        if (!saved) {
            throw new Error(`Failed to save spell to database: ${spellName}`);
        }

        return transformedData;
    } catch (error) {
        console.error(`Error importing spell ${spellName}:`, error);
        throw error;
    }
}

// Function to check if a spell exists in the database
async function spellExists(spellName) {
    try {
        const { data, error } = await supabase.from("dnd_spells").select("name").eq("name", spellName).single();

        if (error && error.code !== "PGRST116") {
            // PGRST116 = no rows returned
            console.error("Error checking spell existence:", error);
            return false;
        }

        return !!data;
    } catch (error) {
        console.error("Exception checking spell existence:", error);
        return false;
    }
}

// Export functions
module.exports = {
    importSpellsFromCSV,
    importSingleSpell,
    spellExists,
};
