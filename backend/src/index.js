const express = require("express");
const main = require("./config/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
// importing router
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator")
const submitRouter = require("./routes/submit")
const redisClient = require("./config/redis");
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator")
// cors issue solution
const cors = require("cors")


const app = express();
// parsing req.body and cookie data into js object
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))
// userAuth apis
app.use("/user",authRouter) 
app.use("/problem",problemRouter) 
app.use("/submission",submitRouter)
app.use("/ai",aiRouter)
app.use("/video",videoRouter)
// we will connect to both mongodb and redis and then we listen to server

const InitializeConnection = async ()=>{
    try{
      // connect both db
      await Promise.all([redisClient.connect(),main()])
      console.log("DB Connected")
      // listen to port 
      app.listen(process.env.PORT, () => {
      console.log("server listening at port number ", process.env.PORT);
    })
    }
    catch(err){
      console.log("Error : "+err)
    }
}

InitializeConnection()
