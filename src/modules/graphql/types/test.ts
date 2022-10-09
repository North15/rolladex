import { extendType, nonNull, booleanArg } from "nexus";

export const TestQuery = extendType({
    type: "Query",
    definition(t) {
        t.boolean("test", {
            args: { bool: nonNull(booleanArg()) },
            resolve: async (_, { bool }) => {
                return bool;
            },
        });
    },
});
