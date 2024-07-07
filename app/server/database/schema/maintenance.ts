import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import {type HTTPMethod} from "h3"
export const config = pgTable("maintenance",{
    id: serial("id").primaryKey(),
    USER_REGISTRATION_ENABLED: boolean("user_registration_enabled").notNull().default(true),
    RESET_VERIFICATION_TOKEN_VALIDITY_IN_SECONDS:  integer("reset_verification_token_validity_in_seconds").notNull().default(300), // 5mins,
    LOGGING_ENABLED: boolean("logging_enabled").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
export const configRelations = relations(config,({one}) => ({
    // nothing
}))

export const banlist = pgTable("banlist",{
    id: serial("id").primaryKey(),
    userId: serial("user_id").references(() => user.id).unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const banlist_relations = relations(banlist,({one}) => ({
    user: one(user, {relationName: "user", fields: [banlist.userId], references: [user.id]})
}))
export const user_actions = pgTable("user_actions",{
    id: serial("id").primaryKey(),
    userId: serial("user_id").references(() => user.id),
    method: text<'method', string, [HTTPMethod,...HTTPMethod[]]>("method", {enum: ['GET', 'CONNECT','DELETE','HEAD','OPTIONS','PATCH','POST','PUT','TRACE' ] }),
    path: text("path").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const user_actions_relations = relations(user_actions,({one}) => ({
    user: one(user, {relationName: "user", fields: [user_actions.userId], references: [user.id]})
}))
 