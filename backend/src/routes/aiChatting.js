const express = require("express")
const userMiddleware = require("../middleware/userMiddleware");
const {solveDoubt} = require("../controllers/solveDoubt")
const aiRouter = express.Router()

aiRouter.post("/chat",userMiddleware,solveDoubt)


module.exports = aiRouter