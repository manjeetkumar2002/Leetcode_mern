const mongoose = require("mongoose")

const {Schema} = mongoose


const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    problemSolved:{
        // array of strings
        type:[
            // store the problem id of the problems solved by the user
            {
                type:Schema.Types.ObjectId,
                ref:'problem',
            }
        ]
    } 
},{timestamps:true})

// postMethod for deleteing the submission of the user when he delte the profile (ye function baad me chalega jab profile delete hoga )
// ye post function tab chalega jab delete command chalega ie (findByIdAndDelete) ,in mongodb it is findOneAndDelete
// jab ham user ko delete karenge tab mongodb us user ko return karega doc me you can rename it to userInfo
userSchema.post('findOneAndDelete',async function (doc){
    if(doc){
        await mongoose.model('submission').deleteMany({userId:doc._id});
    }
})

// user is name of the model
const User = new mongoose.model("user",userSchema)


module.exports = User