import { and, eq, inArray, notInArray, sql } from "drizzle-orm"
import { db, tables } from "~/server/database"
import { Roles as Role, UserRoleEnum } from "~/server/database/schema"
import { listToBoolRecordWithBasis } from "~/utils/BoolRecord"

export default eventHandler(async (event) => {
    const userId = getRouteParamInt(event, 'id')
    const body = await readBody<{ roles: Role[] }>(event)
    const validatedRoles: Record<Role, boolean> = listToBoolRecordWithBasis(
        UserRoleEnum.enumValues,
        body.roles
    )
    const currentRoles = await rolesById(userId)
    const toAdd: Role[] = UserRoleEnum.enumValues
        .filter(role => validatedRoles[role] && !currentRoles.some(r => r.role === role))
    const toRemain = currentRoles.filter(role => validatedRoles[role.role])
    const toRemove: Role[] = currentRoles.filter(role => !validatedRoles[role.role])
        .map(r => r.role)

    await db.transaction(async () => {
        console.log('roles to remove', toRemove)
        const conditions = [eq(tables.userRole.userId, userId)]
        if (toRemove.length > 0) {
            // dont add if empty
            conditions.push(inArray(tables.userRole.role, toRemove))
        }
        if (toRemain.length > 0) {
            // dont add if empty
            conditions.push(notInArray(tables.userRole.role, toRemain.map(r => r.role)))
        }
        await db.delete(tables.userRole).where(and(...conditions))
        if (toAdd.length > 0) {
            console.log('roles to add', toAdd)
            await db.insert(tables.userRole).values(
                toAdd.map(role => ({
                    userId,
                    role: role
                }))
            )
        } else {
            console.log('no roles to add')
        }
    })
})
