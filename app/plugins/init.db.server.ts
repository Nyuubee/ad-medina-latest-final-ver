import { init } from "~/server/utils/drizzle/maintenance"

// run the database initialization using a plugin once
init().then(() => {})
export default defineNuxtPlugin(async(nuxtApp) => {
    // do nothing
})
