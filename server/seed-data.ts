import { type InsertPark } from "@shared/schema";
import { allNationalParks } from "./all-national-parks";

// All 63 US National Parks with Wikipedia images and descriptions
export const nationalParksData: InsertPark[] = allNationalParks.map(park => ({
  ...park,
  eloRating: 1500,
}));
