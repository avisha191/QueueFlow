import { useEffect, useState } from "react";
import axios from "axios";

function StaffDashboard() {
    const [queues, setQueues] = useState([]);
    const [selectedQueue, setSelectedQueue] = useState("");
    const [waitingTickets, setWaitingTickets] = useState([]);
    const [currentTicket, setCurrentTicket] = useState(null);

    const [loading, setLoading] = useState(true);
    const [calling, setCalling] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [message, setMessage] = useState("");

    const getQueues = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/queues`
            );

            setQueues(response.data);

            if (response.data.length > 0) {
                setSelectedQueue(response.data[0]._id);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getWaitingTickets = async (queueId) => {
        if (!queueId) return;

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/tickets/queue/${queueId}/waiting`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWaitingTickets(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getQueues();
    }, []);

    useEffect(() => {
        if (selectedQueue) {
            getWaitingTickets(selectedQueue);

            setCurrentTicket(null);
            setMessage("");
        }
    }, [selectedQueue]);

    const callNext = async () => {
        if (!selectedQueue) return;

        try {
            setCalling(true);
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/queues/${selectedQueue}/next`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const calledTicket = response.data.ticket;

            setCurrentTicket(calledTicket);

            setMessage(
                `Now serving A-${String(
                    calledTicket.token
                ).padStart(2, "0")}`
            );

            getWaitingTickets(selectedQueue);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Could not call next user"
            );
        } finally {
            setCalling(false);
        }
    };

    const completeService = async () => {
        if (!currentTicket) return;

        try {
            setCompleting(true);

            const token = localStorage.getItem("token");

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/tickets/${currentTicket._id}/complete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                `A-${String(
                    currentTicket.token
                ).padStart(2, "0")} completed successfully`
            );

            setCurrentTicket(null);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Could not complete ticket"
            );
        } finally {
            setCompleting(false);
        }
    };

    const currentQueue = queues.find(
        (queue) => queue._id === selectedQueue
    );

    if (loading) {
        return (
            <main className="staff-page">
                <p className="loading-text">
                    Loading staff dashboard...
                </p>
            </main>
        );
    }

    return (
        <main className="staff-page">

            <div className="staff-header">
                <div>
                    <p className="eyebrow">
                        STAFF CONTROL CENTER
                    </p>

                    <h1>
                        Queue Operations
                    </h1>

                    <p>
                        Manage active queues and serve customers.
                    </p>
                </div>
            </div>

            <section className="staff-control-card">

                <div className="staff-card-header">

                    <div>
                        <p className="ticket-label">
                            SELECT SERVICE
                        </p>

                        <select
                            value={selectedQueue}
                            onChange={(e) =>
                                setSelectedQueue(e.target.value)
                            }
                        >
                            {queues.map((queue) => (
                                <option
                                    key={queue._id}
                                    value={queue._id}
                                >
                                    {queue.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {currentQueue && (
                        <span className="queue-status">
                            <span className="status-dot"></span>
                            {currentQueue.status}
                        </span>
                    )}

                </div>

                {currentQueue && (
                    <div className="staff-queue-info">

                        <h2>
                            {currentQueue.name}
                        </h2>

                        <p>
                            {currentQueue.description}
                        </p>

                        <div className="staff-stats">

                            <div>
                                <span>
                                    SERVICE TIME
                                </span>

                                <strong>
                                    {currentQueue.serviceTime} min
                                </strong>
                            </div>

                            <div>
                                <span>
                                    CURRENT TOKEN
                                </span>

                                <strong>
                                    A-{String(
                                        currentQueue.currentToken
                                    ).padStart(2, "0")}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    WAITING
                                </span>

                                <strong>
                                    {waitingTickets.length}
                                </strong>
                            </div>

                        </div>

                    </div>
                )}

                {!currentTicket ? (
                    <button
                        className="call-next-btn"
                        onClick={callNext}
                        disabled={
                            calling ||
                            waitingTickets.length === 0
                        }
                    >
                        {calling
                            ? "Calling..."
                            : "Call Next Customer →"}
                    </button>
                ) : (
                    <div className="serving-card">

                        <p className="ticket-label">
                            CURRENTLY SERVING
                        </p>

                        <div className="serving-token">
                            A-{String(
                                currentTicket.token
                            ).padStart(2, "0")}
                        </div>

                        <span className="serving-status">
                            ● Customer is being served
                        </span>

                        <button
                            className="complete-btn"
                            onClick={completeService}
                            disabled={completing}
                        >
                            {completing
                                ? "Completing..."
                                : "Complete Service ✓"}
                        </button>

                    </div>
                )}

                {message && (
                    <div className="staff-message">
                        {message}
                    </div>
                )}

            </section>

            <section className="waiting-section">

                <div className="waiting-header">

                    <div>
                        <p className="eyebrow">
                            LIVE QUEUE
                        </p>

                        <h2>
                            Waiting Customers
                        </h2>
                    </div>

                    <span className="waiting-count">
                        {waitingTickets.length} waiting
                    </span>

                </div>

                {waitingTickets.length === 0 ? (

                    <div className="empty-waiting">

                        <div className="empty-icon">
                            ✓
                        </div>

                        <h3>
                            No users waiting
                        </h3>

                        <p>
                            The queue is currently empty.
                        </p>

                    </div>

                ) : (

                    <div className="waiting-list">

                        {waitingTickets.map((ticket, index) => (

                            <div
                                className="waiting-ticket"
                                key={ticket._id}
                            >

                                <div className="ticket-position">
                                    #{index + 1}
                                </div>

                                <div className="waiting-token">
                                    A-{String(
                                        ticket.token
                                    ).padStart(2, "0")}
                                </div>

                                <span className="waiting-status-badge">
                                    Waiting
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default StaffDashboard;