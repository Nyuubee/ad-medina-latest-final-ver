import { selectConfig } from "~/server/utils/drizzle/registerUser";
import { roleHandler } from "~/server/utils/drizzle/roleHandler";

export default roleHandler(['admin'], async (event) => {
    return await selectConfig()
})
