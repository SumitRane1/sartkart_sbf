const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


// =====================================================
// LOAD PRODUCTS
// =====================================================

const productsPath = path.join(
    __dirname,
    "data",
    "products.json"
);

let products = [];

try {
    products = JSON.parse(
        fs.readFileSync(
            productsPath,
            "utf8"
        )
    );

    console.log(
        `Loaded ${products.length} products`
    );

} catch (error) {

    console.error(
        "Failed to load products.json:",
        error
    );

    process.exit(1);
}


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    express.json()
);


// =====================================================
// PRODUCT API
// =====================================================

app.get(
    "/api/product",
    (req, res) => {

        const barcode =
            String(
                req.query.barcode || ""
            ).trim();


        if (!barcode) {

            return res.status(400).json({
                error: "Barcode is required"
            });

        }


        console.log(
            "Barcode requested:",
            barcode
        );


        const product =
            products.find(
                item =>
                    String(item.barcode) ===
                    barcode
            );


        if (!product) {

            return res.status(404).json({

                error:
                    "Product not found",

                barcode:
                    barcode

            });

        }


        res.json(product);

    }
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            status:
                "OK",

            products:
                products.length

        });

    }
);


// =====================================================
// WEIGHT SYSTEM
// =====================================================

let currentWeight = 0;


// -----------------------------------------------------
// RECEIVE WEIGHT FROM NODEMCU
// -----------------------------------------------------

app.post(
    "/api/weight",
    (req, res) => {

        const weight =
            Number(
                req.body.weight
            );


        if (
            !Number.isFinite(weight) ||
            weight < 0
        ) {

            return res.status(400).json({

                error:
                    "Invalid weight"

            });

        }


        currentWeight =
            weight;


        console.log(
            `Weight received: ${currentWeight} g`
        );


        res.json({

            success:
                true,

            weight:
                currentWeight

        });

    }
);


// -----------------------------------------------------
// GET CURRENT WEIGHT
// -----------------------------------------------------

app.get(
    "/api/weight",
    (req, res) => {

        res.json({

            weight:
                currentWeight

        });

    }
);


// =====================================================
// START SERVER
// =====================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `SmartCart server running on port ${PORT}`
        );

    }
);