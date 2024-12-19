import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGymById } from "../../api";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
} from "@mui/material";

const GymDetails = () => {
    const { gymId } = useParams();
    const navigate = useNavigate();
    const [gym, setGym] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGymDetails = async () => {
            try {
                const gymData = await fetchGymById(gymId);
                setGym(gymData);
            } catch (err) {
                setError("Failed to fetch gym details.");
            } finally {
                setLoading(false);
            }
        };

        loadGymDetails();
    }, [gymId]);

    if (loading)
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );

    if (error)
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Box>
        );

    return (
        <Box
            sx={{
                padding: 3,
                backgroundColor: "white",
                minHeight: "70vh",
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Gym Details
            </Typography>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell variant="head">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{gym.name}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Address
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">
                                    {gym.address}, {gym.city}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Phone Number
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{gym.phoneNumber}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Email
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{gym.email}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Capacity
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">{gym.capacity}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/gyms/${gymId}/workouts`)}
                >
                    View Workouts
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/gyms/${gymId}/workouts/ended`)}
                >
                    Reviews of Ended Workouts
                </Button>
            </Box>
        </Box>
    );
};

export default GymDetails;
