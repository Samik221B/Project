// Initialize and add the map
function initializeMap() {
    // Get coordinates from listing data or use default coordinates
    var coordinates;
    var popupText;
    
    console.log('Map.js - Checking window.listingData:', window.listingData);
    
    if (window.listingData && 
        window.listingData.latitude !== null && 
        window.listingData.longitude !== null &&
        window.listingData.latitude !== 'null' && 
        window.listingData.longitude !== 'null') {
        coordinates = [window.listingData.latitude, window.listingData.longitude];
        popupText = `<b>${window.listingData.title}</b><br>${window.listingData.location}`;
        console.log('Map.js - Using listing coordinates:', coordinates);
    } else {
        // Fallback to default coordinates if listing data is not available
        coordinates = [17.4062, 78.3763];
        popupText = 'A pretty CSS popup.<br> Easily customizable.';
        console.log('Map.js - Using default coordinates:', coordinates);
        console.log('Map.js - Reason for fallback:');
        console.log('  - window.listingData exists:', !!window.listingData);
        if (window.listingData) {
            console.log('  - latitude exists:', !!window.listingData.latitude);
            console.log('  - longitude exists:', !!window.listingData.longitude);
            console.log('  - latitude value:', window.listingData.latitude);
            console.log('  - longitude value:', window.listingData.longitude);
        }
    }
    
    var map = L.map('map').setView(coordinates, 13);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker(coordinates).addTo(map)
    .bindPopup(popupText)
    .openPopup();
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});