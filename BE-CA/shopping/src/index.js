const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const http = require("http");
const socketIO = require("socket.io");
const redisClient = require("./utils/redis-client");
// const redisSubcribe = redis.createClient({
//   url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
// });
const cors = require("cors");
const StartServer = async () => {
  const app = express();
  const server = http.createServer(app);
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
  });
  await databaseConnection();

  app.use(cors());

  io.on("connection", (socket) => {});
  await expressApp(app);

  // //redis config
  const redisSubcribe = redisClient.duplicate();
  await redisSubcribe.connect();
  redisSubcribe.subscribe("newPlacedOrder", (channel, message) => {
    console.log(channel);
    io.sockets.emit("newPlacedOrder", channel);
  });

  // await redisSubcribe.on("message", (channel, message) => {
  //    //   console.log(message);
  //   io.sockets.emit("newPlacedOrder", message);
  // });

  server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  });
  // app
  //   .listen(PORT, () => {})
  //   .on("error", (err) => {
  //     console.log(err);
  //     process.exit();
  //   });
};

StartServer();
