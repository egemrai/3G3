
import { User } from "../models/user"

import NavbarLoggedInView from "./NavbarLoggedInView"
import NavbarLoggedOutView from "./NavbarLoggedOutView"

interface NavBarProps{
    loggedInUser:User|null
    signInUsername?:string
    onLogoutSuccessfull: ()=>void
}

const NavBar = ({signInUsername, loggedInUser, onLogoutSuccessfull}:NavBarProps) => {

   

    return(
        <>
                     {loggedInUser
                    ?<NavbarLoggedInView
                    signInUsername={signInUsername}
                    onLogoutSuccessfull={onLogoutSuccessfull}
                    />
                    :<NavbarLoggedOutView/>
                    } 
        </>
                    
    )
}

export default NavBar