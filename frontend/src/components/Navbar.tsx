
import { Socket } from "socket.io-client"
import { User } from "../models/user"

import NavbarLoggedInView from "./NavbarLoggedInView"
import NavbarLoggedOutView from "./NavbarLoggedOutView"

interface NavBarProps{
    loggedInUser:User|null
    signInUsername?:string
    onLogoutSuccessfull: ()=>void
    socket: typeof Socket
    messageLenght:number
    socketMessageCount: ()=>void
}

const NavBar = ({signInUsername, loggedInUser, onLogoutSuccessfull,socket,messageLenght,socketMessageCount}:NavBarProps) => {

   

    return(
        <>
                     {loggedInUser
                    ?<NavbarLoggedInView
                    messageLenght={messageLenght}
                    socket={socket}
                    signInUsername={signInUsername}
                    onLogoutSuccessfull={onLogoutSuccessfull}
                    socketMessageCount={socketMessageCount}
                    />
                    :<NavbarLoggedOutView/>
                    } 
        </>
                    
    )
}

export default NavBar