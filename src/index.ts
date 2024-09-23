import bcrypt from "bcrypt";
import app from "./app";
import User from "./model/user.model";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";

const { instrument } = require("@socket.io/admin-ui");
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const server = require("http").createServer(app);

    // Redis clients for pub/sub
    const pubClient = new Redis({
      host: "redis",
      port: 6379,
      maxRetriesPerRequest: null,
    });
    const subClient = pubClient.duplicate();

    const io2 = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
      path: "/rtm_backend",
    });

    io2.adapter(createAdapter(pubClient, subClient));
    instrument(io2, {
      auth: false,
    });

    io2.of('/chat-application').on("connection", async function (socket: any) {
      socket.on("join", (roomName: any, cb: any) => {
        console.log("joining room: ", roomName);
        socket.join(roomName);
        socket.join(`${roomName}_notification`);
        cb();
      });

      socket.on("send_message", (roomName: any, message: any, cb: any) => {
        console.log("room name: " + roomName + " message: " + message);
        socket.in(roomName).emit("send_message", roomName, message, () => {
          console.log(`${roomName} server: ${message}`);
        });
        cb();
      });

      socket.on("send_notification", (roomName: any, message: any, cb: any) => {
        socket
          .in(`${roomName}_notification`)
          .emit("send_notification", roomName, message, () => {
            console.log(`${roomName} server: ${message}`);
          });
        cb();
      });

      // Example message broadcast to the socket
      // setInterval(function () {
      //   socket.emit("send message", "room_21", "kalla kawa", () =>
      //     console.log("Periodic message sent")
      //   );
      // }, 10000);
    });

    // Subscribe with the subClient, NOT pubClient
    // subClient.subscribe("redisChannel");

    // subClient.on("message", function (channel, message) {
    //   console.log(`On channel ${channel}, message: ${message}`);
    //   io2.sockets.emit(channel, message, () => {
    //     console.log("Message broadcasted to all sockets");
    //   });
    // });

    // Password hashing example
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash("Admin@12345", salt);

    // Function to create the default super admin
    async function createDefaultSuperAdmin() {
      const superAdmin = await User.findOne({ roles: "super_admin" });
      if (!superAdmin) {
        await User.create({
          userName: "admin",
          email: "admin@gmail.com",
          password: hashPassword,
          roles: "super_admin",
        });
      }
    }

    await createDefaultSuperAdmin();

    // Start server
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1); // Exit the process with a non-zero exit code
  }
})();
