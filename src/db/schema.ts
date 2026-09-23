import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const mushrooms = sqliteTable("mushrooms", {
  id: text("id").primaryKey(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  name: text("name"),
  area: text("area"),
  plusCode: text("plusCode"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  notes: text("notes"),
  photoPath: text("photoPath"), // Used as the preview thumbnail
  gallery: text("gallery", { mode: "json" }), // JSON array of strings
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
