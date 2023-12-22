function createMap(earthQuakes) {

  
    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
      "Earth Quakes": earthQuakes
    };
  
    // Create the map object with options.
    let map = L.map("map", {
      center: [41, -100],
      zoom: 5,
      layers: [streetmap, earthQuakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
    
    
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
    function getColor(d) {
      return d > 10 ? '#800026' :
             d > 8  ? '#BD0026' :
             d > 6.5  ? '#E31A1C' :
             d > 5  ? '#FC4E2A' :
             d > 3.5   ? '#FD8D3C' :
             d > 2   ? '#FEB24C' :
             d > 1   ? '#FED976' :
                        '#FFEDA0';
  }

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3.5, 5, 6.5, 8, 10],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + 'Depth ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };

 
legend.addTo(map);
  
  }
  
  function createMarkers(response) {

    function getColor(d) {
      return d > 10 ? '#800026' :
             d > 8  ? '#BD0026' :
             d > 6.5  ? '#E31A1C' :
             d > 5  ? '#FC4E2A' :
             d > 3.5   ? '#FD8D3C' :
             d > 2   ? '#FEB24C' :
             d > 1   ? '#FED976' :
                        '#FFEDA0';
  }

    // Pull the location property from response.data.
    let location = response.features;
  
    // Initialize an array to hold markers.
    let earthQuakes = [];
  
    // Loop through the array.
    for (let index = 0; index < location.length; index++) {
      let feature = location[index];
      
            
      // For each location, create a marker, and bind a popup with details.
      let earthQuake = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: feature.properties.mag * 2,
        color: getColor(feature.geometry.coordinates[2]),
        fillOpacity: .7
      }).bindPopup(`<b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`);
    
  
      // Add the marker to the markers array.
      earthQuakes.push(earthQuake);
    }
  
    // Create a layer group that's made from the markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthQuakes));
  }
  
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson").then(createMarkers);