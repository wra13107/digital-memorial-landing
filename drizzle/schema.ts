import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  username: varchar("username", { length: 100 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  lastName: varchar("lastName", { length: 100 }),
  firstName: varchar("firstName", { length: 100 }),
  patronymic: varchar("patronymic", { length: 100 }),
  passwordHash: text("passwordHash"),
  birthDate: timestamp("birthDate"),
  deathDate: timestamp("deathDate"),
  passwordResetToken: varchar("passwordResetToken", { length: 255 }).unique(),
  passwordResetExpiry: timestamp("passwordResetExpiry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Memorials table - stores user memorial information
 */
export const memorials = mysqlTable("memorials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  patronymic: varchar("patronymic", { length: 100 }),
  birthDate: timestamp("birthDate"),
  deathDate: timestamp("deathDate"),
  mainPhotoUrl: text("mainPhotoUrl"),
  burialPlace: text("burialPlace"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  description: text("description"),
  epitaph: text("epitaph"),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Memorial = typeof memorials.$inferSelect;
export type InsertMemorial = typeof memorials.$inferInsert;

/**
 * Gallery items table - stores photos, videos, and audio files
 */
export const galleryItems = mysqlTable("galleryItems", {
  id: int("id").autoincrement().primaryKey(),
  memorialId: int("memorialId").notNull(),
  type: mysqlEnum("type", ["photo", "video", "audio"]).notNull(),
  url: text("url").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = typeof galleryItems.$inferInsert;

/**
 * Relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  memorials: many(memorials),
}));

export const memorialsRelations = relations(memorials, ({ one, many }) => ({
  user: one(users, {
    fields: [memorials.userId],
    references: [users.id],
  }),
  galleryItems: many(galleryItems),
}));

export const galleryItemsRelations = relations(galleryItems, ({ one }) => ({
  memorial: one(memorials, {
    fields: [galleryItems.memorialId],
    references: [memorials.id],
  }),
}));