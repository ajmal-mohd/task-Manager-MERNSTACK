const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    try {
        console.log("Request received:", req.body);

        // Destructure input data
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists. Please use a different email." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully:", hashedPassword);

        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Respond with user data (excluding password)
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error("Error registering user:", error.message);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
}

async function loginUser(req, res) {
    try {
        // get all data from body
        const { email, password } = req.body;
        // checking this email already login
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ _id: user._id, user, name: user.name, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            console.log("build token", token);
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                sameSite: "strict",
            };
            res.cookie("token", token, options);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.password,
                role: user.role,
                token: token,
            });
        }
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
}

async function GetAllUser(req, res) {
    try {
        const getAllUser = await User.find();

        if (!getAllUser.length) {
            return res.status(403).json({ message: "not found user" });
        }

        res.status(200).json({ message: "succuss", data: getAllUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

async function deleteUser(req, res) {
    const { _id } = req.body;
    console.log(_id, "user");

    try {
        if (!_id) {
            res.status(400).json({ msg: "id not provided" });
        }
        const findUser = await User.findById(_id);
        if (findUser) {
            const deleteUser = await User.findByIdAndDelete(_id);
            console.log(deleteUser, "deleteuser");
            res.status(201).json("succussFullydeleted");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ msg: "Server error, please try again later" });
    }
}

async function userDetails(req, res) {
    const id = req.user._id;
    console.log(id);
    try {
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    GetAllUser,
    deleteUser,
    userDetails,
};
