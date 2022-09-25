import Cors from "cors";
import initMiddleware from "./initMiddleware";

const cors = initMiddleware(
    Cors({
        credentials: true,
        origin: ["https://studio.apolloserver.com"],
    })
);

export { cors };
