// var region;

var appMap = {
    currProvinceImageOverlay: null,
    currPopup: null
}

var route = L.control();

// function refreshPopup()
// var cities = L.layerGroup();

var balkansBoundaries = L.geoJSON(balkans, {
    style: function () {
        return { weight: 1.5, color: 'gray' }
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

// sets a custom map of Bulgaria
var imageUrl = 'http://vlevskimuseum-bg.org/wp-content/uploads/2021/11/bulgaria.png',
    imageBounds = [[45.25444353681564, 19.844982149279534], [40.16525805505217, 31.921737689954174]];
var bulgariaMap = L.imageOverlay(imageUrl, imageBounds);

var map = L.map('map', {
    center: [42.748126776142875, 25.327709216730058],
    zoom: 6.2,
    layers: [USGS_USImagery, bulgariaMap, balkansBoundaries],
    zoomSnap: 0,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 150,
    zoomControl: false,
    maxZoom: 17,
    minZoom: 6.2
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
        className: 'location-divicon-' + (feature.properties.type ? feature.properties.type : 'province'),
        iconSize: [20, 20],
        popupAnchor: [0, -3],
        iconAnchor: [11, 10]
    }
    if (feature.properties.iconUrl) {
        return L.marker(latlng, {
            icon: new L.icon({
                iconUrl: 'http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + feature.properties.type + '4.png',
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


geojsonBulgaria.bindPopup(function (layer) {
    let featureData = layer.feature.properties;
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; // '<img class="popup-img" src="http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}`;
}, { maxHeight: 300, maxWidth: 200, });


function generateTextLayer(feature, latlng) {
    const type = feature.properties.type !== 'city' ? feature.properties.type : 'province';
    return L.marker(latlng, {
        icon: L.divIcon({
            html: feature.properties.name,
            className: 'text-divIcon-' + type
        })
    })
}

var geojsonCountries = L.geoJSON(countriesGeoJson, {
    pointToLayer: generateTextLayer
}).addTo(map);

map.on('popupopen', function () {
    closeNav();
    closeSearchInput();
})


var geojsonMonuments = L.geoJSON(monumentsGeoJSON, {
    pointToLayer: generateLayer
});

var geojsonCities = L.geoJSON(citiesGeoJson, {
    pointToLayer: generateLayer
});

geojsons.bindPopup(function (layer) {
    let featureData = provData[layer.feature.properties.pathName];
    var popupContent = featureData.type === 'province' ? '<p>' + featureData.content + '</p>' : 'Повече информация за Левски в област ' + featureData.name + ' ще бъде налична скоро!';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}`;
}, { maxHeight: 300, maxWidth: 200, });



geojsonMonuments.bindPopup(function (layer) {
    let featureData = sofiaProvince[layer.feature.properties.pathName];
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>' + '<img class="popup-img" onclick="openOverlayImg()" src="http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}`;
}, { maxHeight: 300, maxWidth: 200, });

geojsonMonuments.bindTooltip(function (layer) {
    let featureData = sofiaProvince[layer.feature.properties.pathName];
    return featureData.name;
});

geojsonMonuments.on('popupopen', function (e) {
    appMap.currPopup = e;
    e.target.getTooltip().setOpacity(0);
});

geojsonMonuments.on('popupclose', function (e) {
    e.target.getTooltip().setOpacity(0.9);
});

geojsons.on('popupopen', function (e) {
    appMap.currPopup = e;
    var path = 'http://vlevskimuseum-bg.org/wp-content/uploads/2021/11/' + e.layer.feature.properties.pathName + '.png',
        image = [[45.25444353681564, 19.844982149279534], [40.16525805505217, 31.921737689954174]],
        options = { interactive: true, opacity: 0.2, className: 'region' }
    appMap.currProvinceImageOverlay = L.imageOverlay(path, image, options).addTo(map);
});

geojsons.on('popupclose', function (e) {
    map.removeLayer(appMap.currProvinceImageOverlay);
    appMap.currProvinceImageOverlay = null;
});

geojsonCities.bindTooltip(function (layer) {
    let featureData = layer.feature.properties;
    return featureData.name;
});

geojsonCities.bindPopup(function (layer) {
    let featureData = layer.feature.properties;
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; // '<img class="popup-img" src="http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}`;
}, { maxHeight: 300, maxWidth: 200, });

geojsonCities.on('popupopen', function (e) {
    e.target.getTooltip().setOpacity(0);
});

geojsonCities.on('popupclose', function (e) {
    e.target.getTooltip().setOpacity(0.9);
});

var geojsonPoints = L.geoJSON(pointsGeoJson, {
    pointToLayer: generateLayer
}).addTo(map);

geojsonPoints.bindPopup(function (layer) {
    let featureData = layer.feature.properties;
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; // '<img class="popup-img" src="http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}`;
}, { maxHeight: 300, maxWidth: 200, });

// let towns = citiesGeoJson.features.slice().map((rec) => {
//     if (rec.properties.name.includes('с.')) {
//         rec.properties.name = rec.properties.name.slice(3);
//         console.log(rec.properties.name)
//         rec.properties.type = 'village'
//     }
//     return rec;
// });

// console.log(JSON.stringify(towns))
let towns = citiesGeoJson.features.slice().filter((rec) => {
    // if (rec.properties.name.includes('манастир')) {
    //     rec.properties.name = rec.properties.name.slice(3);
    //     console.log(rec.properties.name)
    //     rec.properties.type = 'church'
    //     Object.assign(rec.properties, {iconUrl: true})
    //     return rec;
    // }

    if (!rec.properties.name.includes('манастир')) {
        return rec;
    }

});

// gojsons.features.forEach(rec => {
//     const dataRec = provincesData.find(e => e.pathName === rec.properties.pathName);
//     Object.assign(rec.properties, {name: dataRec.name, content: dataRec.content, type: dataRec.type})
// })

// console.log(JSON.stringify(gojsons))

// L.geoJSON(karlovoRoute).addTo(map);


console.log(`
    [${countries.map(rec => {
    // rec.coordinates[0] += 0.2;
    return `{"type":"Feature","properties":{"type": "${rec.type}","name": "${rec.name}"},"geometry":{"type":"Point","coordinates": [${rec.coordinates.slice().reverse()}]}}`
})}
]
`);

map.on('click', function (e) {
    console.log(`${e.latlng.lng}, ${e.latlng.lat}`);
    console.log(map.getZoom());
    // map.locate({setView: true, maxZoom: 16});
    closeNav();
    closeSearchInput();
})
map.on('zoomend zoomlevelschange', zoom);

function displayBulgariaTooltip(flag = true) {
    const bulgariaElements = Array.from(document.getElementsByClassName('bulgaria'));
    bulgariaElements.forEach(t => t.style.opacity = flag ? 1 : 0);
}


function zoom() {
    if (map.getZoom() >= 7 && map.getZoom() <= 7.5) {
        displayLayer([geojsons, geojsonsText, bulgariaMap, USGS_USImagery, balkansBoundaries, geojsonPoints, geojsonCountries]);
        displayLayer([streets, geojsonMonuments, geojsonCities, geojsonBulgaria, geojsonBulgariaText], false);
    } else if (map.getZoom() > 7.5) {
        displayLayer([geojsons, geojsonsText, bulgariaMap, USGS_USImagery, balkansBoundaries, geojsonBulgaria, geojsonBulgariaText, geojsonPoints, geojsonCountries], false);
        displayLayer([streets, geojsonCities]);
    } else if (map.getZoom() < 7) {
        displayLayer([bulgariaMap, USGS_USImagery, balkansBoundaries, geojsonPoints, geojsonBulgaria, geojsonBulgariaText, geojsonPoints, geojsonCountries]);
        displayLayer([streets, geojsonMonuments, geojsons, geojsonsText, geojsonCities], false);
    }

    if (map.getZoom() >= 13) {
        displayLayer(geojsonMonuments);
    } else if (map.getZoom() < 13) {
        displayLayer(geojsonMonuments, false);
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

