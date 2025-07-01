// Load environment variables
require("dotenv").config();

const fs = require("fs");
const { OpenAI } = require("openai");

// Create a simple Supabase client just for this script
const { createClient } = require("@supabase/supabase-js");

// Validate environment variables
const requiredEnvVars = {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_SERVICE_KEY: process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY,
    EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
};

const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    console.error("\n💡 Please create a .env file in the project root with these variables.");
    console.error("   You can copy .env.example and fill in your actual values.");
    process.exit(1);
}

// Initialize Supabase client with service role key to bypass RLS
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY);

const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

// Read skills from CSV (one skill per line)
const inputCsv = "./components/ai/skills.csv";
const skills = fs
    .readFileSync(inputCsv, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0); // Remove empty lines

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAllEmbeddings() {
    // Clear existing data from the table
    try {
        const { error: deleteError } = await supabase.from("skill_embeddings").delete().neq("id", 0); // This deletes all rows

        if (deleteError) {
            console.error("Error clearing database:", deleteError);
        }
    } catch (error) {
        console.error("Error during database clearing:", error);
    }

    // Process each skill
    for (const skill of skills) {
        try {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: skill,
            });

            const embedding = response.data[0].embedding;

            // Insert into Supabase
            const { error } = await supabase.from("skill_embeddings").insert({
                skill_name: skill,
                embedding_vector: embedding,
            });

            if (error) {
                console.error(`Error saving embedding to database for ${skill}:`, error);
            }
        } catch (err) {
            console.error(`Error embedding ${skill}:`, err);
        }
        await sleep(500); // Prevent rate limiting
    }

    // Export to CSV for offline use
    await exportToCSV();
}

async function exportToCSV() {
    const outputFile = "./embeddings.csv";
    try {
        // Fetch all embeddings from the database
        const { data, error } = await supabase.from("skill_embeddings").select("skill_name, embedding_vector");

        if (error) {
            console.error("Error fetching embeddings for CSV export:", error);
            return;
        }

        // Write CSV header
        fs.writeFileSync(outputFile, "Skill,Embedding\n");

        // Write each row
        for (const item of data) {
            const embeddingStr = '"' + item.embedding_vector.join(" ") + '"';
            fs.appendFileSync(outputFile, `${item.skill_name},${embeddingStr}\n`);
        }
    } catch (error) {
        console.error("Error during CSV export:", error);
    }
}

runAllEmbeddings();
