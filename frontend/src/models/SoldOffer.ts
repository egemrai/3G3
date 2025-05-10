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
    buyerRating:string
    stage:string
    offerDetails:Record<string, any>
    _id:string
    seenBySeller:boolean
    seenByBuyer:boolean
    createdAt:string
}

export interface SoldOfferForm{  // react hook form type'ı için bunu ekstra yaptım
    credentials: {
        accountId:string,
        accountPassword:string,
        email:string,
        emailPassword:string,
        serviceConfirm:boolean,
        code:string,
        extraNotes:string}[]
}

//git test


//pcden laptop'a test

//laptoptan pcye test

//pcden laptopa test