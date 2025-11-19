import { FallbackProps} from "react-error-boundary"
import style from "../styles/ErrorFallback.module.css"

const ErrorFallback:React.FC<FallbackProps> = ({ error, resetErrorBoundary }: FallbackProps) => {

    return (
        <>
            <div className={`${style.div}`}>
                <h2>Bir şeyler ters gitti.</h2>
                <p className={`${style.errorMessage}`}>
                    {error.message}
                </p>
                <button className={`${style.resetButton}`}
                onClick={()=>resetErrorBoundary()}>
                    Reset Error
                </button>
            </div>
        </>
    )
}

export default ErrorFallback