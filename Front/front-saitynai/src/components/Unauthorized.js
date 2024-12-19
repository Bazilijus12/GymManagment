// Unauthorized.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" gutterBottom>
                403 - Unauthorized
            </Typography>
            <Typography variant="body1" gutterBottom>
                You do not have access to this page.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    sx={{
                        padding: '8px 16px',
                        textTransform: 'uppercase',
                    }}
                >
                    Go to Home
                </Button>
            </Box>
        </Box>
    );
};

export default Unauthorized;