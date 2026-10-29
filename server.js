const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Load products from JSON
const productsPath = path.join(__dirname, "data", "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

// Serve website
app.use(express.static("public"));

// Product API
app.get("/api/product", (req, res) => {
    const barcode = req.query.barcode;

    if (!barcode) {
        return res.status(400).json({
            error: "Barcode is required"
        });
    }

    const product = products.find(
        item => item.barcode === barcode
    );

    if (!product) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    res.json(product);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartCart server running on port ${PORT}`);
});