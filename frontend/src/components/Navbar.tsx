
import { Socket } from "socket.io-client"
import { User } from "../models/user"

import NavbarLoggedInView from "./NavbarLoggedInView"
import NavbarLoggedOutView from "./NavbarLoggedOutView"

interface NavBarProps{
    loggedInUser:User|null
    signInUsername?:string
    onLogoutSuccessfull: ()=>void
    socket: typeof Socket
}

const NavBar = ({signInUsername, loggedInUser, onLogoutSuccessfull,socket}:NavBarProps) => {

   

    return(
        <>
                     {loggedInUser
                    ?<NavbarLoggedInView
                    socket={socket}
                    signInUsername={signInUsername}
                    onLogoutSuccessfull={onLogoutSuccessfull}
                    />
                    :<NavbarLoggedOutView/>
                    } 
        </>
                    
    )
}

export default NavBar