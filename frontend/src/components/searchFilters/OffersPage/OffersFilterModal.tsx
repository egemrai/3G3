import { Form, Modal, ModalBody } from "react-bootstrap"
import style from "../../../styles/OffersFilterModal.module.css"
import { useForm, UseFormRegister } from "react-hook-form"
import { Filter } from "./OffersFilterField"
import React, { useState } from "react"


interface OffersFilterModalProps{
    register: UseFormRegister<any>
    filterData: Filter
    filterName: string
}

const OffersFilterModal =  ({register,filterName,filterData}:OffersFilterModalProps) => {

const [showModal, setShowModal] = useState<boolean>(false)

const filterCheckgrid = Array.from({length: filterData.value.length},(_,i) => {
    if(filterData.type==='single' || filterData.type === 'multiple'){
        const type = filterData.type ==='multiple' ? 'checkbox' : 'radio'
            return(
                <Form.Check key={i}
                    type= {type}
                    label= {filterData.label[i]}
                    value= {filterData.value[i]}
                    {...register(`${filterName}`,{required:false})}
                />
            )
    }
    else if(filterData.type==='boolean'){
        return(
                <Form.Check key={i}
                    type= {'radio'}
                    label= {filterData.label[i]}
                    value= {(filterData.value[i] === 'true') as any}
                    {...register(`${filterName}`,{required:false})}
                />
            )
    }
    else if(filterData.type==='range'){
        return(
            <Form.Group key={i} className={`${style.rangeFilterElement}`} controlId={`${filterData.value[i]}`}>
                <Form.Label id={`${filterData.value[i]}`}>{`${filterData.value[i]} ${filterName}`}</Form.Label>
                    <Form.Control
                    type="number"
                    {...register(`${filterName}.${filterData.value[i]}`,{
                        required:false
                        })
                    }
                    />
            </Form.Group>    
            )
    } 
    return <></>
    
})

    return  (
        <>
            <div onClick={()=>setShowModal(true)} className= {`${style.filterDiv}`}>
                <p className={`${style.filterNameP}`}>{filterName[0].toUpperCase()+filterName.slice(1)}</p>
            </div>
            <Modal backdrop={true} show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Body>
                    <Modal.Title>
                        {filterName}
                    </Modal.Title>
                    <div className={filterData.type==='range' ? `${style.rangeFilterDiv}` : `${style.checkboxFilterDiv}`}>
                        {filterCheckgrid}   
                    </div>
                </Modal.Body>
            </Modal>
        </>
        
        
    )
}

export default OffersFilterModal