# Germany Real Estate Market Analysis

A comprehensive platform for analyzing the German real estate market, providing insights and KPIs for property investments.

## Features

### Core Features
- Real-time property listings
- Market trend analysis
- Price prediction models
- Location-based insights
- Investment opportunity scoring
- Custom report generation

### Data Collection Features
- Automated property data collection from Immobilienscout24
- Support for multiple property types:
  - Apartments (Rent/Buy)
  - Houses (Rent/Buy)
  - Commercial Properties (Rent/Buy)
  - Land
  - Parking Spaces
- Comprehensive property data extraction:
  - Basic information (title, price, size, rooms)
  - Detailed property information
  - Location data
  - Energy certificate information
  - Additional costs
  - Availability status
  - Contact information

### Advanced Search & Filtering
- Property type filtering
- Price range filtering
- Size and room filtering
- Location-based filtering:
  - District selection
  - Radius search
  - Coordinate-based search
- Property features filtering:
  - Balcony
  - Garden
  - Parking
  - Elevator
  - Cellar
  - Pet-friendly
  - Barrier-free
  - Furnished
- Property condition filtering:
  - Year built range
  - Renovation status
  - Energy rating
- Commercial-specific filters:
  - Ceiling height
  - Loading dock
  - Office/warehouse/retail space
- Land-specific filters:
  - Building permission
  - Plot ratio

### Data Storage
- Dual database support:
  - MongoDB for flexible document storage
  - PostgreSQL for structured data
- Type-specific collections/tables
- Automatic database initialization
- Search parameter persistence
- Timestamp tracking for data freshness

## Tech Stack

- Backend: Node.js/Express.js
- Frontend: React with TypeScript
- Database: PostgreSQL + MongoDB
- Data Pipeline: Python
- Visualization: D3.js/Chart.js

## Project Structure

```
germany-real-estate/
├── backend/           # Node.js/Express backend
├── frontend/         # React frontend
└── data-pipeline/    # Python data collection and analysis
    ├── src/
    │   ├── collectors/    # Data collection modules
    │   ├── processors/    # Data processing modules
    │   └── analyzers/     # Analysis modules
    └── requirements.txt   # Python dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- PostgreSQL
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Install data pipeline dependencies:
   ```bash
   cd data-pipeline
   pip install -r requirements.txt
   ```

### Environment Variables

Create `.env` files in the respective directories:

Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/germany-real-estate
POSTGRES_URI=postgresql://postgres:yourpassword@localhost:5432/germany_real_estate
JWT_SECRET=your_jwt_secret
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000
```

Data Pipeline (.env):
```
MONGODB_URI=mongodb://localhost:27017/germany-real-estate
POSTGRES_URI=postgresql://postgres:yourpassword@localhost:5432/germany_real_estate
```

### Running the Application

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Run the data pipeline:
   ```bash
   cd data-pipeline
   python src/collectors/immobilienscout_collector.py
   ```

## Data Collection Features

### Property Types
- Apartments (Rent/Buy)
- Houses (Rent/Buy)
- Commercial Properties (Rent/Buy)
- Land
- Parking Spaces

### Data Extraction
- Basic property information
- Detailed property information
- Location data
- Energy certificate information
- Additional costs
- Availability status
- Contact information

### Search Parameters
- Property type and style
- Price range and price per sqm
- Size and plot size
- Room configuration
- Location parameters
- Property features
- Property condition
- Energy parameters
- Commercial-specific parameters
- Land-specific parameters

## Detailed Features

### Data Collection System
The data collection system is built with scalability and reliability in mind:

#### Property Data Collection
- **Automated Scraping**: Uses Selenium and BeautifulSoup for reliable data extraction
- **Rate Limiting**: Implements intelligent delays between requests to respect website policies
- **Error Handling**: Comprehensive error handling with automatic retries
- **Data Validation**: Ensures data quality through validation checks
- **Proxy Support**: Optional proxy rotation for large-scale data collection

#### Property Types Support
1. **Residential Properties**
   - Apartments (Rent/Buy)
     - Studio apartments
     - Multi-room apartments
     - Penthouse apartments
   - Houses (Rent/Buy)
     - Single-family houses
     - Multi-family houses
     - Villas

2. **Commercial Properties**
   - Office spaces
   - Retail spaces
   - Industrial properties
   - Mixed-use properties

3. **Special Properties**
   - Land plots
   - Parking spaces
   - Development projects

### Search and Filtering System

#### Example Usage of Search Parameters
```python
# Example 1: Basic Apartment Search
search_params = SearchParameters(
    city="Berlin",
    property_type=PropertyType.RENT,
    min_price=500,
    max_price=2000,
    min_size=50,
    max_size=120,
    min_rooms=2,
    max_rooms=4,
    districts=["Mitte", "Kreuzberg"]
)

# Example 2: Commercial Property Search
search_params = SearchParameters(
    city="Munich",
    property_type=PropertyType.COMMERCIAL_RENT,
    min_size=200,
    max_size=1000,
    min_ceiling_height=3.0,
    has_office_space=True,
    has_loading_dock=True
)

# Example 3: Land Search
search_params = SearchParameters(
    city="Hamburg",
    property_type=PropertyType.LAND,
    min_plot_size=500,
    max_plot_size=2000,
    building_allowed=True,
    min_plot_ratio=0.3
)
```

### Data Storage System

#### MongoDB Collections
- **apartments_rent**: Rental apartment listings
- **apartments_buy**: Apartment sales listings
- **commercial_rent**: Commercial property rentals
- **commercial_buy**: Commercial property sales
- **houses_rent**: House rentals
- **houses_buy**: House sales
- **land**: Land plots
- **parking**: Parking spaces

#### PostgreSQL Tables
Each property type has its own table with the following structure:
```sql
CREATE TABLE property_type (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    price DECIMAL,
    size DECIMAL,
    rooms DECIMAL,
    address TEXT,
    features JSONB,
    url TEXT,
    timestamp TIMESTAMP,
    description TEXT,
    equipment JSONB,
    location JSONB,
    energy_certificate JSONB,
    other_costs JSONB,
    availability TEXT,
    contact_info JSONB,
    property_type VARCHAR(50),
    additional_details JSONB,
    search_parameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Documentation

### Property Endpoints

#### GET /api/properties
Retrieve property listings with filtering options.

**Query Parameters:**
- `type`: Property type (rent/buy/commercial)
- `city`: City name
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `minSize`: Minimum size
- `maxSize`: Maximum size
- `rooms`: Number of rooms
- `features`: Array of features

**Example Request:**
```bash
GET /api/properties?type=rent&city=Berlin&minPrice=500&maxPrice=2000
```

**Response:**
```json
{
  "properties": [
    {
      "id": "123",
      "title": "Modern Apartment in Mitte",
      "price": 1200,
      "size": 75,
      "rooms": 2,
      "address": "Berlin, Mitte",
      "features": ["balcony", "elevator"],
      "url": "https://..."
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### POST /api/properties/search
Advanced property search with complex filters.

**Request Body:**
```json
{
  "city": "Berlin",
  "propertyType": "rent",
  "priceRange": {
    "min": 500,
    "max": 2000
  },
  "sizeRange": {
    "min": 50,
    "max": 120
  },
  "features": ["balcony", "garden"],
  "districts": ["Mitte", "Kreuzberg"]
}
```

## Troubleshooting Guide

### Common Issues and Solutions

#### Database Connection Issues
1. **PostgreSQL Connection Error**
   - Check if PostgreSQL service is running
   - Verify connection string in .env file
   - Ensure database exists
   - Check user permissions

2. **MongoDB Connection Error**
   - Verify MongoDB service is running
   - Check connection string format
   - Ensure network access is allowed

#### Data Collection Issues
1. **Scraping Blocked**
   - Implement longer delays between requests
   - Use proxy rotation
   - Update user agent strings
   - Check website's robots.txt

2. **Missing Data**
   - Verify HTML structure hasn't changed
   - Check network connectivity
   - Review error logs
   - Update selectors if needed

#### Application Issues
1. **Backend Not Starting**
   - Check port availability
   - Verify environment variables
   - Check Node.js version
   - Review error logs

2. **Frontend Connection Issues**
   - Verify API URL in .env
   - Check CORS settings
   - Ensure backend is running
   - Check network connectivity

### Debugging Tools
- Use `console.log()` for backend debugging
- React Developer Tools for frontend
- MongoDB Compass for database inspection
- pgAdmin for PostgreSQL management

## Performance Optimization

### Data Collection
- Implement parallel processing for multiple cities
- Use connection pooling for databases
- Implement caching for frequently accessed data
- Optimize database queries with proper indexes

### Application
- Implement request caching
- Use pagination for large datasets
- Optimize database queries
- Implement lazy loading for images

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment Instructions

### Prerequisites
- Node.js v18 or higher
- Python 3.8+
- PostgreSQL 12+
- MongoDB 4.4+
- Git
- PM2 (for Node.js process management)
- Nginx (for reverse proxy)

### Production Environment Setup

#### 1. Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

#### 2. Database Setup
```bash
# PostgreSQL setup
sudo -u postgres psql
CREATE DATABASE germany_real_estate;
CREATE USER app_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE germany_real_estate TO app_user;
\q

# MongoDB setup
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 3. Application Deployment

1. **Clone and Setup Repository**
```bash
# Clone repository
git clone https://github.com/your-username/germany-real-estate.git
cd germany-real-estate

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r data-pipeline/requirements.txt
```

2. **Backend Setup**
```bash
cd backend
npm install
npm run build

# Create production .env file
cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/germany-real-estate
POSTGRES_URI=postgresql://app_user:your_secure_password@localhost:5432/germany_real_estate
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
EOL

# Start backend with PM2
pm2 start dist/server.js --name "germany-real-estate-backend"
pm2 save
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run build

# Create production .env file
cat > .env << EOL
REACT_APP_API_URL=https://api.yourdomain.com
EOL

# Serve frontend with Nginx
sudo cp build/* /var/www/html/
```

4. **Nginx Configuration**
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/germany-real-estate

# Add the following configuration
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/germany-real-estate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **SSL Setup with Let's Encrypt**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo certbot renew --dry-run
```

### Data Pipeline Deployment

1. **Setup Data Pipeline Service**
```bash
cd data-pipeline

# Create systemd service
sudo nano /etc/systemd/system/data-pipeline.service

# Add the following configuration
[Unit]
Description=Germany Real Estate Data Pipeline
After=network.target

[Service]
User=your_user
WorkingDirectory=/path/to/germany-real-estate/data-pipeline
Environment=PATH=/path/to/germany-real-estate/data-pipeline/venv/bin
ExecStart=/path/to/germany-real-estate/data-pipeline/venv/bin/python src/collectors/immobilienscout_collector.py
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start service
sudo systemctl enable data-pipeline
sudo systemctl start data-pipeline
```

### Monitoring and Maintenance

1. **PM2 Monitoring**
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs germany-real-estate-backend

# Restart application
pm2 restart germany-real-estate-backend
```

2. **Database Maintenance**
```bash
# PostgreSQL backup
pg_dump -U app_user germany_real_estate > backup.sql

# MongoDB backup
mongodump --db germany-real-estate --out /backup/mongodb

# Regular maintenance tasks
sudo systemctl restart postgresql
sudo systemctl restart mongod
```

3. **Log Rotation**
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/germany-real-estate

# Add configuration
/var/log/germany-real-estate/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

### Backup Strategy

1. **Database Backups**
```bash
# Create backup script
nano /scripts/backup.sh

# Add backup commands
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# PostgreSQL backup
pg_dump -U app_user germany_real_estate > $BACKUP_DIR/postgres_$TIMESTAMP.sql

# MongoDB backup
mongodump --db germany-real-estate --out $BACKUP_DIR/mongodb_$TIMESTAMP

# Compress backups
tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz $BACKUP_DIR/postgres_$TIMESTAMP.sql $BACKUP_DIR/mongodb_$TIMESTAMP

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

2. **Schedule Backups**
```bash
# Add to crontab
0 2 * * * /scripts/backup.sh
```

### Security Considerations

1. **Firewall Setup**
```bash
# Configure UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

2. **Security Headers**
```bash
# Add to Nginx configuration
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

3. **Regular Updates**
```bash
# Create update script
nano /scripts/update.sh

# Add update commands
#!/bin/bash
cd /path/to/germany-real-estate
git pull
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build
pm2 restart germany-real-estate-backend
sudo systemctl restart data-pipeline
```

## Docker Deployment

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

### Docker Setup

1. **Create Docker Network**
```bash
docker network create germany-real-estate-network
```

2. **Create Docker Compose File**
Create a `docker-compose.yml` file in the root directory:
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    container_name: germany-real-estate-postgres
    environment:
      POSTGRES_DB: germany_real_estate
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - germany-real-estate-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d germany_real_estate"]
      interval: 10s
      timeout: 5s
      retries: 5

  # MongoDB Database
  mongodb:
    image: mongo:5.0
    container_name: germany-real-estate-mongodb
    environment:
      MONGO_INITDB_DATABASE: germany-real-estate
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - germany-real-estate-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: germany-real-estate-backend
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://mongodb:27017/germany-real-estate
      - POSTGRES_URI=postgresql://app_user:your_secure_password@postgres:5432/germany_real_estate
      - JWT_SECRET=your_production_jwt_secret
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
      mongodb:
        condition: service_healthy
    networks:
      - germany-real-estate-network
    restart: unless-stopped

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: germany-real-estate-frontend
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - germany-real-estate-network
    restart: unless-stopped

  # Data Pipeline Service
  data-pipeline:
    build:
      context: ./data-pipeline
      dockerfile: Dockerfile
    container_name: germany-real-estate-data-pipeline
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/germany-real-estate
      - POSTGRES_URI=postgresql://app_user:your_secure_password@postgres:5432/germany_real_estate
    depends_on:
      postgres:
        condition: service_healthy
      mongodb:
        condition: service_healthy
    networks:
      - germany-real-estate-network
    restart: unless-stopped

volumes:
  postgres_data:
  mongodb_data:

networks:
  germany-real-estate-network:
    driver: bridge
```

3. **Create Dockerfiles**

Backend Dockerfile (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Frontend Dockerfile (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Data Pipeline Dockerfile (`data-pipeline/Dockerfile`):
```dockerfile
FROM python:3.8-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "src/collectors/immobilienscout_collector.py"]
```

4. **Create Nginx Configuration**
Create `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Deployment Steps

1. **Build and Start Services**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

2. **Database Initialization**
```bash
# Initialize PostgreSQL
docker-compose exec postgres psql -U app_user -d germany_real_estate -c "
CREATE TABLE IF NOT EXISTS apartments_rent (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    price DECIMAL,
    size DECIMAL,
    rooms DECIMAL,
    address TEXT,
    features JSONB,
    url TEXT,
    timestamp TIMESTAMP,
    description TEXT,
    equipment JSONB,
    location JSONB,
    energy_certificate JSONB,
    other_costs JSONB,
    availability TEXT,
    contact_info JSONB,
    property_type VARCHAR(50),
    additional_details JSONB,
    search_parameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"
```

3. **Monitoring and Maintenance**

```bash
# View container logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Scale services
docker-compose up -d --scale backend=3

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

4. **Backup and Restore**

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U app_user germany_real_estate > backup.sql

# Backup MongoDB
docker-compose exec mongodb mongodump --db germany-real-estate --out /backup

# Restore PostgreSQL
cat backup.sql | docker-compose exec -T postgres psql -U app_user -d germany_real_estate

# Restore MongoDB
docker-compose exec mongodb mongorestore --db germany-real-estate /backup/germany-real-estate
```

5. **Update Application**

```bash
# Pull latest changes
git pull

# Rebuild and restart services
docker-compose up -d --build

# Update specific service
docker-compose up -d --build [service_name]
```

### Docker Security Best Practices

1. **Use Docker Secrets**
```bash
# Create secrets
echo "your_secure_password" | docker secret create postgres_password -
echo "your_jwt_secret" | docker secret create jwt_secret -

# Update docker-compose.yml to use secrets
services:
  postgres:
    secrets:
      - postgres_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
```

2. **Implement Resource Limits**
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

3. **Use Non-Root Users**
```dockerfile
# In Dockerfiles
USER node  # For Node.js
USER nginx  # For Nginx
```

4. **Scan for Vulnerabilities**
```bash
# Install Docker Scout
docker scout quickview

# Scan images
docker scout cves [image_name]
```



I've implemented comprehensive filtering options for the property collector. Here are the key changes:
FilterOptions Class:
Created a dataclass to define all possible filter options:
Price range (min/max)
Size range (min/max)
Number of rooms (min/max)
Districts
Property condition
Features (balcony, garden, parking)
Pet-friendly and barrier-free options
Year built range
Heating type
Energy rating
URL Construction with Filters:
Added _construct_search_url method to build URLs with filter parameters
Supports all filter options in the URL query parameters
Handles multiple districts and other list-based filters
Two-Stage Filtering:
Basic filtering (_apply_filters):
Applied to initial property data
Checks price, size, rooms, and district
Detailed filtering (_apply_detailed_filters):
Applied after fetching detailed property information
Checks property condition, year built, heating type, energy rating
Verifies features like balcony, garden, parking, etc.
Type Hints and Error Handling:
Added type hints for better code maintainability
Comprehensive error handling in filter application
Graceful fallbacks when filter data is missing


The filters can be used to:
Narrow down search results to specific price ranges
Focus on particular districts
Find properties with specific features
Filter by property age and condition
Match energy efficiency requirements
Would you like me to:
Add more filter options (e.g., specific amenities, property styles)?
Implement filter validation to ensure valid filter combinations?
Add support for saving and loading filter presets?
Create a method to get available filter options for a specific city?


I've made significant enhancements to the collector. Here are the key changes:
Enhanced Search Parameters:
Added PropertyStyle enum for different property styles (apartment, loft, penthouse, etc.)
Created comprehensive SearchParameters class with:
Basic parameters (city, property type, style)
Price parameters (including price per sqm)
Size parameters (including plot size)
Room parameters (bedrooms, bathrooms)
Location parameters (districts, radius, coordinates)
Property features (elevator, cellar, furnished)
Property condition and age
Energy parameters
Commercial-specific parameters
Land-specific parameters
Separate Database Collections/Tables:
MongoDB collections:
apartments_rent
apartments_buy
commercial_rent
commercial_buy
houses_rent
houses_buy
land
parking
PostgreSQL tables:
Created separate tables for each property type
Added created_at and updated_at timestamps
Added search_parameters column to store search criteria
Database Initialization:
Added _init_database method to create necessary collections/tables
Automatic table creation with proper schema
Type-specific storage methods
Search Parameter Serialization:
Added _serialize_search_params method to store search criteria
Stores search parameters with each property record
Example usage:




Important notes about the environment variables:
Security:
Change the POSTGRES_PASSWORD to a secure password
Change the JWT_SECRET to a secure random string
Never commit .env files to version control
Keep different .env files for development and production
Database Configuration:
Make sure PostgreSQL and MongoDB are running on the specified hosts and ports
The database names (germany_real_estate and germany-real-estate) should match your schema
API Configuration:
The backend port (5000) should match the frontend's REACT_APP_API_URL
CORS settings should match your frontend's URL
Rate Limiting:
Adjust the rate limits based on your needs and the source website's policies
The data pipeline's rate limits are set conservatively to avoid being blocked
Feature Flags:
Enable/disable features as needed
Add your own Mapbox token if you're using maps
Add your Google Analytics tracking ID if you're using analytics