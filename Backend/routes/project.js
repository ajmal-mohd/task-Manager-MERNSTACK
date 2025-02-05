const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/AdminMiddle");
const {
    createTask,
    getUserProject,
    getUsersProjects,
    DeleteTask,
    getProjectByUserId,
    updateUserTask,
    userModifyTask,
    getUserProjectDetails,
} = require("../controller/project");

router.post("/createTask", createTask);
router.get("/user/project/:id", getUserProject);
router.get("/getUsersproject", getUsersProjects);
router.post("/deleteTask", DeleteTask);
router.get("/getProjectByUser", getProjectByUserId);
router.post("/updateUserTask", updateUserTask);
router.post("/editUserTask", userModifyTask);
router.get("/getUserProject", getUserProjectDetails);

module.exports = router;
