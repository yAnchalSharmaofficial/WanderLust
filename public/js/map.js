
    {/* // Create the map */}
    var map = L.map('map').setView(latlng, 10); // Centered on Delhi

    {/* // Add OpenStreetMap tiles (Free) */}
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    
    {/* // Add a marker */}
    L.marker(latlng).addTo(map)
        .bindPopup("Exact Location will be provided after booking")
        .openPopup();
