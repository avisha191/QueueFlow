const Ticket = require("../models/Ticket");
const Queue = require("../models/Queue");
const { getIO } = require("../socket");

const getMyTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({
            userId: req.user.id,
            status: {
                $in: ["waiting", "called"]
            }
        }).sort({ createdAt: -1 });

        if (!ticket) {
            return res.status(404).json({
                message: "No active ticket found"
            });
        }

        const queue = await Queue.findById(ticket.queueId);

        if (!queue) {
            return res.status(404).json({
                message: "Queue not found"
            });
        }

        let peopleAhead = 0;
        let estimatedWait = 0;

        if (ticket.status === "waiting") {
            peopleAhead = await Ticket.countDocuments({
                queueId: ticket.queueId,
                status: "waiting",
                token: {
                    $lt: ticket.token
                }
            });

            estimatedWait =
                peopleAhead * queue.serviceTime;
        }

        res.json({
            ticketId: ticket._id,
            token: ticket.token,
            status: ticket.status,
            peopleAhead,
            estimatedWait,
            queue: queue.name
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const completeTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if (ticket.status !== "called") {
            return res.status(400).json({
                message: "Ticket is not currently being served"
            });
        }

        ticket.status = "completed";
        await ticket.save();

        const io = getIO();

        if (io) {
            io.emit("queueUpdated", {
                queueId: ticket.queueId,
                ticketId: ticket._id,
                token: ticket.token,
                status: "completed"
            });
        }

        res.json({
            message: "Ticket completed successfully",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const cancelTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if (ticket.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot cancel this ticket"
            });
        }

        if (ticket.status !== "waiting") {
            return res.status(400).json({
                message: "Only waiting tickets can be cancelled"
            });
        }

        ticket.status = "cancelled";
        await ticket.save();

        res.json({
            message: "Ticket cancelled successfully",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const getWaitingTickets = async (req, res) => {
    try {
        const { queueId } = req.params;

        const tickets = await Ticket.find({
            queueId,
            status: "waiting"
        }).sort({ token: 1 });

        res.json(tickets);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getTicketHistory = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            userId: req.user.id,
            status: {
                $in: ["completed", "cancelled"]
            }
        })
            .populate("queueId", "name")
            .sort({ createdAt: -1 });

        res.json(tickets);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getMyTicket,
    getTicketHistory,
    completeTicket,
    cancelTicket,
    getWaitingTickets
};