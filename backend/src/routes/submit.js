const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const {submitCode,runCode} = require("../controllers/userSubmission")

const submitRouter = express.Router()


submitRouter.post("/submit/:id",userMiddleware,submitCode)
submitRouter.post("/run/:id",userMiddleware,runCode)

module.exports = submitRouter