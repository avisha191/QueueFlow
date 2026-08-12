const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        serviceTime: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["open", "paused", "closed"],
            default: "open"
        },

        currentToken: {
            type: Number,
            default: 0
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Queue", queueSchema);