import { arrayBufferToHex } from "@clinic/crypto";
import { eq } from "drizzle-orm";
import { db, tables } from "~/server/database";
import { hasExpired } from "../password.post";
import { gmailTransporter } from "../../../utils/email";

function randomCode(len_in_chars: number) {
    return arrayBufferToHex(
        crypto.getRandomValues(new Uint8Array(len_in_chars))
    )
}
const VERIFICATION_CODE_LENGTH = 4
export async function insertVerificationCodeToEmail(email: string) {
    const user = await db.query.user.findFirst({
        where: eq(tables.user.email, email),
        with: {
            forgotPassword: true,
            auth: true,
        }
    })

    if (user?.id == undefined) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
        })
    }

    if (user?.forgotPassword && !hasExpired(user.forgotPassword)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Code has not expired',
        })
    }
    const code = randomCode(VERIFICATION_CODE_LENGTH);
    await db.insert(tables.forgotPassword).values({
        userId: user.id,
        code,
        // only allow one code per user
    }).onConflictDoUpdate({
        target: tables.forgotPassword.userId,
        set: {
            code,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })

    return {
        code,
        username: user.auth.username,
    }
}

const RESET_PASSWORD_EXPIRY_IN_MINUTES = parseInt(process.env.RESET_PASSWORD_EXPIRY_IN_SECONDS!) / 60
export async function sendVerificationEmail(email: string, code: string) {
    const transporter = gmailTransporter()
    await transporter.sendMail({
        from: `AD Medina Clinic Support ${process.env.NODEMAILER_EMAIL}`,
        to: email,
        subject: 'Verification Code | AD Medina Dental Clinic',
        html: `Your verification code is <u>${code}</u><br>This code will expire in ${RESET_PASSWORD_EXPIRY_IN_MINUTES} in minutes.`,
    })
}
export default eventHandler(async (event) => {
    const { email } = getQuery<{ email: string }>(event)
    const {code,username} = await insertVerificationCodeToEmail(email)
    await sendVerificationEmail(email, code)

    return {
        username,
    }
})
