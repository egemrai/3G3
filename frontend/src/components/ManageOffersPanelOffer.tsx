import { Card, Dropdown } from "react-bootstrap"
import  * as LolModels  from "../models/offers/LolOfferModels"
import * as ValorantModels from "../models/offers/ValorantOfferModels"
import style from "../styles/ManageOffersPanelOffer.module.css"
import { useNavigate } from "react-router-dom"
import * as services_api from "../network/serviceForm_api"
import { deleteOfferURLQUery } from "../network/serviceForm_api"

interface ManageOffersPanelOfferProps{
    offer: LolModels.LolAccount| LolModels.LolBoost|LolModels.LolCoach|LolModels.LolRP|ValorantModels.ValorantAccount|
    ValorantModels.ValorantBoost|ValorantModels.ValorantCoach|ValorantModels.ValorantVP,
    refetchOffersForManageOffersPage: ()=> void

}

const ManageOffersPanelOffer = ({offer,refetchOffersForManageOffersPage}:ManageOffersPanelOfferProps) => {

    
    const navigate = useNavigate()

    const goEditOfferWithData = () => {
        navigate("/editOffer/?_id="+ offer._id+"&serviceName="+offer.serviceName+"", { state: { offer: offer } })
    }

    const deleteOffer= async (deleteOfferData:deleteOfferURLQUery) => {
    
        await services_api.deleteOffer(deleteOfferData)
        refetchOffersForManageOffersPage()
    }



    return ( 
    <>
        <Card className={style.card}>
            <div className={style.cardDiv}>
                <div className={style.titleDiv}>
                    <h6 className={style.title}>{offer.title}</h6>
                    <p className={style.idServiceP}>id:{offer._id}</p>
                    <p className={style.idServiceP}>{`${offer.categoryName +"-"+ offer.serviceName.replace(offer.categoryName,"") }`}</p>
                </div>
                <div className={style.test}>{offer.stock}</div>
                <div className={style.test}>{offer.currency}</div>
                <div
                    className={style.test}>{offer.price}
                    
                 </div>
                <Dropdown>
                <Dropdown.Toggle className={style.toggle} variant="Primary" id="dropdown-basic">
                    ⌘
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>{goEditOfferWithData()}}>Edit Offer</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{deleteOffer(offer)}}>Delete Offer</Dropdown.Item>
                </Dropdown.Menu>
                
                </Dropdown>
            </div>
                
            
        </Card>
    </>
    )
}

export default ManageOffersPanelOffer