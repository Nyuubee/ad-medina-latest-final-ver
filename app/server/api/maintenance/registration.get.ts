import { db } from "~/server/database"

export default eventHandler(async(event) => {
    const config = await db.query.config.findFirst({
        columns: {
            USER_REGISTRATION_ENABLED: true,
        }
    })

    return config?.USER_REGISTRATION_ENABLED
})
