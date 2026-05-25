const mongoose = require("mongoose")

const {Schema} = mongoose


const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    }, 
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true
    },
    tags:{
        type:String,
        enum:['array','linkedlist','graph','dp'],
        required:true
    },
    //  their can be many visibleTestCase so we take them as array of objects
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explaination:{
                type:String,
                required:true
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
        }
    ]
    ,
    startCode:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreator:{
        // we can store the object id of the admin
        type:Schema.Types.ObjectId,
        ref:'user', // reference is user schema
        required:true
    },
    referenceSolution:[
        {
            language:{
                type:String,
                required:true
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ]
})


const Problem = mongoose.model("problem",problemSchema) 

module.exports = Problem    