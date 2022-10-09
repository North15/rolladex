import type { GetServerSidePropsContext } from "next";
import Register from "../modules/components/login/Register";
import { Heading } from "@chakra-ui/react";
import nookies from "nookies";
import { initializeApollo } from "../lib/apolloClient";
import { prisma } from "../lib/prisma";
import {
    ImplicitLoginDocument,
    ImplicitLoginQuery,
} from "../../generated/graphql";

interface Props {
    username: string;
    loggedIn: boolean;
}

const Home = ({ loggedIn, username }: Props) => {
    return loggedIn ? <Heading>Welcome {username}</Heading> : <Register />;
};

export const getServerSideProps = async ({
    req,
    res,
}: GetServerSidePropsContext) => {
    const cookies = nookies.get({ req });
    //Check if there is a cookie with an sid
    if (!cookies.sid) {
        return { props: { loggedIn: false } as Props };
    }
    //Check if logged in
    const apolloClient = initializeApollo({
        ctx: { req, res, prisma },
    });
    const { data } = await apolloClient.query<ImplicitLoginQuery>({
        query: ImplicitLoginDocument,
    });
    if (!data?.implicitLogin?.loggedIn) {
        return { props: { loggedIn: false } as Props };
    }
    //return logged in
    return {
        props: {
            username: data?.implicitLogin?.username,
            loggedIn: data?.implicitLogin?.loggedIn,
        } as Props,
    };
};

export default Home;
