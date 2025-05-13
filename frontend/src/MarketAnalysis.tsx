import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { Line, Bar, Pie, Bar as HorizontalBar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function MarketAnalysis() {
  const [trendData, setTrendData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [typeDist, setTypeDist] = useState<any>(null);
  const [avgPriceByType, setAvgPriceByType] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError('');
      try {
        // These endpoints should be implemented in the backend
        const [trendRes, cityRes, typeDistRes, avgPriceTypeRes] = await Promise.all([
          axios.get(`${API_URL}/api/properties/price-trend`),
          axios.get(`${API_URL}/api/properties/city-distribution`),
          axios.get(`${API_URL}/api/properties/type-distribution`),
          axios.get(`${API_URL}/api/properties/avg-price-by-type`),
        ]);
        setTrendData(trendRes.data);
        setCityData(cityRes.data);
        setTypeDist(typeDistRes.data);
        setAvgPriceByType(avgPriceTypeRes.data);
        // Debug: print chart data
        console.log('trendData', trendRes.data);
        console.log('cityData', cityRes.data);
        console.log('typeDist', typeDistRes.data);
        console.log('avgPriceByType', avgPriceTypeRes.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analysis data');
      }
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Market Analysis</Typography>
      {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Average Price Trend</Typography>
              {trendData ? <Line data={trendData} /> : <Typography>No data</Typography>}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Property Count by City</Typography>
              {cityData ? <Bar data={cityData} /> : <Typography>No data</Typography>}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Property Type Distribution</Typography>
              {typeDist ? <Pie data={typeDist} /> : <Typography>No data</Typography>}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Average Price by Property Type</Typography>
              {avgPriceByType ? <HorizontalBar data={avgPriceByType} options={{ indexAxis: 'y' }} /> : <Typography>No data</Typography>}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 