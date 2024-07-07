import { and, eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"

/**
 * dentist.id => dentist
 */
export default eventHandler(async (event) => {
    const dentistId = getRouteIntParam(event, 'id')
    const dentist = await db.select()
        .from(tables.user)
        .where(
            and(
                eq(tables.user.id, dentistId),
                eq(tables.user, 'doctor')
            ))
    return dentist
})
