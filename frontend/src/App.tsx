import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import PropertyList from './PropertyList';
import Dashboard from './Dashboard';
import MarketAnalysis from './MarketAnalysis';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Placeholder components - these will be created later
const PropertyListPlaceholder = () => <div>Property List</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/analysis" element={<MarketAnalysis />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 