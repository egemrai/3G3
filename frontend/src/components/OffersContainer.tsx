import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import * as offers_api from "../network/offers_api"
import { Button, Col, Container, Row } from "react-bootstrap"
import OfferSmall from "./OfferSmall"
import sytle from "../styles/OffersContainer.module.css"

const OffersContainer= () => {
    const URLParams= useParams<{category: string, service: string}>()
    const location = useLocation()

    //URL search parametrelerindeki datayı almak için kullandım
    const searchParams = new URLSearchParams(location.search)
    const username = searchParams.get("username")
    const page = searchParams.get("page")
    
    //OFFER FETCH KISMI
    const [offers, setOffers]= useState<any[]>([])
    let fetchedOffers
    const getOffers= async() => {
        try {
            if(!URLParams.category || !URLParams.service){
                throw new Error("URLParams(category ya da service) yok")
            }
            if(username){//UserProfilePage'den service tıklanırsa, sadece profilinden tıklanan kullanıcının offerlerını fetch ediyor
                fetchedOffers = await offers_api.fetchOffers(URLParams.category, URLParams.service,username)
            }else{
                fetchedOffers = await offers_api.fetchOffers(URLParams.category, URLParams.service)
            }
            setOffers(fetchedOffers)
            // sayfa ilk açıldığında currentPage set yapıyoruz
            if(page){
                setCurrentPage(Math.trunc(Number(page))) //önce Number ile paramdaki page stringini çevirdik, sonra Math.trunc ile ondalık kısmı attık
            }
        } catch (error) {
            console.error(error)
            // alert(error+ query)
        }
    }


    //PAGINATION AYARLAMA KISMI
    const [currentpage, setCurrentPage] = useState<number>(1)
    const offersPerPAge = 6;
    const offersLenght = offers.length
    const totalPages = Math.ceil(offersLenght/offersPerPAge)
    const startIndex = (currentpage-1)* offersPerPAge

    //OFFERS COL KISMI
    const offersGrid = <Row  className={`${sytle.offersRow} `} xs={1} sm={2} md={3} xl={4}>
                                {offers.map(offer => (
                                    <Col key={offer._id}>
                                        <OfferSmall
                                        offerSmall={offer}
                                        />
                                    </Col>
                                )).slice(startIndex,startIndex+ offersPerPAge)}  
                            </Row>   //slice  [0,30) şeklinde çalışıyor 0.eleman var 30. yok, total 30 eleman

    useEffect(()=>{

        getOffers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <>
            <Container>
                {offers.length>0
                ? <> 
                <div className={`${sytle.offersParentDiv}`}>
                    {offersGrid} 
                </div>

                {/* offer prev next page BUTTON*/}
                {totalPages>0 &&
                <div className={`${sytle.pageButtonDiv}`}> 
                    <Button className={`${sytle.pageButton} ${sytle.pageButtonEdge}`}
                    disabled={currentpage===1}
                    onClick={()=>setCurrentPage(currentpage-1)}
                    >
                    {"<"}
                    </Button>

                    {(totalPages<6 || currentpage<4) &&
                    <>
                        <Button className={`${sytle.pageButton}`}
                        disabled={currentpage===1}
                        onClick={()=>setCurrentPage(1)}>
                        {"1"}
                        </Button>

                        {totalPages>=2 && <Button className={`${sytle.pageButton}`}
                        disabled={currentpage===2}
                        onClick={()=>setCurrentPage(2)}>
                            {"2"}
                        </Button>}

                        {totalPages>=3 && <Button className={`${sytle.pageButton}`}
                        disabled={currentpage===3}
                        onClick={()=>setCurrentPage(3)}>
                            {"3"}
                        </Button>}

                        {totalPages>=4 && <Button className={`${sytle.pageButton}`}
                        onClick={()=>setCurrentPage(4)}>
                            {"4"}
                        </Button>}

                        {totalPages>=5 && <Button className={`${sytle.pageButton}`}
                        onClick={()=>setCurrentPage(5)}>
                            {"5"}
                        </Button>}
                    </>}
                    
                    
                    {(3<currentpage && currentpage<totalPages-2) &&
                    <>
                        <Button className={`${sytle.pageButton}`}
                        onClick={()=>setCurrentPage(currentpage-2)}>
                            {currentpage-2}
                        </Button>

                        <Button className={`${sytle.pageButton}`}
                        onClick={()=>setCurrentPage(currentpage-1)}>
                            {currentpage-1}
                        </Button>

                        <Button className={`${sytle.pageButton}`}
                        disabled={true}
                        onClick={()=>setCurrentPage(currentpage)}>
                            {currentpage}
                        </Button>

                        <Button className={`${sytle.pageButton}`}
                        onClick={()=>setCurrentPage(currentpage+1)}>
                            {currentpage+1}
                        </Button>

                        <Button className={`${sytle.pageButton}`}
                        onClick={()=>setCurrentPage(currentpage+2)}>
                            {currentpage+2}
                        </Button>
                    </>}

                    {(currentpage=== totalPages|| currentpage=== totalPages-1|| currentpage=== totalPages-2) && totalPages>5 &&
                    <>
                        <Button className={`${sytle.pageButton}`}
                        onClick={()=>setCurrentPage(totalPages-4)}>
                            {totalPages-4}
                        </Button>

                        <Button className={`${sytle.pageButton}`}
                        onClick={()=>setCurrentPage(totalPages-3)}>
                            {totalPages-3}
                        </Button>

                        <Button className={`${sytle.pageButton}`}
                        disabled={currentpage===totalPages-2}
                        onClick={()=>setCurrentPage(totalPages-2)}>
                            {totalPages-2}
                        </Button>

                        <Button className={`${sytle.pageButton}`}
                        disabled={currentpage===totalPages-1}
                        onClick={()=>setCurrentPage(totalPages-1)}>
                            {totalPages-1}
                        </Button>

                        <Button className={`${sytle.pageButton}`}
                        disabled={currentpage===totalPages}
                        onClick={()=>setCurrentPage(totalPages)}>
                            {totalPages}
                        </Button>
                    </>}

                    <Button className={`${sytle.pageButton } ${sytle.pageButtonEdge}`}
                    disabled={currentpage===totalPages}
                    onClick={()=>setCurrentPage(currentpage+1)}
                    >
                    {">"}
                    </Button>
                </div>}
                
                </>
                
                
                

                : <p>ürün yok</p>}

            
            </Container>
        </>
    )
}

export default OffersContainer