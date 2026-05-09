"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Typography,
    Stack,
    Grid,
    LinearProgress,
    Chip,
    Divider,
    Paper
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function HealthPanel() {
    const [healthStatus, setHealthStatus] = useState<any>(null);
    const [checkingHealth, setCheckingHealth] = useState(false);

    const handleCheckHealth = async () => {
        setCheckingHealth(true);
        try {
            const res = await fetch('/api/health');
            if (res.ok) {
                setHealthStatus(await res.json());
            } else {
                setHealthStatus({ status: 'ERROR', error: 'Health endpoint unreachable' });
            }
        } catch (e) {
            setHealthStatus({ status: 'ERROR', error: 'Network failure' });
        } finally {
            setCheckingHealth(false);
        }
    };

    useEffect(() => {
        handleCheckHealth();
    }, []);

    return (
        <Card sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SpeedIcon color="primary" /> System Health Monitor
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Real-time status of critical infrastructure</Typography>
                </Box>
                <Button 
                    startIcon={<RefreshIcon />} 
                    size="small" 
                    variant="outlined" 
                    onClick={handleCheckHealth}
                    disabled={checkingHealth}
                >
                    Run Diagnostic
                </Button>
            </Stack>

            {checkingHealth && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

            {healthStatus ? (
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: healthStatus.database === 'connected' ? 'success.50' : 'error.50' }}>
                            <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>DATABASE</Typography>
                            <Chip 
                                icon={healthStatus.database === 'connected' ? <CheckCircleIcon /> : <ErrorIcon />}
                                label={healthStatus.database === 'connected' ? "HEALTHY" : "DOWN"} 
                                color={healthStatus.database === 'connected' ? "success" : "error"}
                                size="small"
                            />
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: healthStatus.storage === 'connected' ? 'success.50' : 'error.50' }}>
                            <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>STORAGE (S3)</Typography>
                            <Chip 
                                icon={healthStatus.storage === 'connected' ? <CheckCircleIcon /> : <ErrorIcon />}
                                label={healthStatus.storage === 'connected' ? "HEALTHY" : "DOWN"} 
                                color={healthStatus.storage === 'connected' ? "success" : "error"}
                                size="small"
                            />
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: healthStatus.email === 'ready' ? 'success.50' : 'error.50' }}>
                            <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>EMAIL (RESEND)</Typography>
                            <Chip 
                                icon={healthStatus.email === 'ready' ? <CheckCircleIcon /> : <ErrorIcon />}
                                label={healthStatus.email === 'ready' ? "READY" : "FAILED"} 
                                color={healthStatus.email === 'ready' ? "success" : "error"}
                                size="small"
                            />
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                    Initializing system diagnostic...
                </Typography>
            )}

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                Server Location: Jakarta / Singapore (Edge) • Latency: {healthStatus?.latency || '...'}ms
            </Typography>
        </Card>
    );
}
