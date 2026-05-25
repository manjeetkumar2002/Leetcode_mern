const mongoose = require('mongoose');
const {Schema} = mongoose;

const videoSchema = new Schema({
    //Video is fo which problem
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    // user who uploaded the video
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
   },
  //  public id 
   cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  // secureUrl of cloudinary
  secureUrl: {
    type: String,
    required: true
  },
  // video thumbnail
  thumbnailUrl: {
    type: String
  },
  //video duration length
  duration: {
    type: Number,
    required: true
  },
},{
    timestamps:true
});



const SolutionVideo = mongoose.model("solutionVideo",videoSchema);

module.exports = SolutionVideo;
