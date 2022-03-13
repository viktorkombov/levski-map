// var region;

var appMap = {
    currProvinceImageOverlay: null,
    currPopup: null,
    currCoordinates: null
}

var zoomToCertainPlaceTemplate = '<button class="map-zoom-in-btn" onclick="zoomToCertainPlace()">Виж отблизо</button>';
function zoomToCertainPlace() {
    const coordinates = appMap.currPopup.layer.feature.geometry.coordinates.slice().reverse();
    let zoomLevel = 7.5;
    let duration = 0.5;
    const typeOfLayer = appMap.currPopup.layer.feature.properties.type;

    switch (typeOfLayer) {
        case 'province': zoomLevel = 10; duration = 0.4; break;
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

// function refreshPopup()
// var towns = L.layerGroup();

// var balkansBoundaries = L.geoJSON(balkans, {
//     style: function () {
//         return { weight: 1.5, color: 'gray' }
//     }
// });

var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 13,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
});

// sets a custom map of Bulgaria
var imageUrl = 'http://vlevskimuseum-bg.org/wp-content/uploads/2022/02/bulgaria-leaflet-map.png',
    imageBounds = [[45.25444353681564, 19.844982149279534], [40.16525805505217, 31.921737689954174]];
var bulgariaMap = L.imageOverlay(imageUrl, imageBounds);

var bulgar = L.tileLayer('http://vlevskimuseum-bg.org/wp-content/uploads/2022/02/map-{z}-{x}-{y}.png', {
    // var bulgar = L.tileLayer('map/{z}/{x}/{y}.png', {
    minZoom: 6,
    maxZoom: 7.49,
    bounds: [L.latLng(48.36220187357865, 9.768120068760378), L.latLng(36.819775824857466, 40.30455230465974)]
    //  48.36220187357865, 9.768120068760378 36.819775824857466, 40.30455230465974, 
});

var map = L.map('map', {
    center: [42.748126776142875, 25.327709216730058],
    zoom: 6.2,
    layers: [],
    layers: [bulgar],
    // zoomSnap: 0,
    // zoomDelta: 0.5,
    // wheelPxPerZoomLevel: 150,
    zoomControl: false,
    maxZoom: 16.9,
    minZoom: 6.2
});



// sets the zoom control to be positioned in the bottom left corner
L.control.zoom({
    position: 'bottomright'
}).addTo(map);


var geojsons = L.geoJSON(gojsons, {
    pointToLayer: generateLayer,
    style: function () {
        return { weight: 1.5, color: 'grey' }
    }
}).addTo(map);

var asd = L.geoJSON(geo).addTo(map);

function generateLayer(feature, latlng) {
    if (feature.properties.type.includes('Text')) {
        return generateTextLayer(feature, latlng);
    }
    let icon = {
        className: 'map-custom-divIcon map-custom-divIcon--' + (feature.properties.type ? feature.properties.type : 'province'),
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
        // icon.className = 'map-custom-text-divIcon-' + feature.properties.type
    }

    return L.marker(latlng, {
        icon: L.divIcon(icon)
    });
}




// console.log(`
//     [${gojsons.features.map(feat => {
//     // rec.coordinates[0] += 0.2;
//     return `{"type":"Feature","properties":{"type": "${feat.properties.type}Text","name": "${feat.properties.name}"},"geometry":{"type":"Point","coordinates": [${feat.geometry.coordinates.join(', ')}]}}`
// })}
// ]
// `);

// var geojsonsText = L.geoJSON(gojsons, {
//     pointToLayer: generateTextLayer
// });

// var geojsonBulgariaText = L.geoJSON(bulgariaGeoJson, {
//     pointToLayer: generateTextLayer
// });

// var geojsonBulgaria = L.geoJSON(bulgariaPointGeoJson, {
//     pointToLayer: generateLayer
// });

// geojsonBulgaria.on('popupopen', onPopupOpen);
// geojsonBulgaria.on('popupclose', onPopupClose);

geojsons.on('click', function () {
    map.closePopup();
});

function onPopupOpen(popup) {
    console.log(popup)
    if (popup.layer.feature.properties.type !== 'province') {
        map.closePopup();
    }
    appMap.currPopup = popup;
}

function onPopupClose() {
    appMap.currPopup = null;
}

// geojsonBulgaria.bindPopup(function (layer) {
//     let featureData = layer.feature.properties;
//     var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; // '<img class="popup-img" src="http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
//     return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}${zoomToCertainPlaceTemplate}`;
// }, { maxHeight: 300, maxWidth: 200, });


function generateTextLayer(feature, latlng) {
    const type = feature.properties.type;
    console.log(type)
    return L.marker(latlng, {
        icon: L.divIcon({
            html: feature.properties.name,
            className: 'map-custom-text-divIcon map-custom-text-divIcon--' + type,
        })
    })
}

// var geojsonCountries = L.geoJSON(countriesGeoJson, {
//     pointToLayer: generateTextLayer
// });

map.on('popupopen', function () {
    closeNav();
    closeSearchInput();
})


var geojsonMonuments = L.geoJSON(monumentsGeoJSON, {
    pointToLayer: generateLayer
});

var geojsontowns = L.geoJSON(townsGeoJson, {
    pointToLayer: generateLayer
});

geojsons.bindPopup(function (layer) {
    if (layer.feature.properties.type.includes('Text')) {
        return '<div></div>'
    }
    let featureData = provData[layer.feature.properties.pathName];
    var popupContent = featureData.type === 'province' ? '<p>' + featureData.content + '</p>' : 'Повече информация за Левски в област ' + featureData.name + ' ще бъде налична скоро!';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}${zoomToCertainPlaceTemplate}`;
}, { maxHeight: 300, maxWidth: 200, });

geojsons.on('popupopen', onPopupOpen);
geojsons.on('popupclose', onPopupClose);

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
    appMap.currPopup = null;
    e.target.getTooltip().setOpacity(0.9);
});

geojsontowns.bindTooltip(function (layer) {
    let featureData = layer.feature.properties;
    return featureData.name;
});

geojsontowns.bindPopup(function (layer) {
    let featureData = layer.feature.properties;
    let popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>'; // '<img class="popup-img" src="http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}${zoomToCertainPlaceTemplate}`;
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
});

geojsonPoints.on('popupopen', onPopupOpen);
geojsonPoints.on('popupclose', onPopupClose);

geojsonPoints.bindPopup(generatePopup, { maxHeight: 300, maxWidth: 200, });

function generatePopup(layer) {
    let featureData = layer.feature.properties;
    var popupContent = '<p class="popup-content">' + featureData.content + '</p>' + '<div class="popup-divider"></div>' + '<img class="popup-img" onclick="openOverlayImg()" src="http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + featureData.pathName + '.png"/>';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}${zoomToCertainPlaceTemplate}`;
}

// let towns = townsGeoJson.features.slice().map((rec) => {
//     if (rec.properties.name.includes('с.')) {
//         rec.properties.name = rec.properties.name.slice(3);
//         console.log(rec.properties.name)
//         rec.properties.type = 'village'
//     }
//     return rec;
// });

// // console.log(JSON.stringify(towns))
// let towns = townsGeoJson.features.slice().filter((rec) => {
//     // if (rec.properties.name.includes('манастир')) {
//     //     rec.properties.name = rec.properties.name.slice(3);
//     //     console.log(rec.properties.name)
//     //     rec.properties.type = 'church'
//     //     Object.assign(rec.properties, {iconUrl: true})
//     //     return rec;
//     // }

//     if (!rec.properties.name.includes('манастир')) {
//         return rec;
//     }

// });

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
// map.on('zoomend zoomlevelschange', zoom);

// map.on('zoomstart zoomlevelschange', function() {
//     map.closePopup();
// })

map.on('zoomend zoomlevelschange', function() {
    if ($('.bulgaria').is(":hidden")) {
        $('.bulgaria').show();
        $('.map-custom-divIcon--province').hide();
        $('.map-custom-text-divIcon--provinceText').hide();
    } else {
        $('.bulgaria').hide();
        $('.map-custom-divIcon--province').show();
        $('.map-custom-text-divIcon--provinceText').show();
    }
});

function displayBulgariaTooltip(flag = true) {
    const bulgariaElements = Array.from(document.getElementsByClassName('bulgaria'));
    bulgariaElements.forEach(t => t.style.opacity = flag ? 1 : 0);
}


function zoom() {
    console.log(map.getZoom())
    if (map.getZoom() >= 7 && map.getZoom() <= 7.49) {
        displayLayer([geojsons, USGS_USImagery, bulgariaMap, balkansBoundaries, geojsonPoints, geojsonCountries]);
        displayLayer([streets, geojsonMonuments, geojsontowns, geojsonBulgaria, geojsonBulgariaText,], false);
    } else if (map.getZoom() > 7.49) {
        displayLayer([geojsons, USGS_USImagery, balkansBoundaries, geojsonBulgaria, geojsonBulgariaText, geojsonPoints, geojsonCountries, bulgariaMap], false);
        displayLayer([streets, geojsontowns]);
    } else if (map.getZoom() < 7) {
        displayLayer([USGS_USImagery, bulgariaMap, balkansBoundaries, geojsonPoints, geojsonBulgaria, geojsonBulgariaText, geojsonPoints, geojsonCountries]);
        displayLayer([streets, geojsonMonuments, geojsons, geojsontowns], false);
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

