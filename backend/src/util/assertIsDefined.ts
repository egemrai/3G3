export function assertIsDefined<T>(val: T): asserts val is NonNullable<T>{ //asserts burda anahtar kelime, cümle komple bi kalıp
    if(!val){
        throw new Error("Expected 'val' to be defined, but receiver " + val)
    }
}
//T herhangi bir tür olabilir, NonNullable sayesinde null ya da undefined olamaz. T'ye tür atandıktan sonra değişemez, yani 
//  parametre olarak string alırsa, return de string olmalı.(sanırm chatgpt baktım emin değilim)

//BUNU EKLEMEYE GEREK YOK SANIRIM, ZATEN MIDDLEWARE LOGINCHECK İLE USERID CHECK YAPIYORUZ