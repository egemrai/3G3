import mongoose from "mongoose"

//tsconfig kısmında typeRoots kısmına @type eklemek gerekiyor

//express-session kullanmak istediğin zaman session'a özel type eklemek gerekiyor, 
//controllers/users.ts kısmında kullanılan userId sessionı örn.

declare module "express-session" {
    interface SessionData{
    userId: mongoose.Types.ObjectId
    }
}

//tsconfig'e "./node_modules/@types", "./@types" ekliyoruz
//çünkü olan türü genişlettiğimiz için, hem eskisi hem de yenisi ekleniyor

//ÖNEMLİ session ataması için, tsconfig sonuna bunu eklemeyi unutma
    // ,
    //   "ts-node": {
    //     "files": true
    //   }
//express-session.d.ts'in node.js tarafından derlenmesini sağlıyor sanırım.
//tip genişletmek için önemli
