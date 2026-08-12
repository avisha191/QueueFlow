const express = require("express");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { setIO } = require("./socket");

const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/tickets", ticketRoutes);


// Database
connectDB();


// Health check
app.get("/", (req, res) => {
    res.json({
        message: "QueueFlow server is running"
    });
});


// Create HTTP server
const server = http.createServer(app);


// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


// Make Socket.IO available to controllers
setIO(io);


// Socket connection
io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id
    );

    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );

    });

});


// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});