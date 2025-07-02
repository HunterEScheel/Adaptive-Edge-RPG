import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { mmkvStorage, supabase } from "./supabase";

// Constants for storage keys
const OFFLINE_MODE_KEY = "@embeddings_offline_mode";
const LAST_SYNC_TIME_KEY = "@embeddings_last_sync";
const EMBEDDINGS_CACHE_KEY = "@embeddings_cache";

/**
 * Embedding Database Service
 * Provides methods to interact with skill embeddings in both online and offline modes
 */
class EmbeddingDatabaseService {
    constructor() {
        this.isOfflineMode = false;
        this.initialized = false;
        this.embeddings = [];
    }

    /**
     * Initialize the embedding service
     * Loads offline preference and cached data
     */
    async initialize() {
        if (this.initialized) return;

        // Load offline mode preference
        const offlineModeStr = await mmkvStorage.getString(OFFLINE_MODE_KEY);
        this.isOfflineMode = offlineModeStr ? JSON.parse(offlineModeStr) : false;

        this.initialized = true;
    }

    /**
     * Toggle between online and offline modes
     */
    async setOfflineMode(isOffline) {
        this.isOfflineMode = isOffline;
        await mmkvStorage.set(OFFLINE_MODE_KEY, JSON.stringify(isOffline));
    }

    /**
     * Get current mode (online/offline)
     */
    getOfflineMode() {
        return this.isOfflineMode;
    }

    /**
     * Get the last sync time
     */
    async getLastSyncTime() {
        const timeStr = await mmkvStorage.getString(LAST_SYNC_TIME_KEY);
        return timeStr ? parseInt(timeStr, 10) : null;
    }

    /**
     * Update the last sync time
     */
    async updateLastSyncTime() {
        await mmkvStorage.set(LAST_SYNC_TIME_KEY, Date.now().toString());
    }


    /**
     * Load embeddings from the bundled CSV file
     */
    async loadFromCsv() {
        try {
            // Determine the correct path to embeddings.csv based on platform
            const csvPath = Platform.OS === "web" ? "./components/ai/embeddings.csv" : `${FileSystem.documentDirectory}embeddings.csv`;

            // For native platforms, we need to ensure the file exists
            if (Platform.OS !== "web") {
                const fileInfo = await FileSystem.getInfoAsync(csvPath);

                if (!fileInfo.exists) {
                    try {
                        // Create a default empty embeddings.csv file with just a header
                        const header = "Skill,Embedding\n";
                        await FileSystem.writeAsStringAsync(csvPath, header);

                        // Log the creation of default file
                        console.log("Created default embeddings.csv file");
                    } catch (error) {
                        console.error("Error creating embeddings file:", error);
                    }
                }
            }

            // Read and parse the CSV
            const content = await FileSystem.readAsStringAsync(csvPath);
            const rows = content.split("\n");

            // Skip header row and parse the data
            const parsed = [];
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;

                // Split only on the first comma (embeddings may contain commas)
                const [skill, embeddingStr] = rows[i].split(/,(.+)/);
                if (!skill || !embeddingStr) continue;

                // Parse the embedding string (removing quotes and converting to numbers)
                const embedding = embeddingStr.replace(/"/g, "").split(" ").map(Number);

                parsed.push({ skill, embedding });
            }

            this.embeddings = parsed;

            // Cache the parsed data
            await mmkvStorage.set(EMBEDDINGS_CACHE_KEY, JSON.stringify(parsed));

            return parsed;
        } catch (error) {
            console.error("Error loading embeddings from CSV:", error);
            return [];
        }
    }

    /**
     * Sync embeddings with Supabase (pull from cloud)
     */
    async syncFromCloud() {
        try {
            console.log("Syncing embeddings from cloud...");
            const { data, error } = await supabase.from("skill_embeddings").select("skill_name, embedding_vector").order("skill_name", { ascending: true });

            if (error) {
                console.error("Error fetching embeddings from Supabase:", error);
                return this.embeddings || [];
            }

            if (data && data.length > 0) {
                // Transform the data to our expected format
                this.embeddings = data.map((item) => ({
                    skill: item.skill_name,
                    embedding: item.embedding_vector,
                }));

                // No caching - we'll fetch from cloud every time

                // Update last sync time
                await this.updateLastSyncTime();

                console.log(`Synced ${data.length} embeddings from cloud. Not storing full embeddings locally.`);
                return this.embeddings;
            }

            return this.embeddings || [];
        } catch (error) {
            console.error("Error syncing embeddings from cloud:", error);
            // Don't let this error affect the app's online status
            return this.embeddings || [];
        }
    }

    /**
     * Upload local embeddings to the cloud
     */
    async uploadToCloud() {
        try {
            if (this.isOfflineMode) {
                console.log("Device is offline, skipping upload to cloud");
                return false;
            }

            // Prepare data for Supabase
            const dataToUpload = this.embeddings.map((item) => ({
                skill_name: item.skill,
                embedding_vector: item.embedding,
            }));

            // First attempt to sign in anonymously if needed
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData?.session) {
                // No active session, try to sign in anonymously
                console.log("No active session, signing in anonymously...");
                const { error: signInError } = await supabase.auth.signInAnonymously();
                if (signInError) {
                    console.error("Error signing in anonymously:", signInError);
                    return false;
                }
            }

            // Clear existing data (use with caution) after authentication
            const { error: deleteError } = await supabase.from("skill_embeddings").delete().neq("id", 0); // This deletes all rows

            if (deleteError) {
                console.error("Error clearing existing embeddings:", deleteError);
                // If this is a permission error, let's try to work around it
                if (deleteError.code === "42501" || deleteError.message?.includes("permission denied")) {
                    console.log("Permission error when deleting. Skipping delete and trying insert directly.");
                } else {
                    return false;
                }
            }

            // Insert new data - use upsert instead of insert to avoid conflicts
            const { error: insertError } = await supabase.from("skill_embeddings").upsert(dataToUpload, { onConflict: "skill_name" });

            if (insertError) {
                console.error("Error uploading embeddings to Supabase:", insertError);
                return false;
            }

            // No caching

            // Update last sync time
            await this.updateLastSyncTime();

            return true;
        } catch (error) {
            console.error("Error uploading embeddings to cloud:", error);
            return false;
        }
    }

    /**
     * Get embeddings (always from cloud)
     */
    async getEmbeddings() {
        await this.initialize();

        // Always sync from cloud unless offline
        if (!this.isOfflineMode) {
            return this.syncFromCloud();
        }

        // If offline, return empty array (no cached data)
        return [];
    }

    /**
     * Get a specific embedding by skill name
     */
    async getEmbeddingBySkill(skillName) {
        const embeddings = await this.getEmbeddings();
        return embeddings.find((item) => item.skill === skillName);
    }
}

export default new EmbeddingDatabaseService();
