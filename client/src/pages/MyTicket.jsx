import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_API_URL);

function MyTicket() {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const getMyTicket = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/tickets/my-ticket`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTicket(response.data);

        } catch (error) {
            if (error.response?.status === 404) {
                setTicket(null);
            } else {
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyTicket();

        const handleQueueUpdate = () => {
            getMyTicket();
        };

        socket.on("queueUpdated", handleQueueUpdate);

        return () => {
            socket.off("queueUpdated", handleQueueUpdate);
        };
    }, []);

    const cancelTicket = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/tickets/${ticket.ticketId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTicket(null);

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not leave queue"
            );
        }
    };

    if (loading) {
        return (
            <main className="ticket-page">
                <p className="loading-text">
                    Loading your ticket...
                </p>
            </main>
        );
    }

    if (!ticket) {
        return (
            <main className="ticket-page">

                <div className="empty-ticket">

                    <div className="empty-icon">
                        +
                    </div>

                    <h2>
                        No active ticket
                    </h2>

                    <p>
                        You are not currently waiting
                        in any queue.
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Browse Services
                    </button>

                </div>

            </main>
        );
    }

    const tokenNumber =
        `A-${String(ticket.token).padStart(2, "0")}`;

    const isWaiting = ticket.status === "waiting";
    const isCalled = ticket.status === "called";

    return (
        <main className="ticket-page">

            <div className="ticket-header">

                <div>
                    <p className="eyebrow">
                        YOUR QUEUE TICKET
                    </p>

                    <h1>
                        Track your position
                    </h1>
                </div>

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </div>

            <section className="ticket-card">

                <div className="ticket-top">

                    <div>
                        <p className="ticket-label">
                            SERVICE
                        </p>

                        <h2>
                            {ticket.queue}
                        </h2>
                    </div>

                    <span
                        className={`ticket-status ${
                            isWaiting
                                ? "waiting-status"
                                : "called-status"
                        }`}
                    >
                        <span className="status-dot"></span>
                        {ticket.status}
                    </span>

                </div>

                <div className="ticket-main">

                    <p className="ticket-label">
                        YOUR TOKEN
                    </p>

                    <div className="big-token">
                        {tokenNumber}
                    </div>

                    {isCalled && (
                        <div className="called-message">
                            It's your turn. Please proceed
                            to the service counter.
                        </div>
                    )}

                </div>

                <div className="ticket-stats">

                    <div className="ticket-stat">
                        <span>
                            PEOPLE AHEAD
                        </span>

                        <strong>
                            {ticket.peopleAhead}
                        </strong>
                    </div>

                    <div className="ticket-stat">
                        <span>
                            ESTIMATED WAIT
                        </span>

                        <strong>
                            {ticket.estimatedWait} min
                        </strong>
                    </div>

                    <div className="ticket-stat">
                        <span>
                            STATUS
                        </span>

                        <strong>
                            {ticket.status}
                        </strong>
                    </div>

                </div>

                {isWaiting && (
                    <div className="ticket-actions">

                        <div className="wait-info">
                            <span className="live-dot"></span>

                            Queue position is being tracked
                        </div>

                        <button
                            className="cancel-btn"
                            onClick={cancelTicket}
                        >
                            Leave Queue
                        </button>

                    </div>
                )}

            </section>

            <p className="ticket-note">
                Live updates are enabled. You don't need
                to refresh.
            </p>

        </main>
    );
}

export default MyTicket;