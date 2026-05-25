const cloudinary = require("cloudinary").v2
const Problem = require("../models/Problem")
const User = require("../models/user")
const SolutionVideo = require("../models/solutionVideo")

// config your cloudinary url := https://cloudinary.com/documentation/node_integration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})

const generateUploadSignature = async(req,res)=>{
    try{
        const {problemId} = req.params
        const {userId} = req.result._id
        //verify problem exists problem exists nhi karti to video upload karne ka kya fayda
        const problem = Problem.findById(problemId)

        if(!problem){
            return res.status(404).json({error:"Problem Not Found"})
        }
        // Generate unique public_id for the video
        const timestamp = Math.round(new Date().getTime() / 1000)
        const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`
        // upload parameters
        const uploadParams = {
            timestamp :timestamp,
            public_id :publicId
        }

        // generate signature using your secret key
        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_API_SECRET_KEY
        )

        res.json({
            signature,
            timestamp,
            public_id:publicId,
            api_key:process.env.CLOUDINARY_API_KEY,
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
        })

    }
    catch(err){
        console.error("Error generating upload signature : ",err)
        res.status(500).json({error:"failed to generate upload credentails"})
    }
}

const saveVideoMetadata = async(req,res)=>{
    try {
        const {
            problemId,
            cloudinaryPublicId,
            secureUrl,
            duration
        } = req.body

        const userId = req.result._id
        // verify the upload with cloudinary , ham check kar lenge video upload hui bhi h ki nhi,if present cloudinary send the video 
        const cloudinaryResource = await cloudinary.api.resource(
            cloudinaryPublicId,
            {resource_type:'video'}
        )

        if(!cloudinaryResource){
            return res.status(404).json({error:"video not found on cloudinary"})
        }

        // check if video already exist for this problem and user
        const existingVideo = await SolutionVideo.findOne({
            problemId,
            userId,
            cloudinaryPublicId
        })
        if(existingVideo){
            return res.status(404).json({error:"video already exists"})
        }  
        // you can create video thumbnailUrl on the go 
        // you can also create videoUrl using the same way
        // const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id,{
        //     resource_type:'image',
        //     transformation:[
        //         {width:400,height:225,crop:'fill'},
        //         {quality:'auto'},
        //         {start_offset:'auto'}
        //     ],
        //     format:'jpg'
        // })

        const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id,{resource_type: "video"})

        // create video solution record
        const videoSolution = await SolutionVideo.create({
            problemId,
            userId,
            cloudinaryPublicId,
            secureUrl,
            duration:cloudinaryResource.duration || duration,
            thumbnailUrl
        })
        res.status(201).json({
            message:"Video Solution Saved Successfull",
            videoSolution:{
                id:videoSolution._id,
                thumbnailUrl:videoSolution.thumbnailUrl,
                duration:videoSolution.duration,
                uploadedAt:videoSolution.createdAt
            }
        })
    } catch (error) {
        console.error("Error saving video metadata : ",err)
        res.status(500).json({error:"failed to save video metadata"})
    }
}

const deleteVideo = async(req,res)=>{
    try {
        const {videoId} = req.body
        // deleting metadata from mongodb
        const video = SolutionVideo.findByIdAndDelete(videoId)

        if(!video){
            return res.status(404).json({error:"video not found"})
        }
        // deleting video from cloudinary using public id
        // find out the meaning of invalidate:true
        await cloudinary.uploader.destroy(video.cloudinaryPublicId,{resource_type:'video',invalidate:true})
        res.status(200).json({message:"Video deleted successfully"})
    } catch (error) {
        console.error("Error deleting video : ",err)
        res.status(500).json({error:"failed to delete video"})
    }
}

module.exports = {generateUploadSignature,saveVideoMetadata,deleteVideo}