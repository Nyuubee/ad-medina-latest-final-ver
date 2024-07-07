import { getToken } from "#auth"
import { canLog } from "../utils/drizzle/maintenance"

export default defineEventHandler(async (event) => {
    const LOG = await canLog()
    if (!LOG?.LOGGING_ENABLED) {
        return
    }
    const session = await getToken({ event })
    const url = getRequestURL(event)
    if (session?.id) {
        // don't want to record the host, just the path and search query
        // e.g /intraoral-exam?toothId=42
        const pathnameAndSearch = url.pathname + url.search
        const log = {
            userId: session.id as number,
            method: event.method,
            path: pathnameAndSearch,
        }
        await logAction(log)
            .catch((error) => {
                console.error('Failed to log action', log)
            })
    }
})
