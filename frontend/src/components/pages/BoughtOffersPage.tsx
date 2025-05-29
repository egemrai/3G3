import { Button, Container } from "react-bootstrap"
import * as OffersApi from "../../network/offers_api"
import { useEffect, useState } from "react"
import {SoldOffer} from "../../models/SoldOffer"
import OfferSoldOffersPage from "../OfferSoldOffersPage"
import { useLocation } from "react-router-dom"
import style from "../../styles/SoldOffersPage.module.css"  //soldOffers ile aynı old için style aynı

const BoughtOffersPage= () => {

    const location = useLocation()
        
    //URL search parametrelerindeki datayı almak için kullandım
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page")

    const [boughtOffers, setBoughtOffers] = useState<SoldOffer[]>([])

    async function fetchBoughtOffers() {
        try {
            const fetchedBoughtOffers = await OffersApi.fetchBoughtOffers() 
            console.log(fetchedBoughtOffers)
            setBoughtOffers(fetchedBoughtOffers)
        } catch (error) {
            console.log(error)
        }
        
    }



    useEffect(()=>{
        document.body.style.backgroundColor= "#FAFAFA"
        fetchBoughtOffers()
        if(page){
            setCurrentPage(Math.trunc(Number(page)))
        }
    }
        ,[])

    //PAGINATION AYARLAMA KISMI
    const [currentpage, setCurrentPage] = useState<number>(1)
    const offersPerPAge = 10;
    const offersLenght = boughtOffers.length
    const totalPages = Math.ceil(offersLenght/offersPerPAge)
    const startIndex = (currentpage-1)* offersPerPAge

    const allOffersGrid = boughtOffers.map((offer:SoldOffer,index:any)=>{
        return(<OfferSoldOffersPage
                offer={offer}
                key={index}/>
            )
    }).slice(startIndex,startIndex+ offersPerPAge)
       //slice  [0,30) şeklinde çalışıyor 0.eleman var 30. yok, total 30 eleman


  
    return(
        <>
        <Container>
            <h3>Bought Orders</h3>
            <br/>
            {allOffersGrid.length>0
            ?allOffersGrid
            :<p>Bought offer yok</p>}


                {/* offer prev next page BUTTON*/}
                {totalPages>0 &&
                <div className={`${style.pageButtonDiv}`}> 
                    <Button className={`${style.pageButton} ${style.pageButtonEdge}`}
                    disabled={currentpage===1}
                    onClick={()=>setCurrentPage(currentpage-1)}
                    >
                    {"<"}
                    </Button>

                    {(totalPages<6 || currentpage<4) &&
                    <>
                        <Button className={`${style.pageButton}`}
                        disabled={currentpage===1}
                        onClick={()=>setCurrentPage(1)}>
                        {"1"}
                        </Button>

                        {totalPages>=2 && <Button className={`${style.pageButton}`}
                        disabled={currentpage===2}
                        onClick={()=>setCurrentPage(2)}>
                            {"2"}
                        </Button>}

                        {totalPages>=3 && <Button className={`${style.pageButton}`}
                        disabled={currentpage===3}
                        onClick={()=>setCurrentPage(3)}>
                            {"3"}
                        </Button>}

                        {totalPages>=4 && <Button className={`${style.pageButton}`}
                        onClick={()=>setCurrentPage(4)}>
                            {"4"}
                        </Button>}

                        {totalPages>=5 && <Button className={`${style.pageButton}`}
                        onClick={()=>setCurrentPage(5)}>
                            {"5"}
                        </Button>}
                    </>}
                    
                    
                    {(3<currentpage && currentpage<totalPages-2) &&
                    <>
                        <Button className={`${style.pageButton}`}
                        onClick={()=>setCurrentPage(currentpage-2)}>
                            {currentpage-2}
                        </Button>

                        <Button className={`${style.pageButton}`}
                        onClick={()=>setCurrentPage(currentpage-1)}>
                            {currentpage-1}
                        </Button>

                        <Button className={`${style.pageButton}`}
                        disabled={true}
                        onClick={()=>setCurrentPage(currentpage)}>
                            {currentpage}
                        </Button>

                        <Button className={`${style.pageButton}`}
                        onClick={()=>setCurrentPage(currentpage+1)}>
                            {currentpage+1}
                        </Button>

                        <Button className={`${style.pageButton}`}
                        onClick={()=>setCurrentPage(currentpage+2)}>
                            {currentpage+2}
                        </Button>
                    </>}

                    {(currentpage=== totalPages|| currentpage=== totalPages-1|| currentpage=== totalPages-2) && totalPages>5 &&
                    <>
                        <Button className={`${style.pageButton}`}
                        onClick={()=>setCurrentPage(totalPages-4)}>
                            {totalPages-4}
                        </Button>

                        <Button className={`${style.pageButton}`}
                        onClick={()=>setCurrentPage(totalPages-3)}>
                            {totalPages-3}
                        </Button>

                        <Button className={`${style.pageButton}`}
                        disabled={currentpage===totalPages-2}
                        onClick={()=>setCurrentPage(totalPages-2)}>
                            {totalPages-2}
                        </Button>

                        <Button className={`${style.pageButton}`}
                        disabled={currentpage===totalPages-1}
                        onClick={()=>setCurrentPage(totalPages-1)}>
                            {totalPages-1}
                        </Button>

                        <Button className={`${style.pageButton}`}
                        disabled={currentpage===totalPages}
                        onClick={()=>setCurrentPage(totalPages)}>
                            {totalPages}
                        </Button>
                    </>}

                    <Button className={`${style.pageButton } ${style.pageButtonEdge}`}
                    disabled={currentpage===totalPages}
                    onClick={()=>setCurrentPage(currentpage+1)}
                    >
                    {">"}
                    </Button>
                </div>}

        </Container>
        </>
    )
}

export default BoughtOffersPage





