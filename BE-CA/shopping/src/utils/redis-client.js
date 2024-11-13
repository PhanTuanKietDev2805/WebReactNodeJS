const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../config");
// Initialize and export Redis client
const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

module.exports = redisClient;
