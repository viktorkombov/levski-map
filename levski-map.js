// var region;

var appMap = {
    currPopup: null
}

// function refreshPopup()
var cities = L.layerGroup();

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
    zoom: 7,
    layers: [USGS_USImagery, bulgariaMap, balkansBoundaries],
    zoomSnap: 0,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 150,
    zoomControl: false,
    maxZoom: 17
});

// sets the zoom control to be positioned in the bottom left corner
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

map.on('popupopen', function (e) {
    var currButtonIndex = document.getElementsByClassName('map-button').length - 1;
    var button = document.getElementsByClassName('map-button')[currButtonIndex];
    if (button) {
        button.addEventListener('click', function (event) {
            map.setView(e.popup.options.coordinates, 9)
        })
    }
})


var geojsons = L.geoJSON(gojsons, {
    pointToLayer: generateLayer
}).addTo(map);

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
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.divIcon({
                html: provData[feature.properties.pathName].name,
                className: 'text-divIcon-province'
            })
        })
    }
}).addTo(map);

console.log('a')


var geojsonCities = L.geoJSON(sofiaprovinces, {
    pointToLayer: generateLayer
})


geojsons.bindPopup(function (layer) {
    let featureData = provData[layer.feature.properties.pathName];
    var popupContent = featureData.type === 'province' ? '<p>' + featureData.content + '</p>' : 'Повече информация за Левски в област ' + featureData.name + ' ще бъде налична скоро!';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}`;
}, { maxHeight: 300, maxWidth: 200, });

geojsonCities.bindPopup(function (layer) {
    let featureData = sofiaProvince[layer.feature.properties.pathName];
    var popupContent = '<p>' + featureData.content + '</p>';
    return `<h1 class="popup-heading">${featureData.name}</h1>${popupContent}`;
}, { maxHeight: 300, maxWidth: 200, });

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
        displayLayer([geojsons, geojsonsText, bulgariaMap, USGS_USImagery, balkansBoundaries]);
        displayLayer([streets, geojsonCities], false);
    } else if (map.getZoom() > 7.5) {
        displayLayer([geojsons, geojsonsText, bulgariaMap, USGS_USImagery, balkansBoundaries], false);
        displayLayer([streets, geojsonCities]);
    } else if (map.getZoom() < 7) {
        displayLayer([bulgariaMap, USGS_USImagery, balkansBoundaries]);
        displayLayer([streets, geojsonCities, geojsons, geojsonsText], false);
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

