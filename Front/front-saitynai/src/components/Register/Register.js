import React from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import useRegisterForm from "./RegisterForm";

const Register = () => {
    const {
        formData,
        handleChange,
        handleSubmit,
        message,
        error,
        loading,
    } = useRegisterForm();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                padding: 3,
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Register
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%", maxWidth: 400, backgroundColor: "#fff", padding: 3, borderRadius: 2, boxShadow: 3 }}
            >
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                />
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}
                {message && (
                    <Typography color="success" variant="body2" sx={{ mt: 1 }}>
                        {message}
                    </Typography>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </Button>
            </Box>
        </Box>
    );
};

export default Register;
