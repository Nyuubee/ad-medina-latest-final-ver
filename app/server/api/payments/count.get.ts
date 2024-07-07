import { tables } from "~/server/database";
import { ExtendedCountHandler } from "~/server/utils/drizzle";
import { paymentSearch } from "./index.get";
export default roleHandler
    (['admin', 'doctor', 'receptionist'],
        ExtendedCountHandler(tables.payment.id, paymentSearch)
    )
