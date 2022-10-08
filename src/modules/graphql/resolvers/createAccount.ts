import nodemailer from "nodemailer";
import { ValidationError } from "apollo-server-micro";
import { FieldResolver } from "nexus";
import * as Yup from "yup";
import { getTransport } from "../../mail/transport";
import { generateVerificationEmail } from "../../mail/verifyAccount";
import { registerValidation } from "../../utils/registrationValidation";

export const createAccount: FieldResolver<"Mutation", "createAccount"> = async (
    _,
    { credentials }
) => {
    try {
        await registerValidation.validate(credentials);
        const transport = await getTransport();
        transport
            .sendMail(generateVerificationEmail(credentials))
            .then((info) => {
                console.log(`Message id: ${info.messageId}`);
                console.log(`URL ${nodemailer.getTestMessageUrl(info)}`);
            });
        return {
            message:
                "Thanks for registering! Check your email to validate your account.",
            error: false,
        };
    } catch (err) {
        const message = (err as ValidationError).message || "Invalid Input";
        return {
            message,
            error: true,
        };
    }
};
