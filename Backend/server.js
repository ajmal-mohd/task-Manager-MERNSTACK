// server.js
const express = require("express");
const dotenv = require("dotenv");
const { mongoDBConnecting } = require("./config/db");
const routerUser = require("./routes/user");
const routerProject = require("./routes/project");
const cors = require("cors");

// Initialize environment variables
dotenv.config();

// App setup
const app = express(); 
const port = process.env.PORT || 3005; 
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
//core
const allowedOrigins = ["https://task-manager-mernstack.onrender.com"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        credentials: true, // Include credentials if necessary
    })
);

// Middleware
app.use("/api/user", routerUser);
app.use("/api/admin", routerProject);

// Connect to MongoDB
mongoDBConnecting(process.env.MONGO_URL).then(() => {
    console.log("connected mongodb");
});
// Routes (Example Route)
app.get("/", (req, res) => {
    res.send("Welcome to the server!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
