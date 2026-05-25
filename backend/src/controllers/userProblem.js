const Problem = require("../models/Problem");
const User = require("../models/user");
const Submission = require("../models/submission")
const {getLanguageById,submitBatch,submitToken} = require("../utils/ProblemUtility");
const SolutionVideo = require("../models/solutionVideo");

const createProblem = async (req, res) => {
  // admin send the details of problem and we have to store it in db
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    problemCreator,
    referenceSolution,
  } = req.body;
  // we have to check reference solution is valid or not before storing it into db for all language
  // we have visibleTestCases and hiddenTestCases (input/output) // check karo isko judge0 ki help se 

  try {
    // iterate the reference solution array (it have complete code for all languages)
    for(const {language,completeCode} of referenceSolution){
        // we provide lang ,completecode ,input,output to judge0

        // format of data we have to send to judge0 => {source_code,language_id,stdin,expected_output}
        const languageId = getLanguageById(language)
        //create the submission array of each language (batch creation)
        const submissions = visibleTestCases.map((testcase)=>{
            return{ 
                source_code:completeCode,
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output
        }})
        // submit the batch
        const submitResult = await submitBatch(submissions) // it return array of tokens  (//step : create a submission Batch)
        
        // (get a submission batch (we get the actual result with the help of this tokens))
        const resultToken = submitResult.map((value)=>value.token) // making a array of tokens values ['token1value','token2value']
        // submit the tokens
        const testResult = await submitToken(resultToken)
        //  now we get the submission result now check the status id
        for(const test of testResult){
          // status_id 3 means accepted
          if(test.status_id!=3){
            return res.status(400).send("Error Occured")
          }
        }
   }

  //we can store the problem to db now when for loop completed 
  const userProblem = await Problem.create({
    ...req.body,
    problemCreator:req.result._id
   })
    res.status(201).send("Problem Saved Successfully")
  } catch (err) {
    console.log(err)
    res.status(400).send("Error : "+err)
  }
}

const updateProblem = async (req,res)=>{
  // same as createProblem we have to check the code it is correct or not using judge0
  const {id} = req.params // id of the problem we have to update
  const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      problemCreator,
      referenceSolution,
    } = req.body;
  try {
    if(!id){
      return res.status(400).send("Missing Id Field")
    }

    const DsaProblem = await Problem.findById(id)
    if(!DsaProblem){
      return res.status(404).send("Id is not present in server")
    }
     // iterate the reference solution array (it have complete code for all languages)
    for(const {language,completeCode} of referenceSolution){
        // we provide lang ,completecode ,input,output to judge0

        // format of data we have to send to judge0 => {source_code,language_id,stdin,expected_output}
        const languageId = getLanguageById(language)
        //create the submission array of each language (batch creation)
        const submissions = visibleTestCases.map((testcase)=>{
            return{ 
                source_code:completeCode,
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output
        }})
        // submit the batch
        const submitResult = await submitBatch(submissions) // it return array of tokens  (//step : create a submission Batch)
        // (get a submission batch (we get the actual result with the help of this tokens))
        const resultToken = submitResult.map((value)=>value.token) // making a array of tokens values ['token1value','token2value']
        // submit the tokens
        const testResult = await submitToken(resultToken)
        //  now we get the submission result now check the status id
        for(const test of testResult){
          // status_id 3 means accepted
          if(test.status_id!=3){
            return res.status(400).send("Error Occured")
          }
        }
    }

    const newProblem = await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true, returnDocument: 'after'}) // new:true help to return the newProblem

    res.status(200).send(newProblem);
  } catch (err) {
    console.log(err)
    res.status(500).send("Error : "+err)
  }
}
const deleteProblem = async(req,res)=>{
    const {id} = req.params

    try {
      if(!id){
       return res.status(400).send("Id is Missing")
      }

      const deleteProblem = await Problem.findByIdAndDelete(id)
      
      if(!deleteProblem){
        return res.status(404).send("Problem is Missing")
      }
      res.status(200).send("Problem Deleted Successfully")
    } catch (err) {
      res.status(400).send("Error : "+err)
    }
}
const getProblemById = async(req,res)=>{
  // don't send the hiddenTestCases,referenceSolution,problemCreator,__v  of the problem to the user
    const {id} = req.params

    try {
      if(!id){
       return res.status(400).send("Id is Missing")
      }

      const getproblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution')
      // fetch the video solution of this problem and send to frontend
      // we can fetch the video the problem id 
      if(!getproblem){
        return res.status(404).send("Problem is Missing")
      }
      const videos = await SolutionVideo.findOne({problemId:id})
      // if videos exist ,you and also add the feature of paid user here => video&&userPaid
      if(videos){
        const responseData = {
          ...getproblem.toObject(),
          secureUrl:videos.secureUrl,
          thumbnailUrl : videos.thumbnailUrl,
          duration : videos.duration,
        } 
        return res.status(200).send(responseData)
      }
      res.status(200).send(getproblem)
    } catch (err) {
      res.status(400).send("Error : "+err)
    }
}
const getAllProblem = async(req,res)=>{
    try {
      // pagination
      // const page = 2
      // const limit = 10
      // const skip = (page-1) * limit

      // const getAllProblem = Problem.find({}).skip(skip).limit(limit)
      // const getAllProblem = Problem.find({difficulty:'easy'}) //fileration
      const getAllProblem = await Problem.find({}).select("_id title difficulty tags")

      if(getAllProblem.length==0){
        return res.status(404).send("Problem is Missing")
      }

      res.status(200).send(getAllProblem)
    } catch (err) {
      res.status(400).send("Error : "+err)
    }
}
const solvedAllProblemByUser = async(req,res)=>{
    try{
      // sending the number of problems Solved
      // const count = req.result.problemSolved.length
      // res.status(200).send(count)


      const userId = req.result._id
      // sending all the fields of the ProblemSolved
      // jisko problemSolved refer kar raha uska ka data fetch ho jayega populate ke help se (this is same as join operation)
      // const user = await User.findById(userId).populate("problemSolved")
     
      // sending only selected fields to the user 
      const user = await User.findById(userId).populate({
        path:"problemSolved",
        // select only some field
        select:"_id title difficulty tags"
      })

      res.status(200).send(user.problemSolved)

    }
    catch(err){
      res.status(500).send("Error : "+err)
    }
}

const submittedProblem = async(req,res)=>{
    try {
      const userId = req.result._id
      const problemId = req.params.pid
      const ans = await Submission.find({userId,problemId})
      res.status(200).send(ans)
    } catch (err) {
       res.status(500).send("Error : "+err)
    }
}
const fetchCompleteProblem = async(req,res)=>{
  // don't send the hiddenTestCases,referenceSolution,problemCreator,__v  of the problem to the user
    const {id} = req.params
    try {
      if(!id){
       return res.status(400).send("Id is Missing")
      }

      const getproblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution')
      // fetch the video solution of this problem and send to frontend
      // we can fetch the video the problem id 
      if(!getproblem){
        return res.status(404).send("Problem is Missing")
      }
      const videos = await SolutionVideo.findOne({problemId:id})
      // if videos exist ,you and also add the feature of paid user here => video&&userPaid
      if(videos){
        const responseData = {
          ...getproblem.toObject(),
          secureUrl:videos.secureUrl,
          thumbnailUrl : videos.thumbnailUrl,
          duration : videos.duration,
        } 
        return res.status(200).send(responseData)
      }
      res.status(200).send(getproblem)
    } catch (err) {
      res.status(400).send("Error : "+err)
    }
}
module.exports =  {solvedAllProblemByUser,getAllProblem,createProblem,updateProblem,deleteProblem,getProblemById,submittedProblem,fetchCompleteProblem}