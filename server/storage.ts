import { type Park, type InsertPark, type Vote, type InsertVote, parks, votes } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, desc, sql } from "drizzle-orm";
import ws from "ws";

// Configure WebSocket for Neon in Node.js environment
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

export interface IStorage {
  // Parks methods
  getAllParks(): Promise<Park[]>;
  getParkById(id: string): Promise<Park | undefined>;
  createPark(park: InsertPark): Promise<Park>;
  updateParkRating(id: string, newRating: number): Promise<void>;
  getRandomMatchup(): Promise<{ park1: Park; park2: Park } | null>;
  
  // Votes methods
  createVote(vote: InsertVote): Promise<Vote>;
  getRecentVotes(limit: number): Promise<Array<Vote & { winner: Park; loser: Park }>>;
  
  // Utility
  seedParks(parksData: InsertPark[]): Promise<void>;
}

export class DbStorage implements IStorage {
  async getAllParks(): Promise<Park[]> {
    const result = await db.select().from(parks).orderBy(desc(parks.eloRating));
    return result;
  }

  async getParkById(id: string): Promise<Park | undefined> {
    const result = await db.select().from(parks).where(eq(parks.id, id)).limit(1);
    return result[0];
  }

  async createPark(park: InsertPark): Promise<Park> {
    const result = await db.insert(parks).values(park).returning();
    return result[0];
  }

  async updateParkRating(id: string, newRating: number): Promise<void> {
    await db.update(parks).set({ eloRating: newRating }).where(eq(parks.id, id));
  }

  async getRandomMatchup(): Promise<{ park1: Park; park2: Park } | null> {
    // Get two random parks
    const allParks = await db.select().from(parks).orderBy(sql`RANDOM()`).limit(2);
    
    if (allParks.length < 2) {
      return null;
    }
    
    return {
      park1: allParks[0],
      park2: allParks[1],
    };
  }

  async createVote(vote: InsertVote): Promise<Vote> {
    const result = await db.insert(votes).values(vote).returning();
    return result[0];
  }

  async getRecentVotes(limit: number): Promise<Array<Vote & { winner: Park; loser: Park }>> {
    const recentVotes = await db
      .select()
      .from(votes)
      .orderBy(desc(votes.timestamp))
      .limit(limit);

    // Fetch the park details for each vote
    const votesWithParks = await Promise.all(
      recentVotes.map(async (vote) => {
        const winner = await this.getParkById(vote.winnerId);
        const loser = await this.getParkById(vote.loserId);
        
        if (!winner || !loser) {
          throw new Error("Park not found for vote");
        }
        
        return {
          ...vote,
          winner,
          loser,
        };
      })
    );

    return votesWithParks;
  }

  async seedParks(parksData: InsertPark[]): Promise<void> {
    // Check if parks already exist
    const existingParks = await db.select().from(parks).limit(1);
    
    if (existingParks.length === 0) {
      // Insert all parks
      await db.insert(parks).values(parksData);
    }
  }
}

export const storage = new DbStorage();
