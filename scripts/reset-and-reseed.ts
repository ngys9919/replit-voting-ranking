import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { parks, votes } from "../shared/schema";
import { nationalParksData } from "../server/seed-data";
import { randomUUID } from "node:crypto";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function resetAndReseed() {
  console.log("🗑️  Clearing existing data...");
  
  // Delete all votes first (foreign key constraint)
  await db.delete(votes);
  console.log("   Deleted all votes");
  
  // Delete all parks
  await db.delete(parks);
  console.log("   Deleted all parks");
  
  console.log("\n🌲 Seeding database with 63 National Parks...");
  
  // Insert all 63 parks
  const parksToInsert = nationalParksData.map(park => ({
    ...park,
    id: randomUUID(),
  }));
  
  await db.insert(parks).values(parksToInsert);
  
  console.log(`✅ Successfully seeded ${parksToInsert.length} parks!`);
  console.log("\nAll parks now have Wikipedia images and descriptions.");
}

resetAndReseed()
  .then(() => {
    console.log("\n✨ Database reset complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  });
