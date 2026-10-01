const express = require("express");
const Part = require("../models/Part");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
    try {
        const { partName, brand, compatibleModel, price, stock } = req.body;

        if (
            !partName ||
            !brand ||
            !compatibleModel ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const newPart = new Part({
            partName,
            brand,
            compatibleModel,
            price,
            stock
        });

        const savedPart = await newPart.save();

        res.status(201).json(savedPart);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create part.",
            error: error.message
        });
    }
});

// READ ALL
router.get("/", async (req, res) => {
    try {
        const parts = await Part.find().sort({ createdAt: -1 });

        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get parts.",
            error: error.message
        });
    }
});

// READ ONE
router.get("/:id", async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);

        if (!part) {
            return res.status(404).json({
                message: "Part not found."
            });
        }

        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get part.",
            error: error.message
        });
    }
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updatedPart = await Part.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPart) {
            return res.status(404).json({
                message: "Part not found."
            });
        }

        res.status(200).json(updatedPart);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update part.",
            error: error.message
        });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const deletedPart = await Part.findByIdAndDelete(req.params.id);

        if (!deletedPart) {
            return res.status(404).json({
                message: "Part not found."
            });
        }

        res.status(200).json({
            message: "Part deleted successfully.",
            deletedPart
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete part.",
            error: error.message
        });
    }
});

module.exports = router;