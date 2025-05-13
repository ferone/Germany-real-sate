import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, MenuItem, Button } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const propertyTypes = [
  { value: '', label: 'All' },
  { value: 'rent', label: 'Rent' },
  { value: 'buy', label: 'Buy' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
  { value: 'parking', label: 'Parking' },
];

export default function PropertyList() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
    rooms: '',
    features: '',
  });

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await axios.get(`${API_URL}/api/properties`, { params });
      setProperties(res.data.properties || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch properties');
    }
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  // Debug: print properties to console
  useEffect(() => { console.log('Fetched properties:', properties); }, [properties]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Property Listings</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField select label="Type" name="type" value={filters.type} onChange={handleChange} size="small" style={{ minWidth: 120 }}>
          {propertyTypes.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </TextField>
        <TextField label="City" name="city" value={filters.city} onChange={handleChange} size="small" />
        <TextField label="Min Price" name="minPrice" value={filters.minPrice} onChange={handleChange} size="small" type="number" />
        <TextField label="Max Price" name="maxPrice" value={filters.maxPrice} onChange={handleChange} size="small" type="number" />
        <TextField label="Min Size" name="minSize" value={filters.minSize} onChange={handleChange} size="small" type="number" />
        <TextField label="Max Size" name="maxSize" value={filters.maxSize} onChange={handleChange} size="small" type="number" />
        <TextField label="Rooms" name="rooms" value={filters.rooms} onChange={handleChange} size="small" type="number" />
        <TextField label="Features (comma)" name="features" value={filters.features} onChange={handleChange} size="small" />
        <Button variant="contained" onClick={fetchProperties}>Search</Button>
      </Box>
      {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Rooms</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Features</TableCell>
                <TableCell>URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.map((prop: any) => (
                <TableRow key={prop.id || prop.url}>
                  <TableCell>{prop.title}</TableCell>
                  <TableCell>{prop.price}</TableCell>
                  <TableCell>{prop.size}</TableCell>
                  <TableCell>{prop.rooms}</TableCell>
                  <TableCell>{prop.address}</TableCell>
                  <TableCell>{Array.isArray(prop.features) ? prop.features.join(', ') : (typeof prop.features === 'object' ? JSON.stringify(prop.features) : (prop.features || ''))}</TableCell>
                  <TableCell><a href={prop.url} target="_blank" rel="noopener noreferrer">View</a></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
} 