import React from "react"



const logErrorToSentry = (error:Error, info: React.ErrorInfo) =>{
    console.error("Logged Error:", error)
    console.error("ComponentStack:", info.componentStack)
    // loglamayı halledince buraya da ekle
}

export default logErrorToSentry