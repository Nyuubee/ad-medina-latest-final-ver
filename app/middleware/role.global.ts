import type { RouteLocationNormalized } from "#vue-router"
import type { Roles } from "~/server/database/schema"

function unauthorized(to: RouteLocationNormalized, prefix: string, roles: Roles[], actualRoles: Record<Roles,boolean>) {
    return to.path.startsWith(prefix) && roles.some(role => actualRoles[role] == false)
}

/**
 * Implements role-based level of access
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { data } = useAuth()
    // if admin role, dont check
    const roles = listToBoolRecord(data.value?.user?.roles ?? [], true)
    if (to.path == '/') {
        if (roles.doctor) {
            return navigateTo('/dental-chart/overview')
        } else if (roles.receptionist) {
            return navigateTo('/appointments')
        } else if (roles.inventory_manager) {
            return navigateTo('/supplies')
        } else if (roles.admin) {
            return navigateTo('/admin')
        } else {
            return navigateTo('/user')
        }
        // else: unhandled
    }

    if (unauthorized(to, '/admin', ["admin"], roles)) {
        return navigateTo('/')
    }

    // allow: doctor
    if (unauthorized(to, '/dental-chart', ["doctor"], roles)) {
        return navigateTo('/')
    }

    // allow: doctor, inventory_manager to access supplies
    if (unauthorized(to, '/supplies', ["doctor", "inventory_manager"], roles)) {
        return navigateTo('/')
    }

    // allow: doctor, receptionist to access appointments
    if (unauthorized(to, '/appointments', ["doctor", "receptionist"], roles)) {
        return navigateTo('/')
    }

    // allow: doctor, receptionist to access payments
    if (unauthorized(to, '/payments', ["doctor", "receptionist"], roles)) {
        return navigateTo('/')
    }

})
