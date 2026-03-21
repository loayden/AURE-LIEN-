import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const DRAFTS_KEY_PREFIX = 'drafts:';

export async function getDraftsJson(): Promise<Record<string, any>> {
  try {
    const allDrafts = await redis.hgetall('drafts');
    return allDrafts || {};
  } catch (error) {
    console.error('❌ Error reading drafts from Redis:', error instanceof Error ? error.message : String(error));
    return {};
  }
}

export async function setDraftsJson(drafts: Record<string, any>): Promise<void> {
  try {
    // Clear existing drafts
    await redis.del('drafts');
    
    // Set new drafts using HSET (hash set)
    if (Object.keys(drafts).length > 0) {
      const flatDrafts: Record<string, string> = {};
      for (const [key, value] of Object.entries(drafts)) {
        flatDrafts[key] = JSON.stringify(value);
      }
      await redis.hset('drafts', flatDrafts);
    }
    
    console.log('✅ Drafts saved to Redis successfully');
  } catch (error) {
    console.error('❌ Failed to write drafts to Redis:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function getUserDraft(userId: string): Promise<any | null> {
  try {
    const draftJson = await redis.hget('drafts', userId);
    if (!draftJson) return null;
    return JSON.parse(draftJson as string);
  } catch (error) {
    console.error(`❌ Error fetching draft for user ${userId}:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

export async function saveUserDraft(userId: string, draft: { items: any[]; form: Record<string, unknown> }): Promise<void> {
  try {
    const draftWithTimestamp = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    await redis.hset('drafts', { [userId]: JSON.stringify(draftWithTimestamp) });
    console.log(`✅ Draft saved for user ${userId}`);
  } catch (error) {
    console.error(`❌ Error saving draft for user ${userId}:`, error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function deleteUserDraft(userId: string): Promise<void> {
  try {
    await redis.hdel('drafts', userId);
    console.log(`✅ Draft deleted for user ${userId}`);
  } catch (error) {
    console.error(`❌ Error deleting draft for user ${userId}:`, error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function clearAllDrafts(): Promise<void> {
  try {
    await redis.del('drafts');
    console.log('✅ All drafts cleared from Redis');
  } catch (error) {
    console.error('❌ Error clearing all drafts:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}