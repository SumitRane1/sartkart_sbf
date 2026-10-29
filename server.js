const express = require("express");

const app = express();
const PORT = 3000;

// Serve files from the public folder
app.use(express.static("public"));

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartCart server running on port ${PORT}`);
});