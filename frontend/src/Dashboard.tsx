import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress, Grid } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        // This endpoint should be implemented in the backend
        const res = await axios.get(`${API_URL}/api/properties/stats`);
        setStats(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stats');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : stats ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Properties</Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average Price</Typography>
                <Typography variant="h4">€{stats.avgPrice?.toLocaleString() || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average Size</Typography>
                <Typography variant="h4">{stats.avgSize?.toLocaleString() || '-'} m²</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average Rooms</Typography>
                <Typography variant="h4">{stats.avgRooms?.toFixed(1) || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
} 