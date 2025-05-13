import os
import json
import time
import re
from datetime import datetime
from dataclasses import dataclass
from typing import Optional, List, Dict, Any, Union
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from pymongo import MongoClient
from psycopg2 import connect
from enum import Enum

# Load environment variables
load_dotenv()

class PropertyType(Enum):
    RENT = "Wohnung-Miete"
    BUY = "Wohnung-Kauf"
    COMMERCIAL_RENT = "Gewerbe-Miete"
    COMMERCIAL_BUY = "Gewerbe-Kauf"
    HOUSE_RENT = "Haus-Miete"
    HOUSE_BUY = "Haus-Kauf"
    LAND = "Grundstueck-Kauf"
    PARKING = "Parkplatz-Miete"

class PropertyStyle(Enum):
    APARTMENT = "apartment"
    LOFT = "loft"
    PENTHOUSE = "penthouse"
    MAISONETTE = "maisonette"
    TERRACED = "terraced"
    DETACHED = "detached"
    SEMI_DETACHED = "semi-detached"
    VILLA = "villa"
    OFFICE = "office"
    RETAIL = "retail"
    INDUSTRIAL = "industrial"
    MIXED_USE = "mixed-use"

@dataclass
class SearchParameters:
    """Search parameters for property search"""
    # Basic parameters
    city: str
    property_type: PropertyType
    property_style: Optional[PropertyStyle] = None
    
    # Price parameters
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    price_per_sqm: Optional[bool] = None
    additional_costs_included: Optional[bool] = None
    
    # Size parameters
    min_size: Optional[float] = None
    max_size: Optional[float] = None
    min_plot_size: Optional[float] = None
    max_plot_size: Optional[float] = None
    
    # Room parameters
    min_rooms: Optional[float] = None
    max_rooms: Optional[float] = None
    min_bedrooms: Optional[int] = None
    max_bedrooms: Optional[int] = None
    min_bathrooms: Optional[int] = None
    max_bathrooms: Optional[int] = None
    
    # Location parameters
    districts: Optional[List[str]] = None
    radius: Optional[float] = None
    coordinates: Optional[Dict[str, float]] = None
    
    # Property features
    has_balcony: Optional[bool] = None
    has_garden: Optional[bool] = None
    has_parking: Optional[bool] = None
    has_elevator: Optional[bool] = None
    has_cellar: Optional[bool] = None
    is_pet_friendly: Optional[bool] = None
    is_barrier_free: Optional[bool] = None
    is_furnished: Optional[bool] = None
    
    # Property condition
    property_condition: Optional[str] = None
    min_year_built: Optional[int] = None
    max_year_built: Optional[int] = None
    needs_renovation: Optional[bool] = None
    
    # Energy parameters
    heating_type: Optional[str] = None
    energy_rating: Optional[str] = None
    min_energy_rating: Optional[str] = None
    max_energy_rating: Optional[str] = None
    
    # Commercial specific
    min_ceiling_height: Optional[float] = None
    max_ceiling_height: Optional[float] = None
    has_loading_dock: Optional[bool] = None
    has_office_space: Optional[bool] = None
    has_warehouse_space: Optional[bool] = None
    has_retail_space: Optional[bool] = None
    
    # Land specific
    building_allowed: Optional[bool] = None
    min_plot_ratio: Optional[float] = None
    max_plot_ratio: Optional[float] = None

class ImmobilienscoutCollector:
    def __init__(self):
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI'))
        self.pg_conn = connect(os.getenv('POSTGRES_URI'))
        self.base_url = "https://www.immobilienscout24.de"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self._init_database()

    def _init_database(self):
        """Initialize database collections and tables"""
        # MongoDB collections
        db = self.mongo_client['real_estate']
        self.mongo_collections = {
            PropertyType.RENT: db['apartments_rent'],
            PropertyType.BUY: db['apartments_buy'],
            PropertyType.COMMERCIAL_RENT: db['commercial_rent'],
            PropertyType.COMMERCIAL_BUY: db['commercial_buy'],
            PropertyType.HOUSE_RENT: db['houses_rent'],
            PropertyType.HOUSE_BUY: db['houses_buy'],
            PropertyType.LAND: db['land'],
            PropertyType.PARKING: db['parking']
        }

        # PostgreSQL tables
        cursor = self.pg_conn.cursor()
        
        # Create tables for each property type
        for prop_type in PropertyType:
            table_name = prop_type.value.lower().replace('-', '_')
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {table_name} (
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
                )
            """)
        
        self.pg_conn.commit()

    def collect_properties(self, search_params: SearchParameters, max_pages: int = 10) -> List[Dict[str, Any]]:
        """
        Collect property listings from Immobilienscout24 with search parameters
        
        Args:
            search_params (SearchParameters): Search parameters for the property search
            max_pages (int): Maximum number of pages to scrape
        """
        properties = []
        
        for page in range(1, max_pages + 1):
            try:
                url = self._construct_search_url(search_params, page)
                response = requests.get(url, headers=self.headers)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                listings = soup.find_all('article', class_='result-list__listing')
                
                for listing in listings:
                    property_data = self._extract_property_data(listing)
                    if property_data and self._apply_filters(property_data, search_params):
                        property_data['property_type'] = search_params.property_type.value
                        property_data['search_parameters'] = self._serialize_search_params(search_params)
                        
                        detailed_data = self._get_detailed_property_info(property_data['url'])
                        if detailed_data:
                            property_data.update(detailed_data)
                            if self._apply_detailed_filters(property_data, search_params):
                                properties.append(property_data)
                
                time.sleep(2)
                
            except Exception as e:
                print(f"Error collecting data from page {page}: {str(e)}")
                continue
        
        return properties

    def _serialize_search_params(self, search_params: SearchParameters) -> Dict[str, Any]:
        """Convert search parameters to a serializable format"""
        return {
            'city': search_params.city,
            'property_type': search_params.property_type.value,
            'property_style': search_params.property_style.value if search_params.property_style else None,
            'min_price': search_params.min_price,
            'max_price': search_params.max_price,
            'min_size': search_params.min_size,
            'max_size': search_params.max_size,
            'min_rooms': search_params.min_rooms,
            'max_rooms': search_params.max_rooms,
            'districts': search_params.districts,
            'features': {
                'has_balcony': search_params.has_balcony,
                'has_garden': search_params.has_garden,
                'has_parking': search_params.has_parking,
                'is_pet_friendly': search_params.is_pet_friendly,
                'is_barrier_free': search_params.is_barrier_free
            }
        }

    def save_to_mongodb(self, properties: List[Dict[str, Any]], property_type: PropertyType):
        """Save collected properties to MongoDB in type-specific collection"""
        collection = self.mongo_collections[property_type]
        collection.insert_many(properties)

    def save_to_postgres(self, properties: List[Dict[str, Any]], property_type: PropertyType):
        """Save collected properties to PostgreSQL in type-specific table"""
        cursor = self.pg_conn.cursor()
        table_name = property_type.value.lower().replace('-', '_')
        
        for property_data in properties:
            cursor.execute(f"""
                INSERT INTO {table_name} (
                    title, price, size, rooms, address, features, url, timestamp,
                    description, equipment, location, energy_certificate,
                    other_costs, availability, contact_info, property_type,
                    additional_details, search_parameters
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                property_data['title'],
                property_data['price'],
                property_data['size'],
                property_data['rooms'],
                property_data['address'],
                json.dumps(property_data['features']),
                property_data['url'],
                property_data['timestamp'],
                property_data.get('description'),
                json.dumps(property_data.get('equipment', {})),
                json.dumps(property_data.get('location', {})),
                json.dumps(property_data.get('energy_certificate', {})),
                json.dumps(property_data.get('other_costs', {})),
                property_data.get('availability'),
                json.dumps(property_data.get('contact_info', {})),
                property_data['property_type'],
                json.dumps(property_data.get('additional_details', {})),
                json.dumps(property_data.get('search_parameters', {}))
            ))
        
        self.pg_conn.commit()

if __name__ == "__main__":
    collector = ImmobilienscoutCollector()
    
    # Example: Search for apartments for rent in Berlin
    search_params = SearchParameters(
        city="Berlin",
        property_type=PropertyType.RENT,
        property_style=PropertyStyle.APARTMENT,
        min_price=500,
        max_price=2000,
        min_size=50,
        max_size=120,
        min_rooms=2,
        max_rooms=4,
        districts=["Mitte", "Kreuzberg"],
        has_balcony=True,
        is_pet_friendly=True,
        min_year_built=1990,
        is_furnished=True
    )
    
    # Collect properties
    properties = collector.collect_properties(search_params)
    
    # Save to databases
    collector.save_to_mongodb(properties, search_params.property_type)
    collector.save_to_postgres(properties, search_params.property_type) 