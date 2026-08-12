import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTicket, setActiveTicket] = useState(null);
    const [history, setHistory] = useState([]);

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const getData = async () => {
        try {
            const token = localStorage.getItem("token");

            const queueResponse = await axios.get(
                 `${import.meta.env.VITE_API_URL}/api/queues`
            );

            setQueues(queueResponse.data);

            try {
                const ticketResponse = await axios.get(
                   `${import.meta.env.VITE_API_URL}/api/tickets/my-ticket`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setActiveTicket(ticketResponse.data);

            } catch (error) {
                if (error.response?.status === 404) {
                    setActiveTicket(null);
                }
            }

            const historyResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/tickets/history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setHistory(historyResponse.data);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const completedCount = history.filter(
        (ticket) => ticket.status === "completed"
    ).length;

    const totalVisits = history.length;

    return (
        <main className="dashboard">

            <section className="hero">

                <div>

                    <p className="eyebrow">
                        SMART QUEUE MANAGEMENT
                    </p>

                    <h1>
                        Skip the wait.
                        <br />
                        <span>Manage your time.</span>
                    </h1>

                    <p className="hero-text">
                        Welcome back{user?.name ? `, ${user.name}` : ""}.
                        Join a queue remotely, track your position,
                        and know exactly when it's your turn.
                    </p>

                </div>

            </section>


            {/* USER STATS */}

            <section className="dashboard-stats">

                <div className="dashboard-stat">

                    <span>
                        ACTIVE TICKET
                    </span>

                    <strong>
                        {activeTicket
                            ? `A-${String(
                                activeTicket.token
                            ).padStart(2, "0")}`
                            : "None"}
                    </strong>

                    <p>
                        {activeTicket
                            ? activeTicket.status
                            : "No active queue"}
                    </p>

                </div>


                <div className="dashboard-stat">

                    <span>
                        TOTAL VISITS
                    </span>

                    <strong>
                        {totalVisits}
                    </strong>

                    <p>
                        Previous tickets
                    </p>

                </div>


                <div className="dashboard-stat">

                    <span>
                        COMPLETED
                    </span>

                    <strong>
                        {completedCount}
                    </strong>

                    <p>
                        Services completed
                    </p>

                </div>

            </section>


            {/* SERVICES */}

            <section className="services">

                <div className="section-heading">

                    <div>

                        <p className="eyebrow">
                            AVAILABLE SERVICES
                        </p>

                        <h2>
                            Choose a service
                        </h2>

                    </div>

                    <span className="service-count">
                        {queues.length} services
                    </span>

                </div>


                {loading ? (

                    <div className="loading">
                        Loading services...
                    </div>

                ) : (

                    <div className="queue-grid">

                        {queues.map((queue) => (

                            <div
                                className="queue-card"
                                key={queue._id}
                            >

                                <div className="card-top">

                                    <span className="status">

                                        <span className="status-dot"></span>

                                        {queue.status}

                                    </span>

                                    <span className="queue-icon">
                                        Q
                                    </span>

                                </div>


                                <h3>
                                    {queue.name}
                                </h3>


                                <p className="queue-description">
                                    {queue.description}
                                </p>


                                <div className="queue-info">

                                    <div>

                                        <span>
                                            Avg. service
                                        </span>

                                        <strong>
                                            {queue.serviceTime} min
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Queue
                                        </span>

                                        <strong>
                                            Active
                                        </strong>

                                    </div>

                                </div>


                                <button
                                    className="primary-btn"
                                    onClick={() =>
                                        navigate(
                                            `/queue/${queue._id}`
                                        )
                                    }
                                >
                                    View Queue →
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default Dashboard;