const express = require("express");
const router = express.Router();
const cookieparser = require("cookie-parser");
const { registerUser, loginUser, GetAllUser, deleteUser, userDetails } = require("../controller/user");

const { verifyToken } = require("../middleware/AdminMiddle");

// const { adminMiddleware } = require("../middleware/AdminMiddle");

//middleware
router.use(cookieparser());

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/userDetails",verifyToken, userDetails);
router.get("/users", GetAllUser);
router.post("/deleteUser", deleteUser);

module.exports = router;
