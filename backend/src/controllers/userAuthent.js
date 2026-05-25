// User will help us to interact with User Model
const redisClient = require("../config/redis")
const User = require("../models/user")
const validate = require("../utils/validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Submission = require("../models/submission")

const register = async (req,res)=>{
    // user will give you firstName,emailId,password( these 3 are required fields), you have to store them in db
    try{
        //check they are not empty fields and check if they are valid (make a validate function in utility)
        validate(req.body)

        // now the user is valid if no error occured
        const {firstName,emailId,password} = req.body

        // hash the password before storing into database (use bcrypt library)
        req.body.password = await bcrypt.hash(password,10) // 10 is no of hashing rounds
        req.body.role = "user" // register the user as user always
        
        // store in db
        const user =  await User.create(req.body)

        // send a token to user and store emailId in the token
        // we require a key for sign the token 
        // we can generate a randome jwt key using the  command
        const token = jwt.sign({_id:user._id,role:"user",emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60})

        // store the token into cookie
        res.cookie("token",token,{maxAge:60*60*1000}) // maxAge is expire time of cookie in milliseconds

        //sending the data to frontend
        const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role,
        }
        res.status(201).json({
            user:reply,
            message:"Register Successfully!"
        })
    }
    catch (err){
        res.status(400).send("Error : "+err)
    }
}

const login = async (req,res)=>{
    try{
        // user send the emailId,password,just match the emailId and password
        const {emailId,password} = req.body
        // check email and password exist in request
        if(!emailId){
            throw new Error("Invalid Credentials")
        }
        if(!password){
            throw new Error("Invalid Credentails")
        }
        
        // fetch the user from db using its emailId
        const user = await User.findOne({emailId})

        // if not found throw error
        if(!user){
            throw new Error("Invalid Credentails")
        }
        
        const isMatch = await bcrypt.compare(req.body.password,user.password)
       
        if(!isMatch){
            throw new Error("Invalid Credentials password")
        }
        
        //  if email and password match send the token 
        const token = jwt.sign({_id:user._id,role:user.role,emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60})

        // store the token into cookie
        res.cookie("token",token,{maxAge:60*60*1000}) // maxAge is expire time of cookie in milliseconds

        // sending the data in json format to frontend
        const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            role:user.role,
            _id:user._id
        }
        
        res.status(201).json({
            user:reply,
            message:"Logged In Successfully!"
        })
        

    }
    catch (err){
        res.status(401).send("Error : "+err)
    }
}

const logout = async (req,res)=>{
    // user send the cookie , simply make them invalid(block the token using redis database)
    try{
        // if the token is valid
        // then we store the token into redis db so that we can mark it block
        const {token} = req.cookies
        //  we fetch the payload because it have the token expiry date
        const payload = jwt.decode(token)
        await redisClient.set(`token:${token}`,"Blocked")
        //  set the expiry of token
        await redisClient.expireAt(`token:${token}`,payload.exp)
        // clear the cookie
        res.cookie("token",null,{expires: new Date(Date.now())})
        res.status(200).send("Logout successfully")
    }
    catch (err){
        res.status(401).send("Error :"+err)
    }
}

const getProfile = async (req,res)=>{
    try{
        res.status(200).send(req.result)
    }
    catch(err){
        res.send(500).send("Error : "+err)
    }
}
// admin can register a user as a admin or user
const adminRegister = async (req,res)=>{
    // user will give you firstName,emailId,password( these 3 are required fields), you have to store them in db
    try{
        //check they are not empty fields and check if they are valid (make a validate function in utility)
        validate(req.body)

        // now the user is valid if no error occured
        const {firstName,emailId,password} = req.body

        // hash the password before storing into database (use bcrypt library)
        req.body.password = await bcrypt.hash(password,10) // 10 is no of hashing rounds
        
        // store in db
        const user =  await User.create(req.body)

        // send a token to user and store emailId in the token
        // we require a key for sign the token 
        // we can generate a randome jwt key using the  command
        const token = jwt.sign({_id:user._id,role:user.role,emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60})

        // store the token into cookie
        res.cookie("token",token,{maxAge:60*60*1000}) // maxAge is expire time of cookie in milliseconds


        res.status(201).send("User Register Successfully!")
    }
    catch (err){
        res.status(400).send("Error : "+err)
    }
}


const deleteProfile = async(req,res)=>{
    try{
        const userId = req.result._id
        await User.findByIdAndDelete(userId)
        // delete the submission of the user also
        // method1
        // await Submission.deleteMany({userId})
        // method 2 code is in User Model
        res.status(200).send("Profile Deleted successfully")
    }
    catch(err){
         res.status(500).send("Internal Server Error")
    }
}

module.exports = {register,login,logout,getProfile,adminRegister,deleteProfile}