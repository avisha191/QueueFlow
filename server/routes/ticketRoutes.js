const express = require("express");

const {
    getMyTicket,
    getTicketHistory,
    completeTicket,
    cancelTicket,
    getWaitingTickets
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");
const staffOnly = require("../middleware/staffMiddleware");

const router = express.Router();


// Get user's current active ticket
router.get(
    "/my-ticket",
    protect,
    getMyTicket
);


// Get user's completed/cancelled ticket history
router.get(
    "/history",
    protect,
    getTicketHistory
);


// Complete a ticket - staff only
router.patch(
    "/:ticketId/complete",
    protect,
    staffOnly,
    completeTicket
);


// Cancel a ticket - user can cancel their own waiting ticket
router.patch(
    "/:ticketId/cancel",
    protect,
    cancelTicket
);


// Get all waiting tickets for a queue - staff only
router.get(
    "/queue/:queueId/waiting",
    protect,
    staffOnly,
    getWaitingTickets
);


module.exports = router;