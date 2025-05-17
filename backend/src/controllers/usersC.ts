import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt"


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
        res.status(200).json(user)

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