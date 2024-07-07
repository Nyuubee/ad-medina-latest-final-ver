import { getVerificationCodeByEmail, throwIfExpired } from "../password.post"

export default eventHandler(async (event) => {
    const { email,code } = await readBody<{ email: string,code:string }>(event)
    const user = await getVerificationCodeByEmail(email)
    if (user?.forgotPassword == null) {
        return 'none'
    }
    throwIfExpired(user.forgotPassword)
    if (user.forgotPassword.code == code) {
        return 'matches'
    }

    return 'mismatch'
})
