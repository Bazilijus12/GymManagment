import React from "react";
import { Box, Typography } from "@mui/material";
import LoginForm from "./LoginForm";

const LoginPage = () => (
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
            Login
        </Typography>
        <LoginForm />
    </Box>
);

export default LoginPage;
