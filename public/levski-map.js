var appMap = {
    currProvinceImageOverlay: null,
    currPopup: null,
    currCoordinates: null
}
 
var zoomToCertainPlaceTemplate = '<button class="btn btn-primary btn-map-zoom" onclick="zoomToCertainPlace(event)">Виж отблизо</button>';

function zoomToCertainPlace(evt) {
    evt.preventDefault();
    const coordinates = appMap.currPopup.layer.feature.geometry.coordinates.slice().reverse();
    let zoomLevel = 7.49;
    let duration = 0.5;
    const typeOfLayer = appMap.currPopup.layer.feature.properties.type;

    switch (typeOfLayer) {
        case 'province': zoomLevel = 10; duration = 1; break;
        case 'point bulgaria': zoomLevel = 7.49; break;
        case 'point': zoomLevel = 8; duration = 0.6; break;
        case 'town': zoomLevel = 16; duration = 1; break;
        case 'village': zoomLevel = 16; duration = 1; break;
    }

    map.flyTo(coordinates, zoomLevel, {
        animate: true,
        duration: duration
    })
}

var route = L.control();

var balkansBoundaries = L.geoJSON(balkans, {
    style: function () {
        return { weight: 1.5, color: '#920049' }
    }
});

var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 13,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
});

var balkansMap = L.tileLayer('https://vlevskimuseum-bg.org/wp-content/uploads/2022/02/map-{z}-{x}-{y}.png', {
    minZoom: 6,
    maxZoom: 7.49,
    bounds: [L.latLng(48.36220187357865, 9.768120068760378), L.latLng(36.819775824857466, 40.30455230465974)]
});
var map = L.map('map', {
    center: [42.748126776142875, 25.327709216730058],
    zoom: 6.2,
    layers: [balkansMap, balkansBoundaries],
    zoomControl: false,
    maxZoom: 17,
    minZoom: 6.2,
    gestureHandling: true,
});

// sets the zoom control to be positioned in the bottom left corner
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

var geojsons = L.geoJSON(gojsons, {
    pointToLayer: generateLayer
});

function generateLayer(feature, latlng) {
    let icon = {
        className: 'map-custom-divIcon map-custom-divIcon--' + (feature.properties.type ? feature.properties.type : 'province'),
        iconSize: [20, 20],
        popupAnchor: [0, -3],
        iconAnchor: [11, 10]
    }
    if (feature.properties.iconUrl) {
        return L.marker(latlng, {
            icon: new L.icon({
                iconUrl: 'https://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + feature.properties.type + '4.png',
                iconSize: [35, 35]
            })
        });
    }

    if (feature.properties.text) {
        icon.html = provData[feature.properties.pathName].name;
        icon.iconSize = feature.properties?.type === 'country' ? [40, 40] : [20, 20];
        icon.className = 'text-divIcon-' + feature.properties.type
    }

    return L.marker(latlng, {
        icon: L.divIcon(icon)
    });
}



var geojsonsText = L.geoJSON(gojsons, {
    pointToLayer: generateTextLayer
});

var geojsonBulgariaText = L.geoJSON(bulgariaGeoJson, {
    pointToLayer: generateTextLayer
}).addTo(map);

var geojsonBulgaria = L.geoJSON(bulgariaPointGeoJson, {
    pointToLayer: generateLayer
}).addTo(map);

geojsonBulgaria.on('popupopen', onPopupOpen);
geojsonBulgaria.on('popupclose', onPopupClose);


function onPopupOpen(popup) {
    appMap.currPopup = popup;
}

function onPopupClose() {
    appMap.currPopup = null;
}

geojsonBulgaria.bindPopup(function (layer) {
    let featureData = layer.feature.properties;
    let ltlng = layer.feature.geometry.coordinates;
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; // '<img class="popup-img" src="https://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
    return `<h3 class="popup-heading">${featureData.name}</h3>${popupContent}${zoomToCertainPlaceTemplate}`;
}, { maxHeight: 300, maxWidth: 200, });


function generateTextLayer(feature, latlng) {
    const type = feature.properties.type !== 'town' ? feature.properties.type : 'province';
    return L.marker(latlng, {
        icon: L.divIcon({
            html: feature.properties.name,
            className: 'map-custom-text-divIcon map-custom-text-divIcon--' + type
        })
    })
}
 
var geojsonCountries = L.geoJSON(countriesGeoJson, {
    pointToLayer: generateTextLayer
}).addTo(map);

map.on('popupopen', function () {
    closeNav();
    closeSearchInput();
});

map.on('fullscreenchange', (e) => {
    if (map.isFullscreen()) {
        map.gestureHandling.disable();
    } else {
        map.gestureHandling.enable();
    }
});

var geojsonMonuments = L.geoJSON(monumentsGeoJSON, {
    pointToLayer: generateLayer
});

var geojsontowns = L.geoJSON(townsGeoJson, {
    pointToLayer: generateLayer
});



geojsons.bindPopup(function (layer) {
    let featureData = layer.feature.properties;
    var popupContent = featureData.type === 'province' ? '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>' : 'Повече информация за Левски в област ' + featureData.name + ' ще бъде налична скоро!';
    return `<h3 class="popup-heading">${featureData.name}</h3>${popupContent}${zoomToCertainPlaceTemplate}`;
}, { maxHeight: 300, maxWidth: 200, });
// https://vlevskimuseum-bg.org/wp-content/uploads/2022/03/lovech1.jpg
geojsons.on('popupopen', onPopupOpen);
geojsons.on('popupclose', onPopupClose);

geojsonMonuments.bindPopup(function (layer) {
    const featureData = layer.feature.properties;
    console.log(layer.feature)
    const gallery = featureData.gallery.map(rec => "'" + rec.replace(/"/g, '“') + "'").join(', ');
    const image = featureData.gallery.length ? `<img class="popup-img" onclick="openOverlayImg('${featureData.pathName}', '${featureData.name}', [${gallery}])" src="https://vlevskimuseum-bg.org/wp-content/uploads/2022/04/${featureData.pathName}.jpg"/>` : ''
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; 
    return `${image}<h3 class="popup-heading">${featureData.name}</h3>${popupContent}${zoomToCertainPlaceTemplate}`;
}, { maxHeight: 300, maxWidth: 200, });

geojsonMonuments.bindTooltip(function (layer) {
    let featureData = layer.feature.properties;
    return featureData.name;
});

// map.locate({setView: true,   enableHighAccuracy: true,
//     maximumAge: 60000,
//       timeout           : 1000});
// function onLocationFound(e) {
//     var radius = e.accuracy;
//     console.log(e)

//     L.marker(e.latlng).addTo(map)
//         .bindPopup("You are within " + radius + " meters from this point").openPopup();

//     // L.circle(e.latlng, radius).addTo(map);
// }

// map.on('locationfound', onLocationFound);

geojsonMonuments.on('popupopen', function (e) {
    appMap.currPopup = e;
    e.target.getTooltip().setOpacity(0);
});

geojsonMonuments.on('popupclose', function (e) {
    appMap.currPopup = null;
    e.target.getTooltip().setOpacity(0.9);
});

geojsontowns.bindTooltip(function (layer) {
    let featureData = layer.feature.properties;
    return featureData.name;
});

geojsontowns.bindPopup(function (layer) {
    const featureData = layer.feature.properties;
    const gallery = featureData.gallery.map(rec => "'" + rec.replace(/"/g, '“') + "'").join(', ');
    const image = featureData.gallery.length ? `<img class="popup-img" onclick="openOverlayImg('${featureData.pathName}', '${featureData.name}', [${gallery}])" src="https://vlevskimuseum-bg.org/wp-content/uploads/2022/04/${featureData.pathName}.jpg"/>` : ''
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; 
    return `${image}<h3 class="popup-heading">${featureData.name}</h3>${popupContent}${zoomToCertainPlaceTemplate}`;
}, { maxHeight: 300, maxWidth: 200, });

geojsontowns.on('popupopen', function (e) {
    appMap.currPopup = e;
    e.target.getTooltip().setOpacity(0);
});

geojsontowns.on('popupclose', function (e) {
    appMap.currPopup = null;
    e.target.getTooltip().setOpacity(0.9);
});

var geojsonPoints = L.geoJSON(pointsGeoJson, {
    pointToLayer: generateLayer
}).addTo(map);

geojsonPoints.on('popupopen', onPopupOpen);
geojsonPoints.on('popupclose', onPopupClose);

geojsonPoints.bindPopup(function (layer) {
    let featureData = layer.feature.properties;
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; // '<img class="popup-img" src="https://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
    return `<h3 class="popup-heading">${featureData.name}</h3>${popupContent}${zoomToCertainPlaceTemplate}`;
}, { maxHeight: 300, maxWidth: 200, });

let towns = townsGeoJson.features.slice().filter((rec) => {

    if (!rec.properties.name.includes('манастир')) {
        return rec;
    }

});


// console.log(`
//     [${countries.map(rec => {
//     // rec.coordinates[0] += 0.2;
//     return `{"type":"Feature","properties":{"type": "${rec.type}","name": "${rec.name}"},"geometry":{"type":"Point","coordinates": [${rec.coordinates.slice().reverse()}]}}`
// })}
// ]
// `);

map.on('click', function (e) {
    console.log(`${e.latlng.lng}, ${e.latlng.lat}`);
    console.log(map.getZoom());
    // map.locate({setView: true, maxZoom: 16});
    closeNav();
    closeSearchInput();
})
map.on('zoomend zoomlevelschange', zoom);

// map.on('zoomstart zoomlevelschange', function() {
//     map.closePopup();
// })

function displayBulgariaTooltip(flag = true) {
    const bulgariaElements = Array.from(document.getElementsByClassName('bulgaria'));
    bulgariaElements.forEach(t => t.style.opacity = flag ? 1 : 0);
}


function zoom() {
    if (map.getZoom() >= 7 && map.getZoom() <= 7.49) {
        displayLayer([geojsons, geojsonsText, balkansMap, balkansBoundaries, geojsonPoints, geojsonCountries]);
        displayLayer([streets, geojsonMonuments, geojsontowns, geojsonBulgaria, geojsonBulgariaText], false);
    } else if (map.getZoom() > 7.49) {
        displayLayer([geojsons, geojsonsText, balkansMap, balkansBoundaries, geojsonBulgaria, geojsonBulgariaText, geojsonPoints, geojsonCountries], false);
        displayLayer([streets, geojsontowns, geojsonMonuments]);
    } else if (map.getZoom() < 7) {
        displayLayer([balkansMap, balkansBoundaries, geojsonPoints, geojsonBulgaria, geojsonBulgariaText, geojsonPoints, geojsonCountries]);
        displayLayer([streets, geojsonMonuments, geojsons, geojsonsText, geojsontowns], false);
    }

    if (map.getZoom() >= 13) {
        displayLayer(geojsonMonuments);
        displayZoomButton(false);
    } else if (map.getZoom() < 13) {
        displayLayer(geojsonMonuments, false);
        displayZoomButton(true);
    }
}

function displayLayer(layers, flag = true) {
    layers = Array.isArray(layers) ? layers : [layers];
    layers.forEach(layer => {
        if (flag) {
            if (!map.hasLayer(layer)) {
                layer.addTo(map);
            }
        } else if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    })
}

function displayZoomButton(flag) {
    const zoomButtons = $('.btn-map-zoom'); 
    const isHidden = $('.btn-map-zoom').is(":hidden");;
    if (!flag && !isHidden) {
        zoomButtons.hide();
    } else if (flag && isHidden) {
        zoomButtons.show();
    }
}

