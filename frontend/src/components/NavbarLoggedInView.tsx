import { Button, Card, Container, Dropdown, Nav, Navbar } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import style from "../styles/NavBar.module.css"
import * as offers_api from "../network/offers_api"
import { useEffect, useState } from "react"
import { SoldOffer } from "../models/SoldOffer"

interface NavbarLoggedInViewProps{
    signInUsername?:string,
    onLogoutSuccessfull: ()=> void
}

const NavbarLoggedInView = ({signInUsername, onLogoutSuccessfull}:NavbarLoggedInViewProps) => {

    const navigate= useNavigate()

    const logout = async () => {
            try {
                navigate("/")  //indexe gitmeden logout yapınca endpoint error hatası veriyorARAŞTIR!!!
                await offers_api.logout()
                onLogoutSuccessfull()
                
            } catch (error) {
                console.error(error)
                alert(`${error} logout hatası`)
            }
        }
        
    const [soldOffers, setSoldOffers] = useState<SoldOffer[]>([])
    const [boughtOffers, setBoughtOffers] = useState<SoldOffer[]>([])
    const [notificationLenght, setNotificationLenght] = useState<number>(0) //notification butonu rengi ve sayıyı 0lamak için
    
    async function fetchSoldOffers() {
        const fetchedSoldOffers = await offers_api.fetchSoldOffers()
        const filteredSoldOffers =  fetchedSoldOffers.filter(offer=>offer.seenBySeller===false) //seen false ise, yani görünmediyse notif'de görüncek
        const fetchedBoughtOffers = await offers_api.fetchBoughtOffers()
        const filteredBoughtOffers =  fetchedBoughtOffers.filter(offer=>offer.seenByBuyer===false)
        setSoldOffers(filteredSoldOffers)
        setBoughtOffers(filteredBoughtOffers)
        setNotificationLenght(filteredSoldOffers.length + filteredBoughtOffers.length)
    }

    useEffect(()=>{
        fetchSoldOffers()
    },[])

    async function setSeenTrue() {
        const response = await offers_api.setSeenAllTrue()
        console.log(response)
        setNotificationLenght(0)
    }

    const soldOffersGrid = soldOffers.map((offer,index)=>{
        const title= offer.title
        const id= offer._id
        return(
            <Card key={index} as={Link} to={"/transaction/?id="+ id} className={`${style.dropdownMenuCard}`}>title: {title}</Card>
        )
    })

    const boughtOffersGrid = boughtOffers.map((offer,index)=>{
        const title= offer.title
        const id= offer._id
        return(
            <Card key={index} as={Link} to={"/transaction/?id="+ id} className={`${style.dropdownMenuCard}`}>title: {title}</Card>
        )
    })

    return(
        <Navbar className={` ${style.Navbar } `}  expand="xl" sticky="top">
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
                        
                        <Nav.Item className={`${style.createOfferButton} rounded-pill me-3 my-auto`} as={Link} to={"/createOffer"}  >
                            create offer
                        </Nav.Item>

                        <Nav.Item className={`${style.createOfferButton} rounded-pill me-3 my-auto`} as={Link} to={"/createOffer"}  >
                            message
                        </Nav.Item>
                        <Dropdown onClick={setSeenTrue} className={`${style.dropdown}`}>
                                {notificationLenght>0
                                    ?<Dropdown.Toggle className={`${style.dropdownToogleOn}`} variant="Primary" id="dropdown-basic">
                                        notification {notificationLenght}
                                    </Dropdown.Toggle>
                                    :<Dropdown.Toggle className={`${style.dropdownToogleOff}`} variant="Primary" id="dropdown-basic">
                                        notification
                                    </Dropdown.Toggle>
                                }

                                <Dropdown.Menu className={`${style.dropdownMenu}`}>
                                    <div>
                                        <div className={`${style.dropdownMenuName}`} >
                                            <p>Sold Offers</p>
                                            <Link to={"/soldOffers/?page=1"} className={`${style.dropdownMenuLink}`}>view all</Link>
                                        </div>
                                        {soldOffersGrid.length>0
                                        ?soldOffersGrid
                                        :<Card className={`${style.dropdownMenuCard}`}>yeni bi şeyler yok</Card>}
                                        
                                    </div>

                                    <div>
                                        <div className={`${style.dropdownMenuName}`} >
                                            <p>Bought Offers</p>
                                            <Link to={"/boughtOffers/?page=1"} className={`${style.dropdownMenuLink}`}>view all</Link>
                                        </div>
                                        {boughtOffersGrid.length>0
                                        ?boughtOffersGrid
                                        :<Card className={`${style.dropdownMenuCard}`}>yeni bi şeyler yok</Card>}
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
            
                        <Nav.Item className={`my-auto`}>
                            <Dropdown>
                                <Dropdown.Toggle className={`${style.textWhite}`} variant="Primary" id="dropdown-basic">
                                    Signed in as: {signInUsername}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={"/profile/" +signInUsername}>profile</Dropdown.Item>
                                    <Dropdown.Item as={Link} to={"/manageOffer/?page=1"}>Manage Offer(s)</Dropdown.Item>
                                </Dropdown.Menu>

                            </Dropdown>
                            
                        
                        </Nav.Item>
                        
                        <Nav.Item  onClick={logout} as={Button} className={`me-1 ${style.logoutButton} ${style.textWhite}`} >

                            logout                        {/*<Link > //link değişince tüm sayfayı refreshlemesin diye 
                                                                category   //as komutu ile Link kullanmak yerine nav.Link'i, Link gibi gösterebiliyoruz
                                                          {   </Link> */}
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>    
            </Container>
        </Navbar>
    )
}

export default NavbarLoggedInView