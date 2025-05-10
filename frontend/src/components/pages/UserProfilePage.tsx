import { useNavigate, useParams } from "react-router-dom"
import style from "../../styles/UserProfilePage.module.css"
import { Button, Card, Col, Container, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import * as OffersApi from "../../network/offers_api"

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
    
    const fetchOffers = async() =>{
        try {
            const fetchedOffers = await OffersApi.fetchOffersForUserProfile(username)
             setOffers(fetchedOffers)
        } catch (error) {
            console.error(error)
            alert("userProfile offer fetch error")
        }
        
    }
    useEffect(()=>{
        document.body.style.backgroundColor= "#FAFAFA" //1 kere profile girince, diğer urller de gri oluyor, direkt sitenin document değişiyor komple
        fetchOffers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

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
                                <span>member since</span>
                            </div>
                            <div className="">
                                <span>1999 june</span>
                            </div>
                        </div>

                        <p className= {`${style.marginTB2} border-top`}></p>

                        <div className={`${style.dateDiv}`}>
                            <div className="">
                                <span >Succesful delivery</span>
                            </div>
                            <div className="">
                                <p className={`${style.totalOrder}`}>%100</p>
                                <span >total lifetime orders: 4222</span>
                            </div>
                        </div>

                        <p className= {`${style.marginTB2} border-top`}></p>

                        <div className={`${style.dateDiv}`}>
                            <div className="">
                                <p>last 90 days</p>
                                <p>all time rating</p>
                            </div>
                            <div className={`${style.dateDiv}`}>
                                <div className={`${style.text_green}`}>
                                    <p onClick={()=>{}}>%91.88</p>
                                    <p>%96.34</p>
                                    
                                </div>
                                <div className={`${style.text_red}`}>
                                    <p>%8.12</p>
                                    <p>%3.66</p>
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