const Problem = require("../models/Problem");
const Submission = require("../models/submission")
const User = require("../models/user")
const {getLanguageById,submitBatch,submitToken} = require("../utils/ProblemUtility")
const submitCode = async(req,res)=>{
    // run the code using judge0 and submit it on db with userId and problemId
    try {
        //  user send this info
        const userId = req.result._id // user id
        const problemId = req.params.id // problemID
        let {code,language} = req.body
        if(!code || !language || !userId || !problemId)
            return res.status(404).send("Some Field Missing")
        
        // fetch the problem from the database so that we get hiddenTestCases because we have to run the code so that we 
        // get the runtime,memory and total testCase run 

        const problem = await Problem.findById(problemId)
        // run the user code on hidden testCases 
        // we store the user code first and mark it pending and later we update the information
        if(language==="cpp"){
            language = "c++"
        }
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })
        
        // judge0 ko code submit karna h
         // format of data we have to send to judge0 => {source_code,language_id,stdin,expected_output}
        const languageId = getLanguageById(language)
        //create the submission array of each language (batch creation)
        const submissions = problem.hiddenTestCases.map((testcase)=>{
            return{ 
                source_code:code,
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
        // update the submitResult that we have stored in db
        let testCasesPassed = 0
        let runtime = 0;
        let memory = 0;
        let status = 'accepted'
        let errorMessage = null
        for(const test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime+=parseFloat(test.time)
                memory = Math.max(memory,test.memory)
            }
            else{
                if(test.status_id==4){
                    status = 'error'
                    errorMessage = test.stderr
                }
                else{
                    status = 'wrong'
                    errorMessage = test.stderr
                }
            }
        }

        // store the result into db in Submission
        submittedResult.status = status
        submittedResult.testCasesPassed = testCasesPassed
        submittedResult.errorMessage = errorMessage
        submittedResult.runtime = runtime
        submittedResult.memory = memory

        await submittedResult.save()
       
        // ProblemId ko insert karenge userSchema ke problemSolved me if it is not present there
        if(!req.result.problemSolved.includes(problemId)){
            //result have all the data of the user 
            req.result.problemSolved.push(problemId)
            await req.result.save()
        }
        const accepted = (status == 'accepted')
        res.status(201).json({
        accepted,
        totalTestCases: submittedResult.testCasesTotal,
        passedTestCases: testCasesPassed,
        runtime,
        memory
        });


    } catch (err) {
        console.log("Error :",err)
         res.status(500).send("Internal Server Error :"+err)
    }

}
// same code as submit code but we dont have to saved it in db
const runCode = async(req,res)=>{
    try {
        const userId = req.result._id // user id
        const problemId = req.params.id // problemID
        let {code,language} = req.body
        if(!code || !language || !userId || !problemId)
            return res.status(404).send("Some Field Missing")
        
        
        const problem = await Problem.findById(problemId)
        if(language==='cpp')
            language='c++'
        
        const languageId = getLanguageById(language)
        //create the submission array of each language (batch creation)
        const submissions = problem.visibleTestCases.map((testcase)=>{
            return{ 
                source_code:code,
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
        
            
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;
        let errorMessage = null;

        for(const test of testResult){
            if(test.status_id==3){
            testCasesPassed++;
            runtime = runtime+parseFloat(test.time)
            memory = Math.max(memory,test.memory);
            }else{
            if(test.status_id==4){
                status = false
                errorMessage = test.stderr
            }
            else{
                status = false
                errorMessage = test.stderr
            }
            }
        }

        
    
        res.status(201).json({
            success:status,
            testCases: testResult,
            runtime,
            memory
        });


    } catch (err) {
         res.status(500).send("Internal Server Error :"+err)
    }
}


module.exports = {submitCode,runCode}