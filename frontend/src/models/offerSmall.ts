export interface OfferSmall{
    _id:string,
    sellerId: any,
    title: string,
    currency:string,
    price: number,
    categoryName: string,
    serviceName: string,
    server?: string,
    description?: string,
    [x:string]: any       // offer.api de promise<[]>yerine OfferSmall yazmak için x:string any eklemeyi denedim
                    //sellerUsername de eklediğim için x:string any belki işe yarar bakalım.
}

