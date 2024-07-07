import { onUniqueConstraintError } from "~/server/utils/drizzle"
import { register, registerWithCredentials } from "~/server/utils/drizzle/registerUser"

export default eventHandler(async (ev) => {
    const body = await readBody<{
        username: string
        password: string
    }>(ev)

    const result = await registerWithCredentials(body.username, body.password)
        .catch(onUniqueConstraintError({
            statusMessage: "Username is taken"
        }))
    // TODO: Proper response
    return {
        result
    }
})
