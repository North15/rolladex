import { MicroRequest } from "apollo-server-micro/dist/types";
import { PrismaClient } from "@prisma/client";

export interface Context {
    req: MicroRequest;
    prisma: PrismaClient;
}
