import { tables } from "~/server/database";
import { userSearch } from "./index.get";

export default roleHandler(['admin'], ExtendedCountHandler(tables.user.id,userSearch))
