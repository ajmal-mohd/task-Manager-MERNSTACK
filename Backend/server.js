// server.js
const express = require("express");
const dotenv = require("dotenv");
const { mongoDBConnecting } = require("./config/db");
const routerUser = require("./routes/user");
const routerProject = require("./routes/project");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration (Render-Friendly)
const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://task-manager-mernstack.onrender.com";

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigin === "*" || (origin && origin.startsWith(allowedOrigin))) {
                callback(null, true);
            } else {
                console.error("CORS Error: Origin not allowed:", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Only if needed
    })
);


app.use("/api/user", routerUser);
app.use("/api/admin", routerProject);

mongoDBConnecting(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
