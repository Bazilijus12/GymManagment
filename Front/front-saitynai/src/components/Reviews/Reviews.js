import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Ensure this package is installed
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
    Pagination,
} from "@mui/material";
import { Rating } from "@mui/lab"; 
import { useParams, useNavigate } from "react-router-dom";
import { fetchReviews, createReview } from "../../api";

const ReviewsOverview = () => {
    const { gymId, workoutId } = useParams();
    const navigate = useNavigate();

    // Extract user roles from token
    const accessToken = localStorage.getItem("accessToken");
    const userRoles = accessToken
        ? jwtDecode(accessToken)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        : [];
    const isAdmin = Array.isArray(userRoles) ? userRoles.includes("Admin") : userRoles === "Admin";
    const isGymUser = Array.isArray(userRoles) ? userRoles.includes("GymUser") : userRoles === "GymUser";

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [formData, setFormData] = useState({
        rating: 0,
        comment: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5; // Number of reviews per page

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const reviewsData = await fetchReviews(gymId, workoutId);
                setReviews(reviewsData);
            } catch (err) {
                setError("Failed to load reviews.");
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, [gymId, workoutId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = async () => {
        try {
            const newReview = {
                ...formData,
                reviewDate: new Date().toISOString(), // Set the current date as the review date
            };

            const response = await createReview(gymId, workoutId, newReview);
            setReviews((prev) => [...prev, response]); // Add the response directly to reviews
            setOpenForm(false);
            setFormData({ rating: 0, comment: "" });
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

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
                Workout Reviews
            </Typography>

            {/* Conditionally render the Write Review button */}
            {(isAdmin || isGymUser) && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
                        Write Review
                    </Button>
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rating</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentReviews.map((review) => (
                            <TableRow key={review.id || review.comment}>
                                <TableCell>
                                    <Rating value={review.rating} readOnly />
                                </TableCell>
                                <TableCell>{review.comment}</TableCell>
                                <TableCell>
                                    {new Date(review.reviewDate).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                <Pagination
                    count={Math.ceil(reviews.length / reviewsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
                <Button onClick={() => navigate(-1)}>Back</Button>
            </Box>

            {/* Dialog for adding a review */}
            <Dialog open={openForm} onClose={() => setOpenForm(false)}>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogContent>
                    <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={(event, newValue) => {
                            setFormData((prev) => ({ ...prev, rating: newValue }));
                        }}
                        size="large"
                    />
                    <TextField
                        label="Comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitReview} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReviewsOverview;
