require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

// Test database connection
pgPool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

// Helper: List of property tables
const propertyTables = [
  'wohnung_miete', 'wohnung_kauf', 'gewerbe_miete', 'gewerbe_kauf',
  'haus_miete', 'haus_kauf', 'grundstueck_kauf', 'parkplatz_miete'
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// GET /api/properties/stats
app.get('/api/properties/stats', async (req, res) => {
  try {
    let total = 0, sumPrice = 0, sumSize = 0, sumRooms = 0, count = 0;
    for (const table of propertyTables) {
      const result = await pgPool.query(`SELECT COUNT(*) AS total, AVG(price) AS avg_price, AVG(size) AS avg_size, AVG(rooms) AS avg_rooms FROM ${table}`);
      total += Number(result.rows[0].total);
      if (result.rows[0].avg_price) sumPrice += Number(result.rows[0].avg_price);
      if (result.rows[0].avg_size) sumSize += Number(result.rows[0].avg_size);
      if (result.rows[0].avg_rooms) sumRooms += Number(result.rows[0].avg_rooms);
      count++;
    }
    res.json({
      total,
      avgPrice: count ? sumPrice / count : 0,
      avgSize: count ? sumSize / count : 0,
      avgRooms: count ? sumRooms / count : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/properties/price-trend
app.get('/api/properties/price-trend', async (req, res) => {
  try {
    const queries = propertyTables.map(table =>
      `SELECT DATE_TRUNC('month', created_at) AS month, AVG(price) AS avg_price FROM ${table} WHERE created_at > NOW() - INTERVAL '12 months' GROUP BY month`
    );
    const results = await Promise.all(queries.map(q => pgPool.query(q)));
    const monthMap = {};
    results.forEach(r => {
      r.rows.forEach(row => {
        const m = row.month.toISOString().slice(0,7);
        if (!monthMap[m]) monthMap[m] = [];
        monthMap[m].push(Number(row.avg_price));
      });
    });
    const labels = Object.keys(monthMap).sort();
    const data = labels.map(m => monthMap[m].reduce((a,b) => a+b,0)/monthMap[m].length);
    res.json({
      labels,
      datasets: [{ label: 'Avg Price', data, borderColor: '#1976d2', backgroundColor: '#90caf9' }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/properties/city-distribution
app.get('/api/properties/city-distribution', async (req, res) => {
  try {
    const cityMap = {};
    for (const table of propertyTables) {
      const result = await pgPool.query(`SELECT address, COUNT(*) AS count FROM ${table} GROUP BY address`);
      result.rows.forEach(row => {
        const city = (row.address||'').split(',')[0].trim();
        if (!city) return;
        if (!cityMap[city]) cityMap[city] = 0;
        cityMap[city] += Number(row.count);
      });
    }
    const labels = Object.keys(cityMap);
    const data = labels.map(city => cityMap[city]);
    res.json({
      labels,
      datasets: [{ label: 'Properties', data, backgroundColor: '#1976d2' }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/properties/type-distribution
app.get('/api/properties/type-distribution', async (req, res) => {
  try {
    const typeLabels = [
      'Apartment Rent', 'Apartment Buy', 'Commercial Rent', 'Commercial Buy',
      'House Rent', 'House Buy', 'Land', 'Parking'
    ];
    const data = [];
    for (let i = 0; i < propertyTables.length; i++) {
      const result = await pgPool.query(`SELECT COUNT(*) AS count FROM ${propertyTables[i]}`);
      data.push(Number(result.rows[0].count));
    }
    res.json({
      labels: typeLabels,
      datasets: [{ label: 'Properties', data, backgroundColor: ['#1976d2','#dc004e','#388e3c','#fbc02d','#7b1fa2','#0288d1','#c62828','#6d4c41'] }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/properties/avg-price-by-type
app.get('/api/properties/avg-price-by-type', async (req, res) => {
  try {
    const typeLabels = [
      'Apartment Rent', 'Apartment Buy', 'Commercial Rent', 'Commercial Buy',
      'House Rent', 'House Buy', 'Land', 'Parking'
    ];
    const data = [];
    for (let i = 0; i < propertyTables.length; i++) {
      const result = await pgPool.query(`SELECT AVG(price) AS avg_price FROM ${propertyTables[i]}`);
      data.push(result.rows[0].avg_price ? Number(result.rows[0].avg_price) : 0);
    }
    res.json({
      labels: typeLabels,
      datasets: [{ label: 'Avg Price', data, backgroundColor: '#1976d2' }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/properties
app.get('/api/properties', async (req, res) => {
  try {
    const { type, city, minPrice, maxPrice, minSize, maxSize, rooms } = req.query;
    let tables = propertyTables;
    if (type && propertyTables.includes(type)) {
      tables = [type];
    }
    let allProps = [];
    for (const table of tables) {
      let where = [];
      if (city) where.push(`address ILIKE '%${city}%'`);
      if (minPrice) where.push(`price >= ${Number(minPrice)}`);
      if (maxPrice) where.push(`price <= ${Number(maxPrice)}`);
      if (minSize) where.push(`size >= ${Number(minSize)}`);
      if (maxSize) where.push(`size <= ${Number(maxSize)}`);
      if (rooms) where.push(`rooms = ${Number(rooms)}`);
      const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const q = `SELECT id, title, price, size, rooms, address, url, created_at FROM ${table} ${whereClause}`;
      const result = await pgPool.query(q);
      allProps = allProps.concat(result.rows.map(r => ({
        ...r,
        price: r.price !== undefined && r.price !== null ? Number(r.price) : null,
        size: r.size !== undefined && r.size !== null ? Number(r.size) : null,
        rooms: r.rooms !== undefined && r.rooms !== null ? Number(r.rooms) : null,
        property_type: table
      })));
    }
    res.json({ properties: allProps, total: allProps.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 