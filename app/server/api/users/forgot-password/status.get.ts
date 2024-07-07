import { getVerificationCodeByEmail, hasExpired } from "../password.post"

export default eventHandler(async (event) => {
    const { email } = getQuery<{ email: string }>(event)
    const user = await getVerificationCodeByEmail(email)
    if (user?.forgotPassword == null) {
        return 'none'
    }
    if (hasExpired(user.forgotPassword)) {
        return 'expired'
    }

    return 'exists'
})
