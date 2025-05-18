export interface SoldOffer{
    categoryName: string
    serviceName: string
    sellerId:string
    buyerId:string
    quantity:number
    currency:string
    description:string
    unitPrice:number
    totalAmount:number
    title:string
    sellerRating:string //alıcının satıcıya verdiği puan
    sellerComment:string//alıcının satıcıya yaptığı yorum
    sellerEditedRating:boolean //satıcının edit hakkı
    buyerRating:string
    buyerComment:string
    buyerEditedRating:boolean
    stage:string
    offerDetails:Record<string, any>
    offerCredentials:Record<string, any>[]
    _id:string
    seenBySeller:boolean
    seenByBuyer:boolean
    createdAt:string
}

export interface SoldOfferForm{  // react hook form type'ı için bunu ekstra yaptım
    offerCredentials: {
        accountId:string,
        accountPassword:string,
        email:string,
        emailPassword:string,
        serviceConfirm:string,
        code:string,
        extraNotes:string}[]
}

export interface SoldOfferEditRatingForm{  // react hook form type'ı için bunu ekstra yaptım
    rating:string
    comment:string
}
     