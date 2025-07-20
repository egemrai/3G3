import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt"
import { io } from "../server";
import { userSocketMap } from "../server";

export const GetloggedInUser: RequestHandler = async (req, res, next) => {
    const userId= req.session.userId
    
    try {
        if(!userId){
            throw createHttpError(404, "session userId yok")
        }    
        const loggedInUser = await UserModel.findById(userId).select("email username").exec()

        if(!loggedInUser){
            throw createHttpError(404, "user yok")
        }  
            
        res.status(200).json(loggedInUser)

    } catch (error) {
        next (error)
    }
}

interface signUpBody{
    username: string,
    email: string,
    password: string
}

export const SignUp:RequestHandler<unknown, unknown, signUpBody, unknown> = async(req, res, next) => {
    const username= req.body.username
    const email= req.body.email
    const passwordRaw= req.body.password
    
    try {
        if(!username || !email || !passwordRaw){
            throw createHttpError(404,"missing parameters")
        }
        
        const takenUsername= await UserModel.findOne({username: username}).exec()
        if(takenUsername){
            throw createHttpError(409,"username already taken")
        }

        const takenEmail= await UserModel.findOne({email: email}).exec()
        if(takenEmail){
            throw createHttpError(409, "email already taken")
        }

        const hashedPassword= await bcrypt.hash(passwordRaw,10)

        const newUser= await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword
        })

        req.session.userId= newUser._id
        
        res.status(200).json(newUser)


    } catch (error) {
        next(error)
    }
}

interface loginBody{
    username: string,
    password: string
}

export const login:RequestHandler<unknown, unknown, loginBody, unknown>= async(req, res, next) => {
    const username= req.body.username
    const password= req.body.password

    try {
        if(!username || !password){
            throw createHttpError(400, "missing parameters")
        }
        const user= await UserModel.findOne({username: username}).select("password").exec()

        if(!user){
            throw createHttpError(400, "invalid credentials")
        }
        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            throw createHttpError(400, "invalid credentials")
        }
        
        req.session.userId= user._id
        req.session.save(err => {
            if (err) return next(err);
            res.status(200).json(user);
        })
        // res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy( error => {
        if(error){
            next(error)
        }
        else{
            res.sendStatus(200)
        }
    })
}

interface fetchUsernameQuery{
    _id:string
}
export const fetchUsername: RequestHandler<unknown,unknown,unknown,fetchUsernameQuery> = async(req,res,next)=>{
    const _id = req.query._id
    try {
        const response = await UserModel.findById(_id).select("username")
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const getloggedInUserId:RequestHandler = async(req,res,next)=>{
    const userId = req.session.userId
    try {
        res.status(200).json(userId)
    } catch (error) {
        next(error)
    }
}

export const fetchloggedInUser:RequestHandler = async(req,res,next)=>{
    const userId = req.session.userId 
    try {
        const response = await UserModel.findById(userId)
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

interface fetchUserIdByUsernameURL{
    username:string
}
export const fetchUserIdByUsername:RequestHandler<unknown,unknown,unknown,fetchUserIdByUsernameURL> = async(req,res,next)=>{
    const username = req.query.username
    try {
        if(!username){
            throw createHttpError(400,"fetchUserIdByUsername, username missing")
        }
        const response = await UserModel.findOne({username:username}).select("_id createdAt")
        const month = response?.createdAt.getMonth()
        const fullYear = response?.createdAt.getFullYear()
        const ege = {id:response?._id,
                    month:month,
                    fullYear: fullYear
        }
        
        res.status(200).json(ege)
    } catch (error) {
        next(error)
    }
}

export const setUserOnline:RequestHandler<unknown,unknown,unknown,setUserOfflineQuery> = async(req,res,next)=>{
    const userId= req.query.id
    try {
        if(!userId){
            throw createHttpError(400,"setUserOnline userId yok")
        }
        const fetchedUser = await UserModel.findById(userId)
        if(!fetchedUser){
            throw createHttpError(400,"setUserOnline fetchedUser yok")
        }
        fetchedUser.online = true
        await fetchedUser.save()
        
        res.status(200).json(true)
    } catch (error) {
        next(error)
    }
}

interface setUserOfflineQuery{
    id:string
}
export const setUserOffline:RequestHandler<unknown,unknown,unknown,setUserOfflineQuery> = async(req,res,next)=>{  //offline olduğu saati de kaydediyorum lastSeen hesaplamak için
    const userId= req.query.id
    try {
        if(!userId){
            throw createHttpError(400,"setUserOffline userId yok")
        }
        
        const userSockets = userSocketMap.get(userId)

        //serverda setUserOffline'ın başına await eklemeyi unuttuğum için socketi direkt kapatıyormuş, o yüzden başta !userSockets ile if'e sokmuştum
        if(userSockets && userSockets.length ===1){ //pc ve telefondan siteye girmişse 2 sockete sahip olunuyor. Biri kapandığında hala 1 socket kalacağı için !userSockets ile hiç socket kalmadığını anlayınca offline yapıyoruz
            const fetchedUser = await UserModel.findById(userId)
            if(!fetchedUser){
                throw createHttpError(400,"setUserOffline fetchedUser yok")
            }
            const date = new Date()
            fetchedUser.online = false
            fetchedUser.lastOnline = date
            await fetchedUser.save()

            res.status(200).json(true)
        }
        
    } catch (error) {
        next(error)
    }
}

interface fetchUserQuery{
    _id:string
}
export const fetchUser: RequestHandler<unknown,unknown,unknown,fetchUserQuery> = async(req,res,next)=>{
    const _id = req.query._id
    if(!_id){
        throw createHttpError(400,"fetchUser missing _id")
    }
    try {
        const response = await UserModel.findById(_id)
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


interface setWritingToQuery{
    _id:string
    toNullCheck:string
    selectedConversationId:string
}
export const setWritingTo: RequestHandler<unknown,unknown,unknown,setWritingToQuery> = async(req,res,next)=>{
    const receiverId = req.query._id
    const toNullCheck = req.query.toNullCheck
    const selectedConversationId = req.query.selectedConversationId
    const senderId = req.session.userId
    try {
        if(!senderId || !toNullCheck || !receiverId || !selectedConversationId){
        throw createHttpError(400,"setWritingTo missing parameters")
        }

        const response = await UserModel.findById(senderId)
        if(!response){
            throw createHttpError(400,"setWritingTo missing response")
        }

        //Socket.emit kısmı
        const receiverSockets = userSocketMap.get(receiverId.toString())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function socketSetWritingTo(receiver:any, toNullCheck:boolean){
            if(receiverSockets){
                receiverSockets.forEach(eachSocketId =>{
                    io.to(eachSocketId).emit("socketSetWritingTo",{
                        writingToUser:receiver,
                        senderId:senderId,
                        toNullCheck:toNullCheck,
                        selectedConversationId:selectedConversationId
                    })
                })
            }
        }

        
        console.log("response:",response)
        console.log("response:",response)
        if(toNullCheck=== "true"){
            console.log("null response:" ,response)
            console.log("toNullCheck null için:" ,toNullCheck)
            response.writingTo = null
            await response.save()
            socketSetWritingTo(response,true)
        }
        else{
            console.log("setId response:" ,response)
            console.log("toNullCheck setId için:" ,toNullCheck)
            response.writingTo = receiverId
            await response.save()
            socketSetWritingTo(response,false)
        }

        
        
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}