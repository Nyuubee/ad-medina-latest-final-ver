import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const supplies = pgTable("supplies", {
    id: serial("id").primaryKey(),
    categoryId: serial("category_id").references(() => supplyCategories.id),
    supplierId: serial("supplier_id").references(() => suppliers.id),
    name: text("name").notNull(),
    description: text("description"),
    quantity: integer("quantity").notNull(),
    unit: text("unit").notNull(),
    criticalLevel: integer("critical_level").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const suppliesRelations = relations(supplies, ({ one, many }) => ({
    category: one(supplyCategories, { relationName: "category", fields: [supplies.categoryId], references: [supplyCategories.id] }),
    supplier: one(suppliers, { relationName: "supplier", fields: [supplies.supplierId], references: [suppliers.id] }),
    supplyUsage: many(supplyUsage),
    
}))

export const supplyCategories = pgTable("supply_categories", {
    id: serial("id").primaryKey(),
    name: text("name").unique().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const supplyCategoriesRelations = relations(supplyCategories, ({ many }) => ({
    supplies: many(supplies),

}))

export const suppliers = pgTable("suppliers", {
    id: serial("id").primaryKey(),
    name: text("name").unique().notNull(),
    // address
    address: text("address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const suppliersRelations = relations(suppliers, ({ many }) => ({
    supplies: many(supplies),
}))

export const supplyUsage = pgTable("supply_usage", {
    id: serial("id").primaryKey(),
    supplyId: serial("supply_id").references(() => supplies.id),
    quantityUsed: integer("quantityUsed").notNull(),
    userId: serial("user_id").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const supplyUsageRelations = relations(supplyUsage, ({ one }) => ({
    supply: one(supplies, { relationName: "supply", fields: [supplyUsage.supplyId], references: [supplies.id] }),
    user: one(user, { relationName: "user", fields: [supplyUsage.userId], references: [user.id] }),
}))
