-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enum types
CREATE TYPE property_type AS ENUM (
    'RENT',
    'BUY',
    'COMMERCIAL_RENT',
    'COMMERCIAL_BUY',
    'HOUSE_RENT',
    'HOUSE_BUY',
    'LAND',
    'PARKING'
);

CREATE TYPE property_style AS ENUM (
    'APARTMENT',
    'LOFT',
    'PENTHOUSE',
    'MAISONETTE',
    'STUDIO',
    'TERRACED_HOUSE',
    'DETACHED_HOUSE',
    'SEMI_DETACHED_HOUSE',
    'VILLA',
    'OFFICE',
    'RETAIL',
    'INDUSTRIAL',
    'WAREHOUSE',
    'PARKING_SPACE',
    'GARAGE'
);

-- Create base table for all properties
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE,
    property_type property_type NOT NULL,
    property_style property_style,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL,
    price_per_sqm DECIMAL,
    size DECIMAL,
    rooms DECIMAL,
    bedrooms DECIMAL,
    bathrooms DECIMAL,
    floor_number INTEGER,
    year_built INTEGER,
    condition VARCHAR(50),
    heating_type VARCHAR(50),
    energy_rating VARCHAR(10),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL,
    longitude DECIMAL,
    features JSONB,
    equipment JSONB,
    location JSONB,
    energy_certificate JSONB,
    other_costs JSONB,
    availability TEXT,
    contact_info JSONB,
    url TEXT UNIQUE,
    source VARCHAR(50),
    search_parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for residential properties (apartments and houses)
CREATE TABLE IF NOT EXISTS residential_properties (
    id UUID PRIMARY KEY REFERENCES properties(id),
    balcony BOOLEAN,
    garden BOOLEAN,
    terrace BOOLEAN,
    elevator BOOLEAN,
    cellar BOOLEAN,
    parking_spaces INTEGER,
    pet_friendly BOOLEAN,
    barrier_free BOOLEAN,
    furnished BOOLEAN,
    additional_details JSONB
);

-- Create table for commercial properties
CREATE TABLE IF NOT EXISTS commercial_properties (
    id UUID PRIMARY KEY REFERENCES properties(id),
    commercial_type VARCHAR(50),
    floor_space DECIMAL,
    plot_size DECIMAL,
    ceiling_height DECIMAL,
    loading_docks INTEGER,
    office_space DECIMAL,
    storage_space DECIMAL,
    additional_details JSONB
);

-- Create table for land properties
CREATE TABLE IF NOT EXISTS land_properties (
    id UUID PRIMARY KEY REFERENCES properties(id),
    plot_size DECIMAL,
    development_type VARCHAR(50),
    building_density DECIMAL,
    floor_space_ratio DECIMAL,
    additional_details JSONB
);

-- Create table for parking properties
CREATE TABLE IF NOT EXISTS parking_properties (
    id UUID PRIMARY KEY REFERENCES properties(id),
    parking_type VARCHAR(50),
    covered BOOLEAN,
    security_features JSONB,
    additional_details JSONB
);

-- Create indexes
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_size ON properties(size);
CREATE INDEX idx_properties_rooms ON properties(rooms);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_properties_updated_at ON properties(updated_at);
CREATE INDEX idx_properties_location ON properties USING GIST (ll_to_earth(latitude, longitude));

-- Create full text search index
CREATE INDEX idx_properties_search ON properties USING GIN (
    to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(description, '') || ' ' || 
        coalesce(address, '') || ' ' || 
        coalesce(district, '')
    )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for property statistics
CREATE OR REPLACE VIEW property_statistics AS
SELECT 
    property_type,
    city,
    district,
    COUNT(*) as total_properties,
    AVG(price) as avg_price,
    AVG(price_per_sqm) as avg_price_per_sqm,
    AVG(size) as avg_size,
    AVG(rooms) as avg_rooms,
    MIN(price) as min_price,
    MAX(price) as max_price,
    MIN(price_per_sqm) as min_price_per_sqm,
    MAX(price_per_sqm) as max_price_per_sqm
FROM properties
GROUP BY property_type, city, district;

-- Create function to search properties
CREATE OR REPLACE FUNCTION search_properties(
    search_term TEXT,
    p_property_type property_type DEFAULT NULL,
    p_city VARCHAR DEFAULT NULL,
    p_min_price DECIMAL DEFAULT NULL,
    p_max_price DECIMAL DEFAULT NULL,
    p_min_size DECIMAL DEFAULT NULL,
    p_max_size DECIMAL DEFAULT NULL,
    p_min_rooms DECIMAL DEFAULT NULL,
    p_max_rooms DECIMAL DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    price DECIMAL,
    size DECIMAL,
    rooms DECIMAL,
    address TEXT,
    city VARCHAR,
    district VARCHAR,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.price,
        p.size,
        p.rooms,
        p.address,
        p.city,
        p.district,
        ts_rank_cd(
            to_tsvector('english', 
                coalesce(p.title, '') || ' ' || 
                coalesce(p.description, '') || ' ' || 
                coalesce(p.address, '') || ' ' || 
                coalesce(p.district, '')
            ),
            to_tsquery('english', search_term)
        ) as similarity
    FROM properties p
    WHERE 
        (p_property_type IS NULL OR p.property_type = p_property_type)
        AND (p_city IS NULL OR p.city = p_city)
        AND (p_min_price IS NULL OR p.price >= p_min_price)
        AND (p_max_price IS NULL OR p.price <= p_max_price)
        AND (p_min_size IS NULL OR p.size >= p_min_size)
        AND (p_max_size IS NULL OR p.size <= p_max_size)
        AND (p_min_rooms IS NULL OR p.rooms >= p_min_rooms)
        AND (p_max_rooms IS NULL OR p.rooms <= p_max_rooms)
        AND to_tsvector('english', 
            coalesce(p.title, '') || ' ' || 
            coalesce(p.description, '') || ' ' || 
            coalesce(p.address, '') || ' ' || 
            coalesce(p.district, '')
        ) @@ to_tsquery('english', search_term)
    ORDER BY similarity DESC;
END;
$$ LANGUAGE plpgsql; 