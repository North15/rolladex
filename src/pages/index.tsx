import type { GetServerSidePropsContext, NextPage } from "next";
import Register from "../modules/components/login/Register";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import { prisma } from "../lib/prisma";
import { gql, useQuery } from "@apollo/client";
import { TestDocument, useTestQuery } from "../../generated/graphql";

const Home: NextPage = () => {
    const { data } = useTestQuery({
        notifyOnNetworkStatusChange: true,
    });

    return (
        <>
            <div>{JSON.stringify(data?.test)}</div>
            <Register />
        </>
    );
};

export const getServerSideProps = async ({
    req,
    res,
}: GetServerSidePropsContext) => {
    const apolloClient = initializeApollo({ ctx: { req, res, prisma } });
    await apolloClient.query({ query: TestDocument });
    return addApolloState(apolloClient, { props: {} });
};

export default Home;
