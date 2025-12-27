import { FallbackProps} from "react-error-boundary"
import style from "../styles/ErrorFallback.module.css"
import { Modal, ModalBody, ModalHeader } from "react-bootstrap"
import { useState } from "react"

interface ErrorFallbackProps extends FallbackProps{ // salak olduğum için Modal'ı başka component içinde kapatırım diye düşündüm önce
    handleClose: ()=>void
}

const ErrorFallback:React.FC<FallbackProps> = ({ error, resetErrorBoundary }: FallbackProps) => {

    const [showModal,setShowModal] = useState<Boolean>(true)

    const handleClose = () =>{
        setShowModal(false)
    }

    return (
        <>
        {showModal &&
            <Modal centered container={document.body} show onHide={handleClose} className={`${style.modal}`}>
                <button className={`${style.closeButton}`} onClick={handleClose}>x</button>
                <ModalHeader>
                    <h2>Bir şeyler ters gitti.</h2>
                </ModalHeader>
                <ModalBody>
                    <p className={`${style.errorMessage}`}>
                        {error.message}
                    </p>
                    <button className={`${style.resetButton}`}
                    onClick={()=>resetErrorBoundary()}>
                        Tekrar dene
                    </button>
                </ModalBody>  
            </Modal>}
        </>
    )
}

export default ErrorFallback