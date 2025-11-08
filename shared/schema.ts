import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SEO Analysis Types
export const tagStatusSchema = z.enum(["optimal", "present", "missing", "warning"]);
export type TagStatus = z.infer<typeof tagStatusSchema>;

export const metaTagSchema = z.object({
  name: z.string(),
  value: z.string().optional(),
  status: tagStatusSchema,
  characterCount: z.number().optional(),
  recommendation: z.string(),
  optimalRange: z.string().optional(),
});

export const seoAnalysisSchema = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string(),
  essentialTags: z.array(metaTagSchema),
  openGraphTags: z.array(metaTagSchema),
  twitterTags: z.array(metaTagSchema),
  technicalTags: z.array(metaTagSchema),
  ogImage: z.string().optional(),
  twitterImage: z.string().optional(),
});

export type MetaTag = z.infer<typeof metaTagSchema>;
export type SEOAnalysis = z.infer<typeof seoAnalysisSchema>;
