import "dotenv/config"
import express, { Request, Response, NextFunction} from "express"
import morgan from "morgan"
import offerRoutes from "./routes/offersR"
import userRoutes from "./routes/usersR"
import categoryRoutes from "./routes/categoriesR"
import createOfferRoutes from "./routes/createEditOffersR"
import chatRoutes from "./routes/chatR"
import createHttpError from "http-errors"
import {isHttpError} from "http-errors"
import session from "express-session"
import MongoStore from "connect-mongo"
import env from "./util/validateEnv"  // normalde env diye bir şey yok, validateEnvden process.env import edip adını env olarak kullandım
import cors from "cors"



const app = express()

app.set("trust proxy", true)

//cors'u production kısmı için ihtiyaç var diye ekledim, denicem
app.use(cors({
  origin: ["https://docker-3g3-frontend.onrender.com",env.FRONTEND_SITE_URL,"https://threeg3.vercel.app", "http://localhost:3000"], // Frontend adresi  
  credentials: true
}))

app.use(morgan("dev"))
app.use(express.json()) // req.body parse etmek için gerekli

//export için session'ı ekstra yazdım ve app.use() içine Session olarak ekledim
export const Session = session({ 
    secret:env.SESSION_SECRET,
    resave: false,              //Eğer oturumda bir değişiklik yoksa, her istekte veritabanına yazma yapılmaz. 
    saveUninitialized: false,
    cookie: {
        maxAge: 720 * 60 * 60 * 1000,
        httpOnly: true,
        secure: env.EGE === "production",//process.env.NODE_ENV === "production",          //secure production ise true olması lazım,
        sameSite: env.EGE === "production" ? "none" : "lax"      //sameSite production ise bunun da none olması lazım
    },
    rolling: true,              //her get,post,vs. requestlerde(sayfa yenileme gibi) session süresini yeniliyor
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
})

app.use(Session)

app.use("/api/offers", offerRoutes)

app.use("/api/category", categoryRoutes)

app.use("/api/users", userRoutes)

app.use("/api/createOffer", createOfferRoutes)

app.use("/api/chat", chatRoutes)


app.use((req, res, next) => {
    next(createHttpError(404, "endpoint not found"))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {   //express error handler old. anlasın diye arg'ları düzgün ve aynı şekilde ver
    console.error(error);
    let errorMessage = "An unknown error occurred"
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({error: errorMessage});  //üstteki json içine object yazmamıştık çünkü array(notes) olunca otoatik hallediyor
});

export default app

