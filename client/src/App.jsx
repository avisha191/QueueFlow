import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import QueueDetails from "./pages/QueueDetails";
import MyTicket from "./pages/MyTicket";
import History from "./pages/History";
import StaffDashboard from "./pages/StaffDashboard";


// Protect normal logged-in user pages
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


// Protect staff page
function StaffRoute() {
    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not staff
    if (user.role !== "staff") {
        return <Navigate to="/dashboard" replace />;
    }

    return <StaffDashboard />;
}


function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Public pages */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                {/* Protected user pages */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/queue/:id"
                    element={
                        <ProtectedRoute>
                            <QueueDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-ticket"
                    element={
                        <ProtectedRoute>
                            <MyTicket />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    }
                />


                {/* Staff only */}

                <Route
                    path="/staff"
                    element={<StaffRoute />}
                />


                {/* Unknown URL */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;