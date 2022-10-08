import { extendType, nonNull, booleanArg } from "nexus";

export const TestQuery = extendType({
    type: "Query",
    definition(t) {
        t.boolean("test", {
            args: { bool: nonNull(booleanArg()) },
            resolve: async (_, { bool }, { prisma }) => {
                const users = await prisma.user.findMany();
                console.log(users);
                return bool;
            },
        });
    },
});
