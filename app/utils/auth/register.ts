import { sha256Hex } from "@clinic/crypto"
import { FetchError } from "ofetch"
import { login } from "./login"

/**
 * Registers the user then logs them in if successful
 */
export async function register(username: string, password: string): Promise<"UsernameTaken"|"Unhandled">{
    const result = await $fetch('/api/users', {
        method: 'POST',
        body: {
            username,
            password: await sha256Hex(password)
        }
    }).catch(e => {
        console.log(e)
        if (e instanceof FetchError) {
            if (e.status == 409) {
                return "UsernameTaken"
            }
        }
        return "Unhandled"
    })
    if (typeof result == 'string') {
        return result
    }
    
    if (result.result) {
        await login(username, password)
    }

    return 'Unhandled'
}
