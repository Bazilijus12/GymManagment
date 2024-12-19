import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import GymsList from "./components/Gyms/GymList";
import GymDetails from "./components/Gyms/GymDetails";
import NotFound from "./components/NotFound";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import GymManagment from "./components/Admin/Admin";
import Workouts from "./components/Workouts/Workouts";
import EndedWorkouts from "./components/Workouts/EndedWorkouts";
import Reviews from "./components/Reviews/Reviews";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />                     {/* Home Page */}
                    <Route path="/gyms" element={<GymsList />} />            {/* List of Gyms */}
                    <Route path="/gyms/:gymId" element={<GymDetails />} />   {/* Gym Details */}
                    <Route path="*" element={<NotFound />} />                {/* Catch-all for 404 */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />               
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/gyms/:gymId/workouts/ended" element={<EndedWorkouts />} />
                    <Route path="/gyms/:gymId/workouts/:workoutId/reviews" element={<Reviews />} />
                    <Route path="/gyms/:gymId/workouts" element={<Workouts />}/>
                    
                    <Route path="/gymManagment" element={  
                        <ProtectedRoute requiredRoles={["Admin"]}>
                            {<GymManagment />}
                        </ProtectedRoute>} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
