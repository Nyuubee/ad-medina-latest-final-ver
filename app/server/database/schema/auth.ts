import { serial, text, pgTable } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { banlist } from "./maintenance";

// SQL for sample:
/**
 * Patient:
 * INSERT INTO user (first_name, last_name, role, email, phone, sex)
 * VALUES ('John', 'Doe', 'patient', 'JohnDoe@gmail.com', '091234567', 'male');
 *
 * Doctor:
 * INSERT INTO user (first_name, last_name, role, email, phone, sex)
 * VALUES ('Jane', 'Doe', 'doctor', 'JaneDoe@gmail.com', '091234567', 'female');
 *
 */

export const auth = pgTable("auth", {
  userId: serial("user_id").primaryKey().references(() => user.id),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
});

export const authRelations = relations(auth, ({ one }) => ({
  user: one(user, { fields: [auth.userId], references: [user.id] }),
  banlist: one(banlist, { fields: [auth.userId], references: [banlist.userId] }),
}));
