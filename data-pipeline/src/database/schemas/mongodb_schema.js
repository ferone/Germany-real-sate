// MongoDB Schema Definitions

// Property Type Enum
const PropertyType = {
    RENT: 'RENT',
    BUY: 'BUY',
    COMMERCIAL_RENT: 'COMMERCIAL_RENT',
    COMMERCIAL_BUY: 'COMMERCIAL_BUY',
    HOUSE_RENT: 'HOUSE_RENT',
    HOUSE_BUY: 'HOUSE_BUY',
    LAND: 'LAND',
    PARKING: 'PARKING'
};

// Property Style Enum
const PropertyStyle = {
    APARTMENT: 'APARTMENT',
    LOFT: 'LOFT',
    PENTHOUSE: 'PENTHOUSE',
    MAISONETTE: 'MAISONETTE',
    STUDIO: 'STUDIO',
    TERRACED_HOUSE: 'TERRACED_HOUSE',
    DETACHED_HOUSE: 'DETACHED_HOUSE',
    SEMI_DETACHED_HOUSE: 'SEMI_DETACHED_HOUSE',
    VILLA: 'VILLA',
    OFFICE: 'OFFICE',
    RETAIL: 'RETAIL',
    INDUSTRIAL: 'INDUSTRIAL',
    WAREHOUSE: 'WAREHOUSE',
    PARKING_SPACE: 'PARKING_SPACE',
    GARAGE: 'GARAGE'
};

// Base Property Schema
const basePropertySchema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['external_id', 'property_type', 'title', 'address', 'city'],
            properties: {
                external_id: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                property_type: {
                    enum: Object.values(PropertyType),
                    description: 'must be a valid property type and is required'
                },
                property_style: {
                    enum: Object.values(PropertyStyle),
                    description: 'must be a valid property style'
                },
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                description: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                price: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                price_per_sqm: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                size: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                rooms: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                bedrooms: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                bathrooms: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                floor_number: {
                    bsonType: 'int',
                    description: 'must be an integer'
                },
                year_built: {
                    bsonType: 'int',
                    description: 'must be an integer'
                },
                condition: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                heating_type: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                energy_rating: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                address: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                city: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                district: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                postal_code: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                location: {
                    bsonType: 'object',
                    properties: {
                        type: {
                            enum: ['Point'],
                            description: 'must be "Point"'
                        },
                        coordinates: {
                            bsonType: 'array',
                            items: {
                                bsonType: 'double'
                            },
                            description: 'must be an array of two numbers [longitude, latitude]'
                        }
                    }
                },
                features: {
                    bsonType: 'object',
                    description: 'must be an object'
                },
                equipment: {
                    bsonType: 'object',
                    description: 'must be an object'
                },
                energy_certificate: {
                    bsonType: 'object',
                    description: 'must be an object'
                },
                other_costs: {
                    bsonType: 'object',
                    description: 'must be an object'
                },
                availability: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                contact_info: {
                    bsonType: 'object',
                    description: 'must be an object'
                },
                url: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                source: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                search_parameters: {
                    bsonType: 'object',
                    description: 'must be an object'
                },
                created_at: {
                    bsonType: 'date',
                    description: 'must be a date'
                },
                updated_at: {
                    bsonType: 'date',
                    description: 'must be a date'
                }
            }
        }
    },
    validationAction: 'warn'
};

// Residential Property Schema
const residentialPropertySchema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['property_id'],
            properties: {
                property_id: {
                    bsonType: 'objectId',
                    description: 'must be an ObjectId and is required'
                },
                balcony: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                garden: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                terrace: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                elevator: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                cellar: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                parking_spaces: {
                    bsonType: 'int',
                    description: 'must be an integer'
                },
                pet_friendly: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                barrier_free: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                furnished: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                additional_details: {
                    bsonType: 'object',
                    description: 'must be an object'
                }
            }
        }
    },
    validationAction: 'warn'
};

// Commercial Property Schema
const commercialPropertySchema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['property_id'],
            properties: {
                property_id: {
                    bsonType: 'objectId',
                    description: 'must be an ObjectId and is required'
                },
                commercial_type: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                floor_space: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                plot_size: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                ceiling_height: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                loading_docks: {
                    bsonType: 'int',
                    description: 'must be an integer'
                },
                office_space: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                storage_space: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                additional_details: {
                    bsonType: 'object',
                    description: 'must be an object'
                }
            }
        }
    },
    validationAction: 'warn'
};

// Land Property Schema
const landPropertySchema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['property_id'],
            properties: {
                property_id: {
                    bsonType: 'objectId',
                    description: 'must be an ObjectId and is required'
                },
                plot_size: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                development_type: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                building_density: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                floor_space_ratio: {
                    bsonType: 'double',
                    description: 'must be a number'
                },
                additional_details: {
                    bsonType: 'object',
                    description: 'must be an object'
                }
            }
        }
    },
    validationAction: 'warn'
};

// Parking Property Schema
const parkingPropertySchema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['property_id'],
            properties: {
                property_id: {
                    bsonType: 'objectId',
                    description: 'must be an ObjectId and is required'
                },
                parking_type: {
                    bsonType: 'string',
                    description: 'must be a string'
                },
                covered: {
                    bsonType: 'bool',
                    description: 'must be a boolean'
                },
                security_features: {
                    bsonType: 'object',
                    description: 'must be an object'
                },
                additional_details: {
                    bsonType: 'object',
                    description: 'must be an object'
                }
            }
        }
    },
    validationAction: 'warn'
};

// Create collections with schemas
db.createCollection('properties', basePropertySchema);
db.createCollection('residential_properties', residentialPropertySchema);
db.createCollection('commercial_properties', commercialPropertySchema);
db.createCollection('land_properties', landPropertySchema);
db.createCollection('parking_properties', parkingPropertySchema);

// Create indexes
db.properties.createIndex({ external_id: 1 }, { unique: true });
db.properties.createIndex({ property_type: 1 });
db.properties.createIndex({ city: 1 });
db.properties.createIndex({ district: 1 });
db.properties.createIndex({ price: 1 });
db.properties.createIndex({ size: 1 });
db.properties.createIndex({ rooms: 1 });
db.properties.createIndex({ created_at: 1 });
db.properties.createIndex({ updated_at: 1 });
db.properties.createIndex({ location: '2dsphere' });
db.properties.createIndex({ 
    title: 'text', 
    description: 'text', 
    address: 'text', 
    district: 'text' 
});

// Create compound indexes for common queries
db.properties.createIndex({ 
    property_type: 1, 
    city: 1, 
    price: 1 
});

db.properties.createIndex({ 
    property_type: 1, 
    city: 1, 
    size: 1 
});

db.properties.createIndex({ 
    property_type: 1, 
    city: 1, 
    rooms: 1 
});

// Create indexes for property-specific collections
db.residential_properties.createIndex({ property_id: 1 }, { unique: true });
db.commercial_properties.createIndex({ property_id: 1 }, { unique: true });
db.land_properties.createIndex({ property_id: 1 }, { unique: true });
db.parking_properties.createIndex({ property_id: 1 }, { unique: true }); 