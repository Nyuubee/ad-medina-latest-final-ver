import { eq } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"

const patients = alias(tables.user, "patients")
export default eventHandler(async (event) => {
    // handle GET requests for the `/dentist:id/treatments` endpoint
    const dentistId = getRouteIntParam(event, 'id')
    const treatments = await db.select()
        .from(tables.treatment)
        .leftJoin(patients, eq(tables.treatment.patientId, patients.id))
        .where(eq(tables.treatment.doctorId, dentistId))

    return treatments
})


