import { db } from "~/server/database"

export default eventHandler(async (event) => {
    const userId = getRouteParamInt(event, 'id')
    const roles = await db.query.userRole.findMany({
        where(userRole, {eq}) {
            return eq(userRole.userId, userId)
        }
    })
    return roles
})
