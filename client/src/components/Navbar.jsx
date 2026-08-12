import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <Link
                to="/dashboard"
                className="logo"
            >
                QueueFlow
            </Link>

            <div className="nav-links">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/my-ticket">
                    My Ticket
                </Link>

                <Link to="/history">
                    My Activity
                </Link>

                {/* Staff only */}
                {user?.role === "staff" && (
                    <Link to="/staff">
                        Staff
                    </Link>
                )}

                {user && (
                    <span className="nav-user">
                        {user.name}
                    </span>
                )}

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;