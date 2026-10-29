const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Load products from JSON
const productsPath = path.join(__dirname, "data", "products.json");

let products = [];

try {
    products = JSON.parse(
        fs.readFileSync(productsPath, "utf8")
    );

    console.log(`Loaded ${products.length} products`);
} catch (error) {
    console.error("Failed to load products.json:", error);
    process.exit(1);
}

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Product API
app.get("/api/product", (req, res) => {

    const barcode = String(req.query.barcode || "").trim();

    if (!barcode) {
        return res.status(400).json({
            error: "Barcode is required"
        });
    }

    console.log("Barcode requested:", barcode);

    const product = products.find(
        item => String(item.barcode) === barcode
    );

    if (!product) {
        return res.status(404).json({
            error: "Product not found",
            barcode: barcode
        });
    }

    res.json(product);
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        products: products.length
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartCart server running on port ${PORT}`);
});