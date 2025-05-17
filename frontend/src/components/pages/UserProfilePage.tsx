import { useNavigate, useParams } from "react-router-dom"
import style from "../../styles/UserProfilePage.module.css"
import { Button, Card, Col, Container, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import * as OffersApi from "../../network/offers_api"
import { SoldOffer } from "../../models/SoldOffer"

interface userId_Time{
    id:string
    month: string
    fullYear: string
}

//bulunmayan username yazınca boş sayfaya gönder
const UserProfilePage = ()=>{
    const URLparams= useParams<{username: string}>()
    const navigate = useNavigate()

    if(!URLparams.username){
        navigate("/")
        throw new Error("username yok")
    }
    const username= URLparams.username

    const [offers, setOffers] = useState<any[]>([])
    const [user, setUser] = useState<userId_Time>() //id month year komple burdan fetch ediyorum, usermodelde zaten id yanında createdAt var.
    const [month, setMonth] = useState<string>() //month'u numberdan ay'a çevirmek için
    const [boughtOffers, setBoughtOffers] = useState<SoldOffer[]>([])
    const [soldOffers, setSoldOffers] = useState<SoldOffer[]>([])
    const [totalOffers, setTotalOffers] = useState<SoldOffer[]>([])
    const [allTimePositive, setAllTimePositive] = useState<number>(0)


    const fetchOffers = async() =>{
        try {
            const fetchedOffers = await OffersApi.fetchOffersForUserProfile(username)
             setOffers(fetchedOffers)
        } catch (error) {
            console.error(error)
            alert("userProfile offer fetch error")
        }
    }
    
    const fetchUserIdByUsername = async() =>{
        try {
            const fetchedUser = await OffersApi.fetchUserIdByUsername(username)
             setUser(fetchedUser)
            const monthMap: Record<string, string> = {  //Month yazı çevirme kısmı data
                "0": "January",
                "1": "February",
                "2": "March",
                "3": "April",
                "4": "May",
                "5": "June",
                "6": "July",
                "7": "August",
                "8": "September",
                "9": "October",
                "10": "November",
                "11": "December"
            }
            setMonth(monthMap[fetchedUser.month]) // fetch ile number olarak gelen ay'ı, yazı değerine çevirdim
        } catch (error) {
            console.error(error)
            alert("userProfile userId fetch error")
        }
    }

    const fetchSoldOffersForAll = async()=>{
        try {
            if(user){
                const [fetchedBoughtOffers,fetchedSoldOffers] = await Promise.all(
                    [await OffersApi.fetchBoughtOffersWithId(user?.id),
                    await OffersApi.fetchSoldOffersWithId(user?.id)])
                setBoughtOffers(fetchedBoughtOffers)
                setSoldOffers(fetchedSoldOffers)
                setTotalOffers([...fetchedBoughtOffers,...fetchedSoldOffers])
                const positiveBoughtOffers = fetchedBoughtOffers.filter(soldOffer=>soldOffer.buyerRating==="positive")
                const positiveSoldOffers = fetchedSoldOffers.filter(soldOffer=>soldOffer.sellerRating==="positive")
                setAllTimePositive(positiveBoughtOffers.length + positiveSoldOffers.length)
            }
        } catch (error) {
            console.error(error)
            alert("userProfile userId fetch error")
        }
    }
    
    useEffect(()=>{
        document.body.style.backgroundColor= "#FAFAFA" //1 kere profile girince, diğer urller de gri oluyor, direkt sitenin document değişiyor komple
        fetchOffers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        fetchUserIdByUsername()
    },[])

    useEffect(()=>{
        fetchSoldOffersForAll()
    },[user])

    //CATEGORY KISMI
    const [clickIndex, setClickIndex]= useState(0)
    const [selectedCategory, setSelectedCategory] = useState("")

    useEffect(() => {//CATEGORY BAŞLANGIC DEĞER ATAMA KISMI, İLK CATEGORY DİREKT SEÇİLİYOR
        try {
            if (offers.length > 0) {
                const firstCategory = offers[0].categoryName
                setClickIndex(0)
                setSelectedCategory(firstCategory)
            }
        } catch (error) {
            console.error(error)
        }
    },[offers])

    const categoryValues = offers.reduce((acc:Record<string, number>,obj)=>{
        const key = obj["categoryName"]
        acc[key] = (acc[key]||0)+1
        return acc
    },{})
    
    const arrayCategoryValues=  Object.entries(categoryValues) //object halindeki key ve valueları, array'e çevirdim

    const perPageCategory= 4
    const totalCategory = arrayCategoryValues.length
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0)


    const categoryValueCols = (arrayCategoryValues.map((category,index)=>{
        return <Col key={index} as={Button}
         onClick={()=>{
            setClickIndex(index)
            setSelectedCategory(category[0])
         }}
        className={index===clickIndex
            ?`${style.categoryColClicked} ${style.categoryCol}`
            :`${style.categoryCol}`}>
                {`${category[0]} (${category[1]}) `}</Col> 
    })).slice(perPageCategory*currentCategoryIndex,(currentCategoryIndex+1)*perPageCategory)


    // SERVICE KISMI
    const [arrayReducesServices, setArrayReducesServices]= useState<any>([])
    const [selectedService, setSelectedService]= useState<any>("")

function setServiceRow(){
    const newFiltredOffers = offers.filter((offer:any)=>{
        return offer["categoryName"]=== selectedCategory
    })

    const reducesServices= newFiltredOffers.reduce((acc: Record<string,number>,obj)=>{
        const value = obj["serviceName"]
        acc[value] = (acc[value] ||0)+1
        return acc
    },{})

    const arrayServices= Object.entries(reducesServices)
    setArrayReducesServices(arrayServices)
}
    //SERVICE COL SİTEDE GÖSTERME KISMI
    const serviceValueCol= arrayReducesServices.map((service:any,index:any)=>{
       return <Col key={index} className={`${style.serviceCol}`}>
                <Button className={
                    arrayReducesServices.length>4
                    ?`${style.serviceButton}`
                    :`${style.serviceButtonMore4}`
                    }
                    onClick={()=>setSelectedService(service[0])}>
                    {service[0].replace(selectedCategory,"")}({service[1]})
                </Button>
            </Col>
    })

    useEffect(()=>{
        if (selectedCategory !== "") {
            setServiceRow()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedCategory,offers])

    //SERVICE TIKLAYINCA OFFERSPAGE GONDER
    function showOffers():void{
        const navigateData: Record<string, string>= {category:`${selectedCategory}`,service:`${selectedService}`,usurname:`${username}`}
        navigate("/category/" + selectedCategory +"/" + selectedService.replace(selectedCategory,"")+"/?page=1&username="+username,)
        console.log(navigateData)
    }

    useEffect(()=>{
        if(selectedService!==""){
            showOffers()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedService])

    return(
        <>
        <Container>
            <div className={`${style.profile_offersDiv}`}>
                <Card className={`${style.profileCard}`}>
                    <div className={`${style.cardInsideDiv}`}>

                        <span className={`${style.username} `}>{URLparams.username}</span>
                        
                        <div className={`${style.dateDiv}`}>
                            <div className="">
                                <span>Member since</span>
                            </div>
                            <div className="">
                                <span>{`${month +" "+ user?.fullYear}`}</span>
                            </div>
                        </div>

                        <p className= {`${style.marginTB2} border-top`}></p>

                        <div className={`${style.dateDiv}`}>
                            <div className="">
                                <span >Total orders</span>
                            </div>
                            <div className="">
                                <span > {totalOffers.length}</span>
                            </div>
                        </div>

                        <p className= {`${style.marginTB2} border-top`}></p>

                        <div className={`${style.dateDiv}`}>
                            <div className="">
                                <p>All time rating</p>
                            </div>
                            <div className={`${style.dateDiv}`}>
                                <div className={`${style.text_green}`}>  {/* totaloffers alltimepositive*/}
                                    <p>{((allTimePositive*100)/totalOffers.length).toFixed(2)}%</p>
                                    
                                </div>
                                <div className={`${style.text_red}`}>
                                    <p>{(100-((allTimePositive*100)/totalOffers.length)).toFixed(2)}%</p>
                                </div>
                                
                            </div>
                        </div>

                    </div>
                       
                    
                </Card>

                <div className={`${style.offersDiv}`}>
                    <p>All Offers</p>
                    <Card className={`${style.offersCard}`}>
                        

                        <div className={`${style.categoryDiv}`}>
                            <Button id="solbuton"
                            onClick={()=>setCurrentCategoryIndex(currentCategoryIndex-1)}
                            disabled= {currentCategoryIndex===0}
                             className={currentCategoryIndex===0
                                ?`${style.categoryLeft} ${style.invis}`
                                :`${style.categoryLeft} `
                             }     
                                >{"<"}
                             </Button>

                            <Row className={`${style.categoryRow}`} sm={4}>
                                {offers.length>0
                                ?categoryValueCols
                                :"eleman yok"
                                }
                                
                                
                            </Row>
                            <Button
                            onClick={()=>setCurrentCategoryIndex(currentCategoryIndex+1)}
                            disabled= {currentCategoryIndex=== Math.ceil(totalCategory/4)-1 || totalCategory===0}
                             className={currentCategoryIndex=== Math.ceil(totalCategory/4)-1 || totalCategory===0
                             ?`${style.categoryRight} ${style.invis}`
                             :`${style.categoryRight}`}>{">"}</Button>
                        </div>
                       

                        

                        <br></br>

                        <div className={`${style.serviceDiv}`}>
                            <Row className={`${style.serviceRow}`} xl={4}>
                                {offers.length>0
                                ?serviceValueCol
                                :"eleman yok"
                                }
                                
                                
                            </Row>
                            
                            
                        </div>
                    </Card>
                </div>
            </div>
            </Container>
        </>
    )
}

export default UserProfilePage