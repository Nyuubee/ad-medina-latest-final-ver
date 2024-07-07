import { eq, ilike } from "drizzle-orm";
import { tables } from "~/server/database";
import { fuz } from "../../../utils/drizzle/fuz";
import { ExtendedCountHandler } from "~/server/utils/drizzle";

export default roleHandler(['admin'],
    ExtendedCountHandler<{username:string}>(tables.auth.userId, {
        username: {
            action: 'ilike',
            column: tables.auth.username,
        },
    })
)

