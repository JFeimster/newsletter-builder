import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const publicationProjects = sqliteTable("publication_projects", {
  id: text("id").primaryKey(),
  ownerEmail: text("owner_email").notNull(),
  name: text("name").notNull(),
  dataJson: text("data_json").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, table => ({
  ownerProject: uniqueIndex("publication_projects_owner_id_idx").on(table.ownerEmail, table.id),
}));

export const publicationVersions = sqliteTable("publication_versions", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  ownerEmail: text("owner_email").notNull(),
  version: integer("version").notNull(),
  dataJson: text("data_json").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
