import { tables } from "~/server/database";
import { logsConfig } from "./index.get";

export default roleHandler(['admin'], ExtendedCountHandler(tables.user_actions.id,logsConfig))
