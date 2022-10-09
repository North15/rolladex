import nodemailer from "nodemailer";
const { v4: uuidv4 } = require("uuid");
import { ValidationError } from "apollo-server-micro";
import { FieldResolver } from "nexus";
import { hash } from "bcrypt";
import * as Yup from "yup";
import { getTransport } from "../../mail/transport";
import { generateVerificationEmail } from "../../mail/verifyAccount";
import { registerValidation } from "../../utils/registrationValidation";
import { Hash } from "crypto";
import { getRedisClient } from "../../../lib/redis";

export const createAccount: FieldResolver<"Mutation", "createAccount"> = async (
    _,
    { credentials },
    { prisma }
) => {
    //Validate the credentials
    await registerValidation.validate(credentials);
    const existingUser = await prisma.user.findFirst({
        where: {
            username: credentials.username,
            OR: {
                email: credentials.email,
            },
        },
    });
    //Check if username or email is already used
    if (existingUser !== null) {
        throw new Error("Email or username already taken!");
    }
    //hash password
    const hashedPass = await hash(credentials.password, 7);

    //create user object in redis and set expiration
    const key = uuidv4();
    const userObj = {
        username: credentials.username,
        email: credentials.email,
        hashedPass,
    };
    await getRedisClient()
        .multi()
        .hmset(key, userObj)
        .expire(key, 60 * 5)
        .exec();

    //Send email for verification
    const transport = await getTransport();
    const mailOptions = generateVerificationEmail({
        username: credentials.username,
        email: credentials.email,
        uuid: key,
    });
    transport.sendMail(mailOptions).then((info) => {
        console.log(`Message id: ${info.messageId}`);
        console.log(`URL ${nodemailer.getTestMessageUrl(info)}`);
    });
    return {
        message:
            "Thanks for registering! Check your email to validate your account.",
    };
};
