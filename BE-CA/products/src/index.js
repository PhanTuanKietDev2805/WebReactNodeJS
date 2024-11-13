const express = require("express");
const { PORT, REDIS_HOST, REDIS_PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { createClient } = require("redis");
const { createBucket } = require("./utils/uploadImage");

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  await expressApp(app);

  (async () => {
    const client = createClient({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    });

    await client.connect();
    console.log("redis connected");
    client.on("error", (err) => console.log("Redis Client Error", err));
  })();

  createBucket("my-bucket");

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
