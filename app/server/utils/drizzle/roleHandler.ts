import { getToken } from "#auth"
import { Roles } from "~/server/database/schema"
import { defineWrappedResponseHandler } from "."
import type { EventHandler, EventHandlerRequest } from 'h3'
import { db, tables } from "~/server/database"
import { eq } from "drizzle-orm"

export function rolesById(id: number) {
    return db.query.userRole.findMany({
        where: eq(tables.userRole.userId, id),
    })
}

export function hasRoles(expected: Roles[], actual: Roles[]) {
    return expected.some(role => actual.includes(role))
}

export const roleHandler = <T extends EventHandlerRequest, D>(
    requiredRoles: Roles[],
    handler: EventHandler<T, D>
): EventHandler<T, D> =>
    eventHandler<T>(async event => {
        try {
          //check roles before the route handler
          const auth = (await getToken({ event: event }))!
          const result = await rolesById(auth.id);
          const roles = result.map(r => r.role)
          if (!hasRoles(requiredRoles, roles)) {
            throw createError({
                statusCode: 403,
                statusMessage: "Forbidden"
            })
        }
        const response = await handler(event)
          // do something after the route handler
          return response
        } catch (err) {
          // Error handling
          return { err }
    }
})
