## Setup
1. Install node js 20 or higher https://nodejs.org/en/download/current
2. open a terminal
3. run `corepack enable pnpm`
3. clone this repo
4. Install dependencies: `pnpm i`
5. This is a monorepo using https://pnpm.io/workspaces
6. Setup environment variables
    1. make a copy of [.env.example](./app/.env.example).
    2. rename your copy to .env
    3. NEVER add this file to git
7. Do [database setup](#database-setup)

## Development
1. app/ contains the actual app
2. crypto/ contains cryptographic utilities
3. cd into crypto: `cd crypto` (on first run, you must run this, unless you change anything crypto, you might not need to run this again)
4. run `pnpm dev`
5. open another terminal
6. cd into app: `cd app`
7. run: `pnpm dev`

## Framework Guides
1. https://vuejs.org/guide/introduction.html
2. https://nuxt.com/docs/getting-started/introduction
    ### Styling
    3. https://tailwindcss.com/docs/utility-first
    4. https://daisyui.com/docs/use/
    ### Backend
    5. https://orm.drizzle.team/docs/overview
    ### Form Creation
    6. https://formkit.com/getting-started/what-is-formkit

## Notes for Production builds:
* TODO

## Directory Structure of App folder
* Following Nuxt's directory structure, some of the app's modules are split:
### Example for the auth module:
* `composables/auth` contains authentication related composable functions
* `components/auth` contains authentication related components
* `utils/auth` contains authentication related utilities
* Example Usage:
    ```ts
    import { mouth } from '~/utils/peri/mouth'
    ```

## Packages
* [__crypto__](./crypto/): A package for cryptographic utilities

https://nuxt.com/docs/guide/directory-structure/env
## Database setup
1. Setup [postgresql](https://www.postgresql.org/download/)
2. Afterwards, go to [./app](./app/), then create a [.env](https://nuxt.com/docs/guide/directory-structure/env) file with the ff variables:
    ```bash
    DATABASE_URL=postgresql:///postgres?host=localhost
    # depending on your setup, host may be 127.0.0.1 or localhost
    DATABASE_URL=postgresql:///postgres?host=127.0.0.1
    ```
3. OPTIONAL: By default we use the postgres admin account. you may change your user:
    1. Admin credentials:
        * username: postgres
        * password: postgres
    2. Create a database user:
        1. Open a terminal.
        2. Run `psql` to login using the default admin account. This will drop you in postgres' repl.
            ```bash
            psql
            ```
        3. Create a database user:
            ```sql
            CREATE USER username WITH PASSWORD 'password' CREATEDB REPLICATION;
            ```
            Note: must use single quotes for the password
        4. Exit the psql shell w/:
            ```bash
            \q
            ```
4. Learn [Drizzle](https://orm.drizzle.team/docs/overview)

5. Run database migration:
    ```bash
    # cd app # make sure you're in the app folder
    pnpm db:generate
    ```
6. Create the database:
    ```bash
    # cd app # make sure you're in the app folder
    pnpm db:push
    ```

7. You can view the database using [Drizzle Studio](https://orm.drizzle.team/docs/studio)
    ```bash
    # cd app # make sure you're in the app folder
    pnpm db:studio
    ```
    open https://local.drizzle.studio
8. Repeat 5 then 6 whenever you make changes to the database schema

    9. For presentation purposes:
    1. head over to https://vercel.com/ad-medina-clinic/clinic-workspace/stores/postgres/store_LGdmEMvPLWg02ovC/data
    ```sql
    -- In vercel, to delete all tables:
    -- https://stackoverflow.com/a/21247009
    drop schema public cascade;
    create schema public;
    ```
## VSCode
### Extensions
* Install the extensions found in .vscode/extensions.json
### Tasks
* Run the EVERYTHING task by: 
    * Clicking: VSCode's topbar > Terminal > Run Task > Everything
    * or: `Ctrl+Shift+B` then select `Everything`
* If you're using NixOS like me, run `nix:db` first
## Notes
* Default fonts are in default.vue
