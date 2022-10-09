import { MicroRequest } from "apollo-server-micro/dist/types";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { ServerResponse } from "http";

export interface Context {
    req: MicroRequest | NextApiRequest;
    res: NextApiRequest | ServerResponse;
    prisma: PrismaClient;
}
