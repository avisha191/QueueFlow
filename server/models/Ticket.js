const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        queueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Queue",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        token: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "waiting",
                "called",
                "completed",
                "cancelled",
                "skipped"
            ],
            default: "waiting"
        },

        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


// A user can have only ONE waiting ticket
// in the same queue.
//
// After the ticket becomes completed/cancelled/skipped,
// the user can join the queue again.
ticketSchema.index(
    { queueId: 1, userId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: "waiting"
        }
    }
);


module.exports = mongoose.model("Ticket", ticketSchema);