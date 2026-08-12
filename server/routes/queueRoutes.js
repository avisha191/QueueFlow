const express = require("express");

const {
    createQueue,
    getQueues,
    joinQueue,
    callNext
} = require("../controllers/queueController");

const protect = require("../middleware/authMiddleware");
const staffOnly = require("../middleware/staffMiddleware");

const router = express.Router();


// Create a queue - staff only
router.post(
    "/",
    protect,
    staffOnly,
    createQueue
);


// Get all queues - public
router.get(
    "/",
    getQueues
);


// Join a queue - logged-in users
router.post(
    "/:queueId/join",
    protect,
    joinQueue
);


// Call next customer - staff only
router.post(
    "/:queueId/next",
    protect,
    staffOnly,
    callNext
);


module.exports = router;