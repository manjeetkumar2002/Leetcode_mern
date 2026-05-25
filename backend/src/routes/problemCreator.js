// Possible routes
// create
// fetch
// update
// delete

const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblemByUser,
  submittedProblem,
  fetchCompleteProblem
} = require("../controllers/userProblem");
const problemRouter = express.Router();

// admin works
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);
problemRouter.get("/admin/:id",adminMiddleware,fetchCompleteProblem)
// normal user routes
problemRouter.get("/ProblemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblemByUser);
// fetching user submissions for a particular problem
// we have to create the indexing on {userId,problemId} because their can be 20 crore submission in the db of users
// indexing make fetching data faster
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)

module.exports = problemRouter;
