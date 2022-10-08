import Redis from "ioredis";

let redisClient: Redis | null = null;

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    console.warn(
        "no REDIS_HOST or REDIS_PORT environment variable defined! (ignore if typegen)"
    );
}

export const getRedisClient = (): Redis => {
    if (!redisClient) {
        redisClient =
            process.env.REDIS_HOST && process.env.REDIS_PORT
                ? new Redis({
                      host: process.env.REDIS_HOST,
                      port: process.env.REDIS_PORT as unknown as number,
                  })
                : new Redis({
                      host: "localhost",
                      port: 5002,
                  });
    }
    return redisClient;
};
