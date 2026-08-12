import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function QueueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [queue, setQueue] = useState(null);
    const [loading, setLoading] = useState(true);

    const getQueue = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/queues"
            );

            const foundQueue = response.data.find(
                (item) => item._id === id
            );

            setQueue(foundQueue);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQueue();
    }, [id]);

    const joinQueue = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `http://localhost:5000/api/queues/${id}/join`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/my-ticket");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not join queue"
            );
        }
    };

    if (loading) {
        return (
            <main className="page-center">
                <p>Loading queue...</p>
            </main>
        );
    }

    if (!queue) {
        return (
            <main className="page-center">
                <h2>Queue not found</h2>
            </main>
        );
    }

    return (
        <main className="queue-page">

            <button
                className="back-btn"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to services
            </button>

            <section className="queue-hero">

                <div className="queue-hero-content">

                    <span className="queue-status">
                        <span className="status-dot"></span>
                        {queue.status}
                    </span>

                    <h1>{queue.name}</h1>

                    <p>
                        {queue.description}
                    </p>

                </div>

                <div className="queue-action-card">

                    <p className="action-label">
                        AVERAGE SERVICE TIME
                    </p>

                    <h2>
                        {queue.serviceTime} min
                    </h2>

                    <p className="action-description">
                        Estimated time required to serve one person.
                    </p>

                    {queue.status === "open" ? (
                        <button
                            className="primary-btn join-btn"
                            onClick={joinQueue}
                        >
                            Join Queue →
                        </button>
                    ) : (
                        <button
                            className="primary-btn join-btn"
                            disabled
                        >
                            Queue Unavailable
                        </button>
                    )}

                </div>

            </section>

            <section className="how-section">

                <p className="eyebrow">
                    HOW IT WORKS
                </p>

                <h2>
                    Simple, predictable, stress-free.
                </h2>

                <div className="steps">

                    <div className="step">
                        <span>01</span>
                        <h3>Join remotely</h3>
                        <p>
                            Take a digital ticket without
                            standing in line.
                        </p>
                    </div>

                    <div className="step">
                        <span>02</span>
                        <h3>Track your position</h3>
                        <p>
                            See how many people are ahead
                            and your estimated wait time.
                        </p>
                    </div>

                    <div className="step">
                        <span>03</span>
                        <h3>Get served</h3>
                        <p>
                            Return when your turn is near
                            and complete your service.
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}

export default QueueDetails;