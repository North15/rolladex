import { PrismaClient } from "@prisma/client";
import nookies from "nookies";
import { compare } from "bcrypt";
import { FieldResolver } from "nexus";
import { createToken } from "../../utils/jwt";
import { registerValidation } from "../../utils/registrationValidation";
import { CookieSerializeOptions } from "next/dist/server/web/types";

export const loginAttempt: FieldResolver<"Mutation", "login"> = async (
    _,
    { credentials },
    { prisma, res }
) => {
    //Validates whether the credentials were valid
    await registerValidation.validate(credentials);
    //Find if the user exists
    const existingUser = await getExistingUser(credentials, prisma);
    //Create JWT
    const encodedToken = await createToken(
        { username: existingUser.username },
        {
            expiresIn: "7d",
        }
    );
    //Save token in cookies
    nookies.set({ res }, "sid", encodedToken, {
        httpOnly: true,
        domain: process.env.SERVER_DOMAIN || undefined,
        maxAge: 60 * 60 * 24 * 7, // 7d
        sameSite: true,
        path: "/",
    } as CookieSerializeOptions);
    //Return if user can login in
    return {
        username: existingUser.username,
    };
};

//Checks database for a matching user to the entered credentials
const getExistingUser = async (
    credentials: { username: string; password: string },
    prisma: PrismaClient
) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            username: credentials.username,
        },
        select: {
            username: true,
            password: true,
        },
    });
    const passwordMatch = await compare(
        credentials.password,
        (existingUser?.password as string) || ""
    );
    if (!existingUser || !passwordMatch) {
        throw new Error("Incorrect username or password");
    }
    return existingUser;
};
