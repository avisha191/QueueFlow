const Queue = require("../models/Queue");
const Ticket = require("../models/Ticket");
const { getIO } = require("../socket");


// Create a new queue
const createQueue = async (req, res) => {
    try {
        const { name, description, serviceTime } = req.body;

        const queue = await Queue.create({
            name,
            description,
            serviceTime,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Queue created successfully",
            queue
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get all queues
const getQueues = async (req, res) => {
    try {
        const queues = await Queue.find();

        res.json(queues);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Join a queue
const joinQueue = async (req, res) => {

    const session = await Queue.startSession();

    try {
        let createdTicket;

        await session.withTransaction(async () => {

            const { queueId } = req.params;


            // 1. Check that queue exists and is open
            const queue = await Queue.findOne({
                _id: queueId,
                status: "open"
            }).session(session);

            if (!queue) {
                const error = new Error(
                    "Queue not found or queue is not open"
                );

                error.statusCode = 404;

                throw error;
            }


            // 2. Check if this user already has
            // a waiting ticket in this queue
            const existingTicket = await Ticket.findOne({
                queueId,
                userId: req.user.id,
                status: "waiting"
            }).session(session);

            if (existingTicket) {
                const error = new Error(
                    "You are already in this queue"
                );

                error.statusCode = 400;

                throw error;
            }


            // 3. Atomically generate the next token
            const updatedQueue =
                await Queue.findOneAndUpdate(
                    {
                        _id: queueId,
                        status: "open"
                    },
                    {
                        $inc: {
                            currentToken: 1
                        }
                    },
                    {
                        new: true,
                        session
                    }
                );


            // Safety check
            if (!updatedQueue) {
                const error = new Error(
                    "Queue is no longer available"
                );

                error.statusCode = 404;

                throw error;
            }


            // 4. Get the atomically generated token
            const nextToken =
                updatedQueue.currentToken;


            // 5. Create the ticket
            const tickets = await Ticket.create(
                [
                    {
                        queueId,
                        userId: req.user.id,
                        token: nextToken,
                        status: "waiting"
                    }
                ],
                {
                    session
                }
            );


            createdTicket = tickets[0];
        });


        // 6. Send successful response
        res.status(201).json({
            message: "Joined queue successfully",
            ticket: createdTicket
        });


    } catch (error) {

        // Duplicate waiting ticket
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You are already in this queue"
            });
        }


        const statusCode =
            error.statusCode || 500;


        res.status(statusCode).json({
            message:
                statusCode === 500
                    ? "Server error"
                    : error.message,

            ...(statusCode === 500 && {
                error: error.message
            })
        });


    } finally {

        await session.endSession();
    }
};


// Call next waiting customer
const callNext = async (req, res) => {
    try {
        const { queueId } = req.params;


        // Find the oldest waiting ticket
        const ticket = await Ticket.findOne({
            queueId,
            status: "waiting"
        }).sort({
            token: 1
        });


        if (!ticket) {
            return res.status(404).json({
                message: "No users waiting"
            });
        }


        // Mark ticket as called
        ticket.status = "called";

        await ticket.save();


        // Send real-time update
        const io = getIO();

        if (io) {
            io.emit("queueUpdated", {
                queueId,
                ticketId: ticket._id,
                token: ticket.token,
                status: "called"
            });
        }


        res.json({
            message: "Next user called",
            ticket
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createQueue,
    getQueues,
    joinQueue,
    callNext
};