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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {
    fetchGymById,
    fetchWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
} from "../../api"; // Adjust path as needed

const Workouts = () => {
    const { gymId } = useParams();
    const navigate = useNavigate();
    const [gymName, setGymName] = useState("");
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        duration: "",
        workoutDate: "",
        difficulty: "",
        caloriesBurned: "",
        type: "",
        maxParticipants: "",
    });

    const accessToken = localStorage.getItem("accessToken");
    const userRoles = accessToken
        ? jwtDecode(accessToken)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        : [];

    const isAdmin = Array.isArray(userRoles) ? userRoles.includes("Admin") : userRoles === "Admin";
    const isGymUser = Array.isArray(userRoles) ? userRoles.includes("GymUser") : userRoles === "GymUser";


    useEffect(() => {
        const loadGymDetailsAndWorkouts = async () => {
            try {
                const gym = await fetchGymById(gymId);
                setGymName(gym.name);

                const workoutsList = await fetchWorkouts(gymId);
                setWorkouts(workoutsList);
            } catch (err) {
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        loadGymDetailsAndWorkouts();
    }, [gymId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddWorkout = async () => {
        const workoutData = {
            ...formData,
            duration: parseInt(formData.duration, 10) || 0,
            caloriesBurned: parseInt(formData.caloriesBurned, 10) || 0,
            maxParticipants: parseInt(formData.maxParticipants, 10) || 0,
            workoutDate: formData.workoutDate
                ? new Date(formData.workoutDate).toISOString()
                : null,
        };

        try {
            if (isEditMode) {
                const updatedWorkout = await updateWorkout(gymId, formData.id, workoutData);
                setWorkouts((prev) =>
                    prev.map((workout) =>
                        workout.id === updatedWorkout.id ? updatedWorkout : workout
                    )
                );
            } else {
                const newWorkout = await createWorkout(gymId, workoutData);
                setWorkouts((prev) => [...prev, newWorkout]);
            }

            setOpenForm(false);
            setFormData({
                id: "",
                name: "",
                description: "",
                duration: "",
                workoutDate: "",
                difficulty: "",
                caloriesBurned: "",
                type: "",
                maxParticipants: "",
            });
            setIsEditMode(false);
        } catch (err) {
            console.error("Error saving workout:", err.message);
        }
    };

    const handleEditWorkout = (workout) => {
        setFormData({ ...workout });
        setIsEditMode(true);
        setOpenForm(true);
    };
    const handleGoBack = () => {
        navigate(-1); // Navigates one page back
    };

    const handleDeleteWorkout = async (workoutId) => {
        try {
            await deleteWorkout(gymId, workoutId);
            setWorkouts((prev) => prev.filter((workout) => workout.id !== workoutId));
        } catch (err) {
            console.error("Error deleting workout:", err.message);
        }
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
                Workouts for {gymName}
            </Typography>

            {isAdmin && (
                <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setIsEditMode(false);
                            setFormData({
                                id: "",
                                name: "",
                                description: "",
                                duration: "",
                                workoutDate: "",
                                difficulty: "",
                                caloriesBurned: "",
                                type: "",
                                maxParticipants: "",
                            });
                            setOpenForm(true);
                        }}
                    >
                        Add Workout
                    </Button>
                </Box>
            )}

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
                            <TableCell>Max Participants</TableCell>
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
                                <TableCell>{workout.maxParticipants}</TableCell>
                                <TableCell>
    {isAdmin && (
        <>
            <Button
                variant="outlined"
                color="primary"
                sx={{ marginRight: 1 }}
                onClick={() => handleEditWorkout(workout)}
            >
                Edit
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteWorkout(workout.id)}
            >
                Delete
            </Button>
        </>
    )}
    {isGymUser && (
        <Button
            variant="outlined"
            color="success">
            Register
        </Button>
    )}
</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openForm} onClose={() => setOpenForm(false)}>
                <DialogTitle>{isEditMode ? "Edit Workout" : "Add Workout"}</DialogTitle>
                <DialogContent>
                <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={isEditMode} // Disable only in edit mode
        />
        <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
        />
        <TextField
            label="Duration (minutes)"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
            disabled={isEditMode} // Disable only in edit mode
        />
        <TextField
            label="Workout Date"
            name="workoutDate"
            value={formData.workoutDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="datetime-local"
            disabled={isEditMode} // Disable only in edit mode
        />
        <TextField
            label="Difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={isEditMode} // Disable only in edit mode
        />
        <TextField
            label="Calories Burned"
            name="caloriesBurned"
            value={formData.caloriesBurned}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
            disabled={isEditMode} // Disable only in edit mode
        />
        <TextField
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={isEditMode} // Disable only in edit mode
        />
        <TextField
            label="Max Participants"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
            disabled={isEditMode} // Disable only in edit mode
        />
                </DialogContent>
                <DialogActions>
                    
                    <Button onClick={() => setOpenForm(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddWorkout} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Button onClick={handleGoBack} color="primary" >
        Back
    </Button>
        </Box>
        
        
    );
};

export default Workouts;
