import { promises as fs } from "fs";
import path from "path";

// Use the same data directory as your order storage
const DATA_DIR = path.join(process.cwd(), ".data");
const DRAFTS_FILE = path.join(DATA_DIR, "drafts.json");

/**
 * Ensure the data directory exists
 */
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create data directory:", error);
    throw error;
  }
}

/**
 * Read all checkout drafts from file
 */
export async function getDraftsJson(): Promise<Record<string, any>> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DRAFTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet or is invalid - return empty
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("Drafts file doesn't exist yet, returning empty object");
      return {};
    }
    console.error("Error reading drafts file:", error);
    return {};
  }
}

/**
 * Write all checkout drafts to file
 */
export async function setDraftsJson(drafts: Record<string, any>): Promise<void> {
  try {
    await ensureDataDir();
    const jsonString = JSON.stringify(drafts, null, 2);
    await fs.writeFile(DRAFTS_FILE, jsonString, "utf-8");
    console.log("✅ Drafts saved successfully");
  } catch (error) {
    console.error("Failed to write drafts file:", error);
    throw error;
  }
}

/**
 * Get a specific user's draft
 */
export async function getUserDraft(userId: string): Promise<any | null> {
  try {
    const drafts = await getDraftsJson();
    return drafts[userId] || null;
  } catch (error) {
    console.error(`Error fetching draft for user ${userId}:`, error);
    return null;
  }
}

/**
 * Save a specific user's draft
 */
export async function saveUserDraft(
  userId: string,
  draft: { items: any[]; form: Record<string, unknown> }
): Promise<void> {
  try {
    const drafts = await getDraftsJson();
    drafts[userId] = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    await setDraftsJson(drafts);
  } catch (error) {
    console.error(`Error saving draft for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Delete a specific user's draft
 */
export async function deleteUserDraft(userId: string): Promise<void> {
  try {
    const drafts = await getDraftsJson();
    delete drafts[userId];
    await setDraftsJson(drafts);
    console.log(`✅ Draft deleted for user ${userId}`);
  } catch (error) {
    console.error(`Error deleting draft for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Clear all drafts (be careful with this!)
 */
export async function clearAllDrafts(): Promise<void> {
  try {
    await setDraftsJson({});
    console.log("✅ All drafts cleared");
  } catch (error) {
    console.error("Error clearing all drafts:", error);
    throw error;
  }
}