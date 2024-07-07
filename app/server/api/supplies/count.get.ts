import { tables } from "~/server/database";
import { suppliesSearchConfig } from "./index.get";
// just supply the primary key and the search config
// This will allow the handler to return the count of the search results like in ./index.get.ts
export default ExtendedCountHandler(tables.supplies.id, suppliesSearchConfig)
