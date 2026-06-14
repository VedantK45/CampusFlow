const Redis = require("ioredis");

const redis = new Redis(
    process.env.REDIS_HOST
);

async function publishEmail(email) {

    await redis.publish(
        `${process.env.EMAIL_RECEIVED_CHANNEL}`,
        JSON.stringify(email)
    );

}

module.exports = {
    publishEmail
};