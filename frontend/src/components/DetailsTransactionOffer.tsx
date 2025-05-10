import { Modal } from "react-bootstrap"
import { SoldOffer } from "../models/SoldOffer"
import style from "../styles/TransactionPage.module.css"

interface DetailsTransactionOfferProps{
    offer: SoldOffer
    onHide: ()=>void
}

const DetailsTransactionOffer= ({offer,onHide}:DetailsTransactionOfferProps) =>{
    const details = offer.offerDetails
    return (
        <Modal  show onHide={onHide}> {/* onHide Modal dışına tıklayınca çalışan bir fonksiyon*/}
           
            <Modal.Body className={`${style.modal}`}>
                <Modal.Title>
                    Order Details
                </Modal.Title>
                <p>Title: {offer.title}</p>
                {details.server !=="" && <p>Server: {details.server}</p>}
                {details.rank !=="" && <p> Rank: {details.rank}</p>}
                {details.champions !=="" && <p> Champions: {details.champions}</p>}
                {details.agents !=="" && <p> Agents: {details.agents}</p>}
                {details.skins !=="" && <p> Skins: {details.skins}</p>}
                {details.serviceType !=="" && <p> ServiceType: {details.serviceType}</p>}
                {details.desiredRank !=="" && <p> DesiredRank: {details.desiredRank}</p>}
                <p>Description: {offer.description}</p>
            </Modal.Body>

        </Modal>
    )
}

export default DetailsTransactionOffer