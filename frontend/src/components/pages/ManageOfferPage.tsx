import { useEffect, useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import * as OfferApi from "../../network/offers_api"
import style from "../../styles/ManageOfferPage.module.css"
import ManageOffersPanelOffer from "../ManageOffersPanelOffer"
import  * as LolModels  from "../../models/offers/LolOfferModels"
import * as ValorantModels from "../../models/offers/ValorantOfferModels"
import { useLocation } from "react-router-dom"



const ManageOfferPage = () => {

    const location = useLocation()
    
    //URL search parametrelerindeki datayı almak için kullandım
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page")

    const [allOffers, setAllOffers] = useState<any>([])
  
    async function fetchAllOffers() {
        try {
            const fetchedOffers = await OfferApi.fetchOffersForManageOffers()
            
            setAllOffers(fetchedOffers)
             console.log(fetchedOffers)
        } catch (error) {
            console.error(error)
            alert("fetchh manage offers page error")
        }
    }


    useEffect(
        ()=>{
            fetchAllOffers()
            if(page){
                setCurrentPage(Math.trunc(Number(page)))
            }
        }
        ,[])

    //PAGINATION AYARLAMA KISMI
    const [currentpage, setCurrentPage] = useState<number>(1)
    const offersPerPAge = 30;
    const offersLenght = allOffers.length
    const totalPages = Math.ceil(offersLenght/offersPerPAge)
    const startIndex = (currentpage-1)* offersPerPAge

    const allOffersGrid = allOffers.map((offer:LolModels.LolAccount| LolModels.LolBoost|LolModels.LolCoach|LolModels.LolRP|ValorantModels.ValorantAccount|
        ValorantModels.ValorantBoost|ValorantModels.ValorantCoach|ValorantModels.ValorantVP,index:any)=>{
            return(
            <ManageOffersPanelOffer
                offer={offer}
                refetchOffersForManageOffersPage={()=> setAllOffers(allOffers.filter((existingOffer:any)=>{ return existingOffer._id!==offer._id}))} //alt component için fonksiyon, silinen offer'ı  offer listesinden atmak için
                key={index}/>
            )
        
    }).slice(startIndex,startIndex+ offersPerPAge)
       //slice  [0,30) şeklinde çalışıyor 0.eleman var 30. yok, total 30 eleman
    


    return(
        <>
            <Container>
            <br/>
                <div className={style.cardDiv}>
                    <p>Title</p>
                    <p>Stock</p>
                    <p>Currency</p>
                    <p>Price</p>
                    <p>Actions</p>
                </div>
                {allOffersGrid.length>0
                ?allOffersGrid
                :<p>HİÇ OFFERIN YOK</p>}
            <br/>
               
               
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

export default ManageOfferPage