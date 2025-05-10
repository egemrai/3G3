import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import style from "../styles/NavBar.module.css"


interface NavbarLoggedOutViewProps{

}

const NavbarLoggedOutView = () => {

    const location= useLocation()
    const navigate= useNavigate()


    const goLoginPage = () => {
        navigate("/login", { state: { from: location.pathname } })
    }
    

    return(
        <Navbar className={` ${style.Navbar } `}  expand="sm" sticky="top">
            <Container className= {` ms-auto`}>
                <Navbar.Brand className={`mx-auto ${style.textWhite}`} as={Link}  to={"/"}>
                    3G3
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="main-navbar"/>
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-4">
                        <Nav.Link className={`ms-auto ${style.textWhite }`} as={Link} to="/category">

                            category                        {/*<Link > //link değişince tüm sayfayı refreshlemesin diye 
                                                                category   //as komutu ile Link kullanmak yerine nav.Link'i, Link gibi gösterebiliyoruz
                                                          {   </Link> */}
                        </Nav.Link>
                    </Nav>
                    
                    
                    
                    <Nav className={`${style.loggedNav} `}>
                        
                        <Nav.Item as={Button} className={`rounded-pill ${style.loginButton} `} onClick={goLoginPage}  >
                            login
                        </Nav.Item>

                        
                        
                        
                    </Nav>
                </Navbar.Collapse>    
            </Container>
        </Navbar>
    )
}

export default NavbarLoggedOutView