import http from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { registerSocketServer } from "./services/realtimeService.js";
import { bootstrapService } from "./services/bootstrapService.js";

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.emit("system:connected", {
    message: "LifeLink real-time channel connected",
    at: new Date().toISOString(),
  });
});

registerSocketServer(io);

bootstrapService.ensureSeedData().finally(() => {
  server.listen(env.port, () => {
    console.log(`LifeLink backend listening on http://localhost:${env.port}`);
  });
});
