import bcrypt from "bcrypt";
import app from './app';
import  User  from "./model/user.model";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";

const {instrument} = require("@socket.io/admin-ui");
const PORT = process.env.PORT || 3000;

(async () => {
  try {;
    const server = require("http").createServer(app);
    // const pubClient = new Redis();
    // const subClient = pubClient.duplicate();
    // const io2 = require('socket.io')(server, {
    //   cors: {
    //       origin: '*',
    //   },
      
    // });

    // io2.adapter(createAdapter(pubClient, subClient));
    // instrument(io2, {
    //   auth: false
    // });
    // io2.on('connection', async function (socket:any) {
    //   socket.on('join', (roomName: any, cb: any) => {
    //     socket.join(roomName);
    //     cb();
    //   });
    //   socket.on('send message', (roomName: any, message:any, cb: any) => {
    //     socket.in(roomName).emit("send message", roomName, message, () => {
    //       console.log("muhaha");
    //       console.log(roomName +" server "+  message);
    //     });
    //     cb();
    //   })
    //   setInterval(function(){
    //     socket.emit('send message', "room_21", "kalla kawa", () => console.log("kallallallalal"));
    //   }, 10000)
    // })
    

    // pubClient.subscribe("redisChannel");

    // pubClient.on("message", async function (channel, message) {
    //   console.log("On channel " + channel + " message arrived!")
    //   console.log(`channel: ${channel}, message: ${message}`);
    //   // io2.to(channel).emit(channel, message);
    //   // const responses = await io2.sockets.timeout(5000).emitWithAck(channel, message);
    //   // logger.info("responseess: " + responses);
    //   console.log("message received in channel: " + message);
    //   io2.sockets.emit(channel, message, () => {
    //     console.log("hola migos"); // ok
    //   });
    // });
    
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash("Admin@12345", salt);

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

    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1); // Exit the process with a non-zero exit code
  }
})();
