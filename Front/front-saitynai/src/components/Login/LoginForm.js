import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { loginUser } from "../../api";
import "./LoginForm.css"; // Import the CSS file

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!username || !password) {
            setError("Both fields are required");
            setLoading(false);
            return;
        }

        try {
            const response = await loginUser({ username, password });
            console.log("Login successful:", response);
            localStorage.setItem("accessToken", response.accessToken);
            window.location.href = "/"; // Adjust the path as needed
        } catch (err) {
            setError(err.response?.data || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            className="login-form-container"
        >
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
                <Typography color="error" variant="body2" className="login-error">
                    {error}
                </Typography>
            )}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                className="login-button"
            >
                {loading ? "Logging in..." : "Login"}
            </Button>
        </Box>
    );
};

export default LoginForm;
