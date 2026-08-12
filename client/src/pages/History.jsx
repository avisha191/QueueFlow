import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function History() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getHistory = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/tickets/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setTickets(response.data);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getHistory();
    }, []);

    if (loading) {
        return (
            <main className="history-page">
                <p className="loading-text">
                    Loading activity...
                </p>
            </main>
        );
    }

    return (
        <main className="history-page">

            <div className="history-header">

                <div>
                    <p className="eyebrow">
                        YOUR ACTIVITY
                    </p>

                    <h1>
                        Ticket History
                    </h1>

                    <p>
                        View your previous QueueFlow visits.
                    </p>
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

            <section className="history-card">

                {tickets.length === 0 ? (

                    <div className="empty-history">

                        <div className="empty-icon">
                            ✓
                        </div>

                        <h2>
                            No activity yet
                        </h2>

                        <p>
                            Your completed and cancelled
                            tickets will appear here.
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

                ) : (

                    <div className="history-list">

                        {tickets.map((ticket) => (

                            <div
                                className="history-item"
                                key={ticket._id}
                            >

                                <div className="history-token">
                                    A-{String(
                                        ticket.token
                                    ).padStart(2, "0")}
                                </div>

                                <div className="history-info">

                                    <h3>
                                        {ticket.queueId?.name ||
                                            "Queue"}
                                    </h3>

                                    <p>
                                        {new Date(
                                            ticket.createdAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}
                                    </p>

                                </div>

                                <span
                                    className={`history-status ${
                                        ticket.status ===
                                        "completed"
                                            ? "history-completed"
                                            : "history-cancelled"
                                    }`}
                                >
                                    {ticket.status}
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default History;