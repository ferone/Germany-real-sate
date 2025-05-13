INSERT INTO wohnung_miete (
    title, price, size, rooms, address, features, url, timestamp, description, equipment, location, energy_certificate, other_costs, availability, contact_info, property_type, additional_details, search_parameters
) VALUES (
    'Modern Apartment in Munich',
    1500,
    70,
    2,
    'Munich, Maxvorstadt',
    '{"balcony": true, "elevator": true}',
    'https://example.com/property/1',
    NOW(),
    'A beautiful modern apartment in the heart of Munich.',
    '{"kitchen": true}',
    '{"lat": 48.150, "lng": 11.567}',
    '{"energy_class": "B"}',
    '{"heating": 100}',
    'Available',
    '{"phone": "123456789"}',
    'apartment',
    '{"floor": 3}',
    '{"city": "Munich", "type": "rent"}'
); 