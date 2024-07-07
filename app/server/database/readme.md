## Database Schema rules
1. Both the javascript variable and the table name (the first argument of pgTable) should be __lowercase__.

2. Special database types like `enums` are still in __UpperCamelCase__. See [UserRoleEnum](./schema/user.ts#UserRoleEnum ) for an example.
3. Name table properties in __camelCase__. This will be the property name that will be used in the code.
4. Name table columns in __snake_case__. This will be the actual column name in the database.
## Example
```ts
// rule 1
export const user from pgTable('user', {
// rule 3: firstName is the table property
// rule 4: first_name is the column name
  firstName: text("first_name").notNull(),
});
```
5. Export all variables using `export * from <file>` in [schema/index.ts](./schema/index.ts) to make it easier to import them in other files via [tables](./index.ts#tables).
6. Add `created_at` and `updated_at` columns to all tables.
