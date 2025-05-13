-- Create database
CREATE DATABASE germany_real_estate;

-- Connect to the database
\c germany_real_estate

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create tables
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2),
    location GEOMETRY(Point, 4326),
    address JSONB,
    features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    price DECIMAL(12,2),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property tables expected by backend
CREATE TABLE IF NOT EXISTS wohnung_miete (
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

CREATE TABLE IF NOT EXISTS wohnung_kauf (
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

CREATE TABLE IF NOT EXISTS gewerbe_miete (
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

CREATE TABLE IF NOT EXISTS gewerbe_kauf (
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

CREATE TABLE IF NOT EXISTS haus_miete (
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

CREATE TABLE IF NOT EXISTS haus_kauf (
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

CREATE TABLE IF NOT EXISTS grundstueck_kauf (
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

CREATE TABLE IF NOT EXISTS parkplatz_miete (
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

-- Create indexes
CREATE INDEX idx_properties_location ON properties USING GIST (location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_property_history_property_id ON property_history(property_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for properties table
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 