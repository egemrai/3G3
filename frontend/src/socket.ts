import io from "socket.io-client"

 function connectSocket(userId:string){
  
  const fetchedUserId =  userId

const socket = io(process.env.REACT_APP_BACKEND_URL!,{// backend adresi
  transports: ["websocket"],    //transports ekleyince düzgün çalışmaya başlamıştı
  auth:{
    userId: fetchedUserId
  }
}); 

return socket
}

export default connectSocket
