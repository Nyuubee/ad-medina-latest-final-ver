import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"

export default eventHandler(async (ev) => {
    const  userId = getRouteParamInt(ev, 'id')
    // Don't change: createdAt
    const {createdAt,...body} = await readBody<typeof tables.user.$inferInsert>(ev)
    const result = await db.update(tables.user).set({
        ...body,
        updatedAt: new Date(),
    }).where(
        eq(tables.user.id, userId)
    ).catch(onUniqueConstraintError({
        statusMessage: "Email is taken"
    }))

    return {
        success:true,
    }
})
