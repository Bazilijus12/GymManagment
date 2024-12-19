import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGymById, fetchEndedWorkouts } from "../../api"; // Import the API functions

const WorkoutsOverview = () => {
    const { gymId } = useParams();
    const navigate = useNavigate();
    const [gymName, setGymName] = useState("");
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGymDetailsAndWorkouts = async () => {
            try {
                const gym = await fetchGymById(gymId); // Fetch gym details
                setGymName(gym.name);

                const endedWorkouts = await fetchEndedWorkouts(gymId); // Fetch ended workouts
                setWorkouts(endedWorkouts);
            } catch (err) {
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        loadGymDetailsAndWorkouts();
    }, [gymId]);

    const handleReview = (workoutId) => {
        navigate(`/gyms/${gymId}/workouts/${workoutId}/reviews`);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Ended Workouts for {gymName}
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Duration (minutes)</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>Calories Burned</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workouts.map((workout) => (
                            <TableRow key={workout.id}>
                                <TableCell>{workout.name}</TableCell>
                                <TableCell>{workout.description}</TableCell>
                                <TableCell>{workout.duration}</TableCell>
                                <TableCell>
                                    {new Date(workout.workoutDate).toLocaleString()}
                                </TableCell>
                                <TableCell>{workout.difficulty}</TableCell>
                                <TableCell>{workout.caloriesBurned}</TableCell>
                                <TableCell>{workout.type}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleReview(workout.id)}
                                    >
                                        Review
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
                <Button onClick={() => navigate(-1)}>Back</Button>
            </Box>
        </Box>
    );
};

export default WorkoutsOverview;
