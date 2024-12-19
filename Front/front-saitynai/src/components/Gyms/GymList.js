import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGyms } from "../../api";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faDumbbell, faUsers } from "@fortawesome/free-solid-svg-icons";

const GymsList = () => {
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const loadGyms = async () => {
            try {
                const data = await fetchGyms();
                setGyms(data);
            } catch (err) {
                setError("Failed to fetch gyms.");
            } finally {
                setLoading(false);
            }
        };

        loadGyms();
    }, []);

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
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
            }}
        >
<Typography
  variant="h4"
  component="h1"
  gutterBottom
  align="center"
  sx={{
    fontFamily: "Roboto, Arial, sans-serif",
    fontStyle: "italic",
    fontWeight: 100,
  }}
>
  List of Gyms
</Typography>
            <Grid container spacing={3}>
                {gyms.map((gym) => (
                    <Grid item xs={12} sm={6} md={4} key={gym.id}>
                        <Card
                            onClick={() => navigate(`/gyms/${gym.id}`)} // Navigate to GymDetails
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    boxShadow: 4,
                                },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    <FontAwesomeIcon icon={faDumbbell} style={{ marginRight: "8px", color: "#555" }} />
                                    {gym.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: "8px", color: "#777" }} />
                                    {gym.address}, {gym.city}
                                </Typography>
                                <Typography variant="body2">
                                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: "8px", color: "#777" }} />
                                    Capacity: {gym.capacity}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default GymsList;
