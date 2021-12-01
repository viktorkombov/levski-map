// var region;
var cities = L.layerGroup();

var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale = L.tileLayer(mbUrl, { id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr }),
    streets = L.tileLayer(mbUrl, { id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr });
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 13,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

// sets a custom map of Bulgaria
var imageUrl = 'http://vlevskimuseum-bg.org/wp-content/uploads/2021/11/bulgaria.png',
    imageBounds = [[45.25444353681564, 19.844982149279534], [40.16525805505217, 31.921737689954174]];
var bulgariaMap = L.imageOverlay(imageUrl, imageBounds);

var map = L.map('map', {
    center: [42.748126776142875, 25.327709216730058],
    zoom: 6.2,
    layers: [USGS_USImagery, bulgariaMap],
    zoomSnap: 0,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 150,
    zoomControl: false,
    maxZoom: 8
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


var provincesMarkers = generateMarkers(provincesData);
var provicnesLayers = L.layerGroup(provincesMarkers);

var countriesMarkers = generateMarkers(countries);
L.layerGroup(countriesMarkers).addTo(map);

var pointsMarkers = generateMarkers(points);
var pointsLayers = L.layerGroup(pointsMarkers).addTo(map);


function addHandlersToMarkers(markers) {
    markers.forEach((marker) => {
        marker.on('click', function (e) {
            marker.closeTooltip();
        });
        marker.on('mouseover', function () {
            if (marker.isPopupOpen()) {
                marker.closeTooltip();
            };
        });
        marker.on('popupclose', function () {
            marker.openTooltip();
        });
    });
}

function generateMarkers(dataRecords, tooltipPermanent = true) {
    var result = [];

    for (var i = 0; i < dataRecords.length; i++) {
        var record = dataRecords[i];

        var marker = L.marker(record.coordinates, {
            icon: L.divIcon({
                className: 'location-divicon-' + record.type,
                iconSize: [20, 20],
                popupAnchor: [0, -3],
                tooltipAnchor: [-2, 2],
                iconAnchor: [11, 10]
            })
        });

        var tooltipOptions = {
            offset: [0, 0],
            permanent: tooltipPermanent,
            direction: 'top',
            className: 'tooltip-' + record.type
        }
        marker.bindTooltip(record.name, tooltipOptions).openTooltip();
        // var popupContent = record.type === 'province' ? '<p>' + record.content + '</p>' + '<button class="map-button">Виж отблизо областта</button>' : 'Повече информация за Левски в област ' + record.name + ' ще бъде налична скоро!';

        var popupContent = record.type === 'province' ? '<p>' + record.content + '</p>' : 'Повече информация за Левски в област ' + record.name + ' ще бъде налична скоро!';
        var popup = L.popup({ maxHeight: 300, maxWidth: 200, className: 'popup-lf', coordinates: record.coordinates });
        popup.setContent(`<h1 class="popup-heading">${record.name}</h1>${popupContent}`);
        marker.bindPopup(popup);

        result.push(marker);
    }

    return result;
}


map.on('click', function (e) {
    console.log(`[${e.latlng.lat}, ${e.latlng.lng}]`);
    console.log(map.getZoom());
    // map.locate({setView: true, maxZoom: 16});
    closeNav();
    closeSearchInput();
})
map.on('zoomend zoomlevelschange', zoom);

map.on('zoomstart zoomlevelschange', function (e) {

});

var sofias = [];
L.geoJSON(balkans, {
    style: function (feature) {
        console.log(feature)
        return { weight: 1.5, color: 'gray' }
    }
}).addTo(map);

function displayBulgariaTooltip(flag = true) {
    const bulgariaElements = Array.from(document.getElementsByClassName('bulgaria'));
    bulgariaElements.forEach(t => t.style.opacity = flag ? 1 : 0);
}


function zoom(e) {
    if (e.type == 'zoomend') {
        if (map.getZoom() >= 7 && map.getZoom() <= 7.5) {
            displayBulgariaTooltip(false);
            provicnesLayers.addTo(map);
            addHandlersToMarkers(provincesMarkers);
        } else if (map.getZoom() < 7) {
            displayBulgariaTooltip();
            map.removeLayer(provicnesLayers);
        }
    }
}

function zoomHandler(e) {

    if (map.getZoom() >= 8 && e.type === 'zoomend') {
        map.removeLayer(bulgariaMap);
        map.removeLayer(USGS_USImagery);
        regionsRefs.forEach(mark => map.removeLayer(mark[0]));
        sofiaProvince.forEach((place) => {
            var mark = L.marker(place.coordinates, {
                icon: L.divIcon({
                    className: `location-divicon-cities`,
                    iconSize: [15, 15],
                    popupAnchor: [0, -3],
                    tooltipAnchor: [-2, 2],
                    iconAnchor: [11, 10]
                })
            });
            // sets the region's name as tooltip which stands over the marker

            const currContent = content[place.pathName] ? content[place.pathName] : 'Повече информация за Левски в област ' + place.name + ' ще бъде налична скоро!';
            var popup = L.popup({ maxHeight: 300, maxWidth: 200, className: 'popup-lf' });
            popup.setContent(`<h1 class="popup-heading">${place.name}</h1>${currContent}`);
            mark.bindPopup(popup);
            mark.addTo(map);
            sofias.push(mark);
        })
    } else if (map.getZoom() < 8 && e.type === 'zoomend') {
        bulgariaMap.addTo(map);
        USGS_USImagery.addTo(map);
        sofias.forEach((m) => {
            map.removeLayer(m);
        });
        sofias = [];
        regionsRefs.forEach((regions) => {
            var reg = regions[1];
            var marker = regions[0];

            marker.addTo(map);
            marker.on('popupopen', function (e) {

            })
            marker.on('click', function (e) {
                onClick();
                // marker.closePopup();
                reg.addTo(map);
                marker.closeTooltip();
            });
            marker.on('mouseover', function () {
                if (marker.isPopupOpen()) {
                    marker.closeTooltip();
                };
            });
        })
    }
}

