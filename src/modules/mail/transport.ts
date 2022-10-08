import nodemailer, { SentMessageInfo } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

let transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
    null;
//dev
const host = "smtp.ethereal.email";

export const getTransport = async () => {
    if (transport) return transport;

    //DEV code
    const { user, pass } = await nodemailer.createTestAccount();
    transport = nodemailer.createTransport({
        host,
        port: 587,
        secure: process.env.NODE_ENV === "production",
        auth: {
            user,
            pass,
        },
    });
    return transport;
};
