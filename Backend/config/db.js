const mongoose = require("mongoose");

async function mongoDBConnecting(url) {
    try {
        await mongoose.connect(url); // No additional options needed
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process if the connection fails
    }
}

module.exports = {
    mongoDBConnecting,
};
