require("dotenv").config();
const Redis = require("ioredis");

const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});


subscriber.on("connect", () => {
    console.log("Subscriber connected");
});

subscriber.on("error", (err) => {
    console.error("Subscriber error:", err);
});

(async () => {
    await subscriber.subscribe(
        process.env.EMAIL_RECEIVED_CHANNEL
    );

    console.log(
        "Subscribed successfully to",
        process.env.EMAIL_RECEIVED_CHANNEL
    );

    subscriber.on(
        "message",
        (channel, message) => {

            console.log("Channel:", channel);
            console.log("Message:", message);

        }
    );
})();