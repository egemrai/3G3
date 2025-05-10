import { Card, Col, Form, Modal } from "react-bootstrap"
import { SoldOffer, SoldOfferForm } from "../models/SoldOffer"
import style from "../styles/TransactionPage.module.css"
import React from "react"
import { UseFormRegister,FieldErrors } from "react-hook-form"
 



interface FormTransactionCredentialsProps{
    offer: SoldOffer
    setCredentialsModalIndex: (x:number|null)=>void
    i: number
    credentialsModalIndex:number|null
    register: UseFormRegister<SoldOfferForm>
    errors:FieldErrors<SoldOfferForm>
}

const FormTransactionCredentials= ({offer,setCredentialsModalIndex,register,i,credentialsModalIndex,errors}:FormTransactionCredentialsProps) =>{
    


    return (
        <React.Fragment >
            <Col>
                <Card onClick={()=>setCredentialsModalIndex(i)}
                className={`${style.cardCredentials2}`}>
                    <Card.Title>{` ${offer.serviceName.replace(offer.categoryName,"")} #${i+1}`}</Card.Title>
                </Card>
            </Col>

            <Modal backdrop={true} show={credentialsModalIndex===i} onHide={()=>{setCredentialsModalIndex(null);console.log(credentialsModalIndex)}}> {/* onHide Modal dışına tıklayınca çalışan bir fonksiyon*/} 
            <Modal.Body className={`${style.modalForm}`}>
                <Modal.Title>
                    {i+1}. {offer?.serviceName.replace(offer.categoryName,"")} Credentials 
                </Modal.Title>

                                    {/* ACCOUNT İÇİN */}
                {offer.serviceName.replace(offer.categoryName,"") ==="Account" &&
                <>
                <Form.Group className={`${style.formGroup}`} controlId={"Account_Id"}>
                <Form.Label id="Account_Id">{"Account id:"}</Form.Label>
                <Form.Control 
                    {...register(`credentials.${i}.accountId`, {
                    required: "Required",
                    
                    })}
                    isInvalid={!!errors?.credentials?.[i]?.accountId}
                />
                {errors?.credentials?.[i]?.accountId?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.accountId?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"Account_Password"}>
                <Form.Label id="Account_Password">{"Account password:"}</Form.Label>
                <Form.Control 
                    {...register(`credentials.${i}.accountPassword`, {
                    required: "Required",
                    
                    })}
                    isInvalid={!!errors?.credentials?.[i]?.accountPassword}
                />
                {errors?.credentials?.[i]?.accountPassword?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.accountPassword?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"email"}>
                <Form.Label id="email">{"Email:"}</Form.Label>
                <Form.Control 
                    {...register(`credentials.${i}.email`, {
                    required: "Required",
                    
                    })}
                    isInvalid={!!errors?.credentials?.[i]?.email}
                />
                {errors?.credentials?.[i]?.email?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.email?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"emailPassword"}>
                <Form.Label id="emailPassword">{"Email password:"}</Form.Label>
                <Form.Control 
                    {...register(`credentials.${i}.emailPassword`, {
                    required: "Required",
                
                    })}
                    isInvalid={!!errors?.credentials?.[i]?.emailPassword}
                />
                {errors?.credentials?.[i]?.emailPassword?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.emailPassword?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"extraNotes"}>
                <Form.Label id="extraNotes">{"Extra notes:"}</Form.Label>
                <Form.Control 
                    {...register(`credentials.${i}.extraNotes`, {
                    required: "Required",
                    })}
                    isInvalid={!!errors?.credentials?.[i]?.extraNotes}
                />
                {errors?.credentials?.[i]?.extraNotes?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.extraNotes?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>
                </>}

                 {/* BOOST & COACH İÇİN */}
                 {(offer.serviceName.replace(offer.categoryName,"") ==="Coach" || 
                 offer.serviceName.replace(offer.categoryName,"") ==="Boost") &&
                 <>
                 <Form.Group className={`${style.formGroup}`} controlId={"orderConfirm"}>
                <Form.Label id="orderConfirm">{"Service delivered:"}</Form.Label>
                <Form.Select 
                    {...register(`credentials.${i}.serviceConfirm`, {
                    required: "Required",
                    setValueAs: (v) => v === "true", // string -> boolean dönüşümü
                    })}
                    
                    isInvalid={!!errors?.credentials?.[i]?.serviceConfirm}>
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Form.Select>
                {errors?.credentials?.[i]?.serviceConfirm?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.serviceConfirm?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"extraNotes"}>
                <Form.Label id="extraNotes">{"Extra notes:"}</Form.Label>
                <Form.Control 
                    {...register(`credentials.${i}.extraNotes`, {
                    required: "Required",
                    })}
                    isInvalid={!!errors?.credentials?.[i]?.extraNotes}
                />
                {errors?.credentials?.[i]?.extraNotes?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.extraNotes?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>
                 </>
                 }

                 {/* RP & VP İÇİN */}
                 {(offer.serviceName.replace(offer.categoryName,"") ==="RP" || 
                 offer.serviceName.replace(offer.categoryName,"") ==="VP") &&
                 <>
                 <Form.Group className={`${style.formGroup}`} controlId={"code"}>
                <Form.Label id="code">{"Code:"}</Form.Label>
                <Form.Control 
                    {...register(`credentials.${i}.code`, {
                    required: "Required",
                    })}
                    isInvalid={!!errors?.credentials?.[i]?.code}
                />
                {errors?.credentials?.[i]?.code?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.code?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className={`${style.formGroup}`} controlId={"extraNotes"}>
                <Form.Label id="extraNotes">{"Extra notes:"}</Form.Label>
                <Form.Control 
                    {...register(`credentials.${i}.extraNotes`, {
                    required: "Required",
                    })}
                    isInvalid={!!errors?.credentials?.[i]?.extraNotes}
                />
                {errors?.credentials?.[i]?.extraNotes?.message && (
                <Form.Control.Feedback type="invalid">
                    {errors?.credentials?.[i]?.extraNotes?.message}
                </Form.Control.Feedback>
                )}
                </Form.Group>
                 </>
                 }


            </Modal.Body>
        </Modal>
        </React.Fragment>
    )
}

export default FormTransactionCredentials