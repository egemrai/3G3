import { Form, Modal } from "react-bootstrap"
import style from "../../../styles/OffersFilterModal.module.css"
import { UseFormRegister } from "react-hook-form"
import { useState } from "react"


interface OffersSortModalProps{
    register: UseFormRegister<any>
    sortData: string[]
}

const OffersSortModal =  ({register,sortData}:OffersSortModalProps) => {

const [showModal, setShowModal] = useState<boolean>(false)

const sortCheckgrid = Array.from({length: sortData.length},(_,i) => {
        return(
            <Form.Check key={i}
                type= {'radio'}
                label= {sortData[i]}
                value= {sortData[i]}
                {...register(`sort`,{required:true})}
            />
        )
})

    return  (
        <>
            <div onClick={()=>setShowModal(true)} className= {`${style.filterDiv}`}>
                <p className={`${style.filterNameP}`}>Sort</p>
            </div>
            <Modal backdrop={true} show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Body>
                    <Modal.Title>
                        {'Sort'}
                    </Modal.Title>
                    <div className={`${style.checkboxFilterDiv}`}>
                        {sortCheckgrid}   
                    </div>
                </Modal.Body>
            </Modal>
        </>
        
        
    )
}

export default OffersSortModal