import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const qcoStatusEnum = pgEnum("qco_status", ["mandatory", "upcoming", "voluntary"]);
export const translationStatusEnum = pgEnum("translation_status", [
  "draft",
  "ai_generated",
  "in_review",
  "approved",
  "rejected",
]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "qualified", "closed"]);

export const schemes = pgTable("schemes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  shortName: varchar("short_name", { length: 40 }).notNull(),
  regulator: varchar("regulator", { length: 160 }).notNull(),
  family: varchar("family", { length: 40 }).notNull(),
  summary: text("summary").notNull(),
  countrySlugs: jsonb("country_slugs").$type<string[]>().notNull(),
});

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  region: varchar("region", { length: 80 }).notNull(),
  summary: text("summary").notNull(),
  schemeSlugs: jsonb("scheme_slugs").$type<string[]>().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  summary: text("summary").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 320 }).notNull(),
  standard: varchar("standard", { length: 120 }).notNull(),
  hsn: varchar("hsn", { length: 16 }).notNull(),
  categorySlug: varchar("category_slug", { length: 80 }).notNull(),
  qcoStatus: qcoStatusEnum("qco_status").notNull(),
  qcoSlug: varchar("qco_slug", { length: 120 }),
  testCostMin: integer("test_cost_min").notNull(),
  testCostMax: integer("test_cost_max").notNull(),
  excerpt: text("excerpt").notNull(),
  schemeSlugs: jsonb("scheme_slugs").$type<string[]>().notNull(),
  labSlugs: jsonb("lab_slugs").$type<string[]>().notNull(),
  testSlugs: jsonb("test_slugs").$type<string[]>().notNull(),
  countrySlugs: jsonb("country_slugs").$type<string[]>().notNull(),
});

export const labs = pgTable("labs", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 240 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  state: varchar("state", { length: 80 }).notNull(),
  bisCode: varchar("bis_code", { length: 32 }).notNull(),
  standardCodes: jsonb("standard_codes").$type<string[]>().notNull(),
});

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  discipline: varchar("discipline", { length: 40 }).notNull(),
  name: varchar("name", { length: 240 }).notNull(),
  standard: varchar("standard", { length: 160 }).notNull(),
  summary: text("summary").notNull(),
  productSlugs: jsonb("product_slugs").$type<string[]>().notNull(),
  labSlugs: jsonb("lab_slugs").$type<string[]>().notNull(),
});

export const translations = pgTable(
  "translations",
  {
    id: serial("id").primaryKey(),
    entityType: varchar("entity_type", { length: 40 }).notNull(),
    entityId: varchar("entity_id", { length: 180 }).notNull(),
    field: varchar("field", { length: 40 }).notNull(),
    locale: varchar("locale", { length: 8 }).notNull(),
    sourceText: text("source_text").notNull(),
    aiText: text("ai_text"),
    reviewedText: text("reviewed_text"),
    status: translationStatusEnum("status").notNull().default("draft"),
    reviewer: varchar("reviewer", { length: 80 }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uniq: uniqueIndex("translations_entity_field_locale").on(
      table.entityType,
      table.entityId,
      table.field,
      table.locale,
    ),
  }),
);

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  company: varchar("company", { length: 160 }),
  phone: varchar("phone", { length: 40 }),
  interest: varchar("interest", { length: 80 }).notNull(),
  message: text("message").notNull(),
  sourcePath: varchar("source_path", { length: 240 }),
  status: leadStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
