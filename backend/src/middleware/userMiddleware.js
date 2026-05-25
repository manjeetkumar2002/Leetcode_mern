const jwt = require("jsonwebtoken")
const User = require("../models/user")
const redisClient = require("../config/redis")
//  middleware for validating the token
const userMiddleware = async (req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token){
            throw new Error("Token is not Present")
        }

        // validate the token using jwt
        // we generate this token using JWT_KEY,so verify it using key
        const payload = jwt.verify(token,process.env.JWT_KEY)
        
        //  payload contain the data we added during token creation 
        const {_id} = payload
        if(!_id){
            throw new Error("Invalid token")
        }

        // find the user if id present in token
        const result = await User.findOne({_id})

        if(!result){
            throw new Error("User doesnt exist")
        }

        // Does the token is present in redis db , if present token is blocked
        const isBlocked = await redisClient.exists(`token:${token}`)

        if(isBlocked){
            throw new Error("Invalid Token")
        }

        // store the result if token not present in redis
        req.result = result
        next()
    }
    catch(err){
        res.status(401).send("Error :"+err)
    }
}


module.exports = userMiddleware