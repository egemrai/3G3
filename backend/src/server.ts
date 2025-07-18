import mongoose from "mongoose"
import app from "./app"
import env from "./util/validateEnv"
import http from "http";
import { Server } from "socket.io";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace"
import { Session } from "./app";

//#region backend_api
async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init)
    if(response.ok){
        return response
    }
    else{
        try {
            const errorBody= await response.json()
            const errorMessage= errorBody.error
            throw new Error(errorMessage)
        } catch (error) {
          console.log(error)
            throw new Error("failed to parse error")
        }
    } 
}
//backendden request yolladığımız için URL'yi full şekilde yazılıyor
export async function setUserOffline(id:string) {
    const response = await fetchData(`${env.BACKEND_SITE_URL}/api/users/setUserOffline/?id=`+id)
    return response.json()
  }
export async function setUserOnline(id:string) {
  const response = await fetchData(`${env.BACKEND_SITE_URL}/api/users/setUserOnline/?id=`+id)
  return response.json()
}
//#endregion

const port= env.PORT

const server = http.createServer(app);



export const io = new Server(server, {
    cors: {
      origin: `${env.FRONTEND_SITE_URL}`, // frontend adresi
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

  
  // console.log("socket.request.headers.cookie:",socket.request.headers.cookie)

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

export const userSocketMap = new Map<string, string[]>()

io.on("connection",  (socket) => {

    const userId = socket.handshake.auth.userId
    setUserOnline(userId)
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
    

    socket.on("disconnect", async() => {
        console.log("Kullanıcı ayrıldı:", socket.id);
        //Zaten önce bu çalışıyormuş, başına await eklemeyi unutmuşum. artık socket sayısı 1 ise if'e giriyor
        await setUserOffline(userId) //önce bu fonksiyon çalışır diye düşünüp socket sayısı 1 ise if içine girip offline yapıyordum, sonra disconnect olunca direkt socketi kapattığını fark edip, !socket ise if'e girmesini sağladım
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
