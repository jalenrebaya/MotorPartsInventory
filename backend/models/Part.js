const mongoose = require("mongoose");

const partSchema = new mongoose.Schema(
    {
        partName: {
            type: String,
            required: true,
            trim: true
        },
        brand: {
            type: String,
            required: true,
            trim: true
        },
        compatibleModel: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Part = mongoose.model("Part", partSchema);

module.exports = Part;