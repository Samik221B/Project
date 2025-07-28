const axios = require('axios');

// Function to get coordinates from location and country
async function getCoordinates(location, country) {
    try {
        const query = `${location}, ${country}`;
        // Using OpenStreetMap Nominatim API (free)
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: query,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'YourAppName/1.0' // Required by Nominatim
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                coordinates: [parseFloat(result.lon), parseFloat(result.lat)], // [longitude, latitude]
                display_name: result.display_name
            };
        } else {
            // Default coordinates if geocoding fails (center of India)
            console.log(`Geocoding failed for: ${query}`);
            return {
                coordinates: [78.9629, 20.5937], // [longitude, latitude]
                display_name: `${location}, ${country}`
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error.message);
        // Return default coordinates on error
        return {
            coordinates: [78.9629, 20.5937], // [longitude, latitude]
            display_name: `${location}, ${country}`
        };
    }
}

module.exports = { getCoordinates };