import React, { useState, useEffect } from "react";
import api from "../../api";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

const AdminPage = () => {
    const [gyms, setGyms] = useState([]);
    const [form, setForm] = useState({
        id: "",
        name: "",
        address: "",
        city: "",
        phoneNumber: "",
        email: "",
        capacity: 0,
    });
    const [editMode, setEditMode] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchGyms();
    }, []);

    const fetchGyms = async () => {
        try {
            const response = await api.get("/gyms");
            setGyms(response.data);
        } catch (error) {
            console.error("Error fetching gyms:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleOpenAddModal = () => {
        resetForm(); // Clear form for adding a new gym
        setEditMode(false); // Ensure it's in add mode
        setOpenModal(true); // Open modal
    };

    const handleOpenEditModal = (gym) => {
        setForm(gym); // Populate form with gym data
        setEditMode(true); // Set to edit mode
        setOpenModal(true); // Open modal
    };

    const handleAddOrUpdate = async () => {
        if (editMode) {
            // Update logic
            try {
                const response = await api.put(`/gyms/${form.id}`, form);
                setGyms(gyms.map((g) => (g.id === form.id ? response.data : g)));
            } catch (error) {
                console.error("Error updating gym:", error);
            }
        } else {
            // Add logic
            try {
                const response = await api.post("/gyms", form);
                setGyms([...gyms, response.data]);
            } catch (error) {
                console.error("Error adding gym:", error);
            }
        }
        setOpenModal(false); // Close modal
        resetForm();
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/gyms/${id}`);
            setGyms(gyms.filter((g) => g.id !== id));
        } catch (error) {
            console.error("Error deleting gym:", error);
        }
    };

    const resetForm = () => {
        setForm({
            id: "",
            name: "",
            address: "",
            city: "",
            phoneNumber: "",
            email: "",
            capacity: 0,
        });
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        resetForm();
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Admin Gym Management Page
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
        <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddModal}
        >
            Add Gym
        </Button>
    </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Capacity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gyms.map((gym) => (
                            <TableRow key={gym.id}>
                                <TableCell>{gym.id}</TableCell>
                                <TableCell>{gym.name}</TableCell>
                                <TableCell>{gym.address}</TableCell>
                                <TableCell>{gym.city}</TableCell>
                                <TableCell>{gym.phoneNumber}</TableCell>
                                <TableCell>{gym.email}</TableCell>
                                <TableCell>{gym.capacity}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenEditModal(gym)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDelete(gym.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for Adding/Editing Gym */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{editMode ? "Edit Gym" : "Add Gym"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled = {editMode}
                    />
                    <TextField
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled = {editMode}
                    />
                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled = {editMode}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled = {editMode}
                    />
                    <TextField
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={form.capacity}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled = {editMode}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdate} color="primary">
                        {editMode ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPage;
