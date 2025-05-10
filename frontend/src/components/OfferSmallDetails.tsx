import { Modal } from "react-bootstrap"


interface OfferSmallDetailsProps{
    closeDetails: ()=> void,
    description?: string,
    server?: string,
}

const OfferSmallDetails = ({description,server,closeDetails}:OfferSmallDetailsProps) => {


    return (
        <>
        <Modal show onHide={closeDetails}>
            <Modal.Body >
                {description &&
                    <p>açıklama: {description}</p>
                }
                
                {server &&
                    <p>server: {server}</p>
                }
            </Modal.Body>
        </Modal>
        
        </>
    )
}

export default OfferSmallDetails