import { createTransport } from "nodemailer";

export function gmailTransporter() {
    return createTransport({
        service: "Gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_APP_PASSWORD,
        },
    });
}
