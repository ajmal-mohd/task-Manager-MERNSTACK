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

// CORS Configuration - Hardcoded Allowed Origins
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://frontend-taskmanager-jgrd.onrender.com", // Add your deployed frontend
];

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
        credentials: true, // Allow cookies and authentication headers
    })
);

// Middleware for routes
app.use("/api/user", routerUser);
app.use("/api/admin", routerProject);

// Connect to MongoDB
mongoDBConnecting("your_mongodb_connection_string_here").then(() => {
    console.log("Connected to MongoDB");
});

// Example Route
app.get("/", (req, res) => {
    res.send("Welcome to the server!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

