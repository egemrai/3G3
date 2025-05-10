import mongoose from "mongoose"
import app from "./app"
import env from "./util/validateEnv"
import http from "http";
import { Server } from "socket.io";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace"
import { Session } from "./app";


const port= env.PORT

const server = http.createServer(app);



export const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // frontend adresi
      credentials: true,
    },
  });

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(  () => {
    console.log("mongoose connected")
    server.listen(port, () => {
        console.log("server running on port:" + port)
    })
})
.catch(console.error)


// eslint-disable-next-line @typescript-eslint/no-explicit-any
io.engine.use(Session as any)

// Socket.io middleware
io.use((socket: Socket, next: (err?: ExtendedError) => void) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (socket.request as any).session;
  const userIdFromSession = session?.userId;
  const userIdFromAuth = socket.handshake.auth.userId;

  console.log(socket.request.headers.cookie)

  if (!userIdFromSession) {
    console.log("Session yok, bağlantı reddedildi.");
    return next(new Error("Session bulunamadı") as ExtendedError); // ✅
  }

  if (userIdFromSession !== userIdFromAuth) {
    console.log("User ID eşleşmiyor, bağlantı reddedildi.");
    return next(new Error("Kimlik doğrulama hatası") as ExtendedError); // ✅
  }

  console.log("User ID doğrulandı:", userIdFromSession);

  next();
});

const userSocketMap = new Map<string, string[]>()

io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId
    console.log("Yeni kullanıcı bağlandı:", socket.id , " userId:", userId);

   
    const oldSockets = userSocketMap.get(userId) || []
    
    const newSockets = [...oldSockets, socket.id]
    userSocketMap.set(userId,newSockets)
    console.log(userSocketMap)
    
    socket.on("test", ({ targetUserId, message }) => {
        console.log(message,targetUserId)
        
        const receiverSocketId = userSocketMap.get(targetUserId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("serverdanMesaj",{
                from: userId,
                message,
            })
        }
        
      })
    
    
    // console.log(io.sockets.sockets);

    socket.on("disconnect", () => {
        console.log("Kullanıcı ayrıldı:", socket.id);
        const socketsLenght = userSocketMap.get(userId)?.length
        if(socketsLenght && socketsLenght>1){
            const filteredSockets = newSockets.filter((currentSocket)=> currentSocket !== socket.id)
            userSocketMap.set(userId, filteredSockets)
        }else{
            userSocketMap.delete(userId)
        }
        console.log(userSocketMap)
    });
});
