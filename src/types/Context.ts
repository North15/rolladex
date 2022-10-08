import { MicroRequest } from "apollo-server-micro/dist/types";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";

export interface Context {
    req: MicroRequest | NextApiRequest;
    prisma: PrismaClient;
}
