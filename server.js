require("dotenv").config();
const http = require("http");
const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    connectTimeout: 1000,
    reconnectStrategy: false
  }
});

client.connect().catch(() => {
  console.log("Redis not available - using fallback");
});

const server = http.createServer(async (req, res) => {
  let visits = "N/A (no Redis)";
  try {
    if (client.isReady) {
      visits = await client.incr("visits");
    }
  } catch (e) {
    visits = "Redis not connected";
  }
  res.writeHead(200);
  res.end(
    `Hello from Bonded POC 2! shamshad \nEnvironment: ${process.env.APP_ENV || "local"}\nVersion: ${process.env.APP_VERSION || "unknown"}\nVisits: ${visits}\n`
  );
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Server running on port", process.env.PORT || 8080);
});