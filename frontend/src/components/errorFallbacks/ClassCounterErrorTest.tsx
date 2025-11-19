import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "../../utils/ErrorFallback"
import logErrorToSentry from "../../utils/logErrorToSentry"
import React from "react"
interface ClassCounterErrorTestProps{
    children: React.ReactNode
}

const ClassCounterErrorTest = ({children}:ClassCounterErrorTestProps)=> {

    // 🔹 Hata oluştuğu anda çalışır
  const handleError = (
    error: Error,
    info: React.ErrorInfo  //  {componentStack: string}
  ): void => {
    logErrorToSentry(error, info)
  }

  // 🔹 resetErrorBoundary çağrıldığında (mesela "Tekrar dene" butonuna basılınca) çalışır
  const handleReset = (): void => {
    // Burada "uygulamanın state'ini reset" edersin.
    // Örnek:
    // - form state'lerini sıfırlarsın
    // - seçili id'yi temizlersin
    // - redux / zustand store'u resetlersin
    // - belirli bir route'a navigate edersin, vs.
    console.log("ErrorBoundary reset edildi. Burada state'ini sıfırlayabilirsin.");
  }
    return(
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={handleError}
            onReset={handleReset}
            //resetKeys={} otomatik reset dalgasını dene sonra
            >
        {children}
        </ErrorBoundary>
    )
}

export default ClassCounterErrorTest