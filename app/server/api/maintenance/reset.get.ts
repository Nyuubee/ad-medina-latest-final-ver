import { DANGEROUSLY_TRUNCATE_ALL } from "./restore.post"

export default roleHandler(["admin"], async(event) => {
    await DANGEROUSLY_TRUNCATE_ALL()
})
