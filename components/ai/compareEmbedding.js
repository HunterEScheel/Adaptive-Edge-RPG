import * as FileSystem from "expo-file-system";
import OpenAI from "openai";
import { Platform } from "react-native";
import embeddingDatabase from "../../services/embeddingDatabase";

// Store reference to the OpenAI client
let openaiClient = null;

// Function to initialize or reinitialize OpenAI with new API key
export const initializeOpenAI = (apiKey) => {
    if (!apiKey) {
        console.warn('OpenAI API key not provided');
        return null;
    }
    
    openaiClient = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    });
    
    return openaiClient;
};

// Export a getter function for the OpenAI client
export const getOpenAI = () => {
    if (!openaiClient) {
        console.warn('OpenAI not initialized. Please configure API settings.');
    }
    return openaiClient;
};

const outputFile = "embeddings.csv";

function cosineSimilarity(a, b) {
    let dot = 0.0,
        normA = 0.0,
        normB = 0.0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Load embeddings from file - used for characters
async function loadEmbeddingsFromFile(file) {
    try {
        let content;

        if (Platform.OS === "web") {
            // For web environment, this is a fallback that will likely need adjustment
            console.warn("File reading on web not fully implemented");
            return [];
        } else {
            // For native platforms
            const fileInfo = await FileSystem.getInfoAsync(file);
            if (!fileInfo.exists) {
                console.warn(`File ${file} does not exist`);
                return [];
            }
            content = await FileSystem.readAsStringAsync(file);
        }

        const lines = content.split("\n").filter(Boolean);
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            // skip header
            const [skill, embeddingStr] = lines[i].split(/,(.+)/); // split only on first comma
            if (!skill || !embeddingStr) continue;
            const embedding = embeddingStr.replace(/"/g, "").split(" ").map(Number);
            data.push({ skill, embedding });
        }
        return data;
    } catch (error) {
        console.error("Error loading embeddings from file:", error);
        return [];
    }
}

// Load embeddings from database - used for skills
async function loadEmbeddingsFromDatabase() {
    // Initialize and get embeddings from the database service
    await embeddingDatabase.initialize();
    return await embeddingDatabase.getEmbeddings();
}

export async function getEmbedding(text) {
    const openai = getOpenAI();
    if (!openai) {
        throw new Error('OpenAI not initialized. Please configure API settings.');
    }
    
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}

/**
 * Find the top 10 matching skills for a given input word
 * @param {string} inputWord - The input word to find matches for
 * @param {boolean} useCharacterFile - Whether to use character file (true) or database (false)
 * @returns {Array} - Array of objects with skill name and similarity score
 */
export async function findMatchingSkills(inputWord, useCharacterFile = false) {
    try {
        // Get input embedding
        const inputEmbedding = await getEmbedding(inputWord);
        if (!inputEmbedding) {
            console.warn("Failed to get embedding for input word");
            return [];
        }

        // Load embeddings from appropriate source
        let allEmbeddings;
        if (useCharacterFile) {
            allEmbeddings = await loadEmbeddingsFromFile(outputFile);
        } else {
            allEmbeddings = await loadEmbeddingsFromDatabase();
        }

        // Process embeddings in smaller batches to avoid memory issues
        const batchSize = 50;
        const matches = [];

        for (let i = 0; i < allEmbeddings.length; i += batchSize) {
            const batch = allEmbeddings.slice(i, i + batchSize);

            for (const { skill, embedding } of batch) {
                if (!embedding || embedding.length !== inputEmbedding.length) continue;
                const sim = cosineSimilarity(inputEmbedding, embedding);

                // Track all matches with at least 35% similarity
                if (sim > 0.35) {
                    matches.push({ skill, similarity: sim });
                }
            }
        }

        // Return top 10 matches
        return matches.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
    } catch (error) {
        console.error("Error finding matching skills:", error);
        return [];
    }
}

// Test function for debugging in React Native
export async function testEmbeddingComparison(word, useCharFile = false) {
    try {
        const matches = await findMatchingSkills(word, useCharFile);
        const topMatches = matches.slice(0, 10);

        return topMatches;
    } catch (error) {
        console.error("Error in embedding comparison test:", error);
        return [];
    }
}

// No need to run a CLI main function in React Native
