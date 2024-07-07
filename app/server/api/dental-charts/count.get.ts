import { tables } from "~/server/database";
import { ExtendedCountHandler, SearchConfig } from "~/server/utils/drizzle";

export const patientSearch:SearchConfig = {
    name: {
        action: 'composite-ilike',
        args: [tables.patient.firstName, tables.patient.middleName, tables.patient.lastName],
    },
    id: {
        action: 'exact',
        column: tables.patient.id,
    },
    startend: {
        action: 'between',
        column: tables.patient.createdAt,
        args: {
            queryKeyEnd: 'end',
            queryKeyStart: 'start',
        }
    }
}
export default roleHandler(['admin', 'doctor'], ExtendedCountHandler(tables.patient.id,patientSearch))
