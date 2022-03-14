function openOverlayImg() {
    console.log(appMap.currPopup);
    document.getElementById("map-overlay-img").src = 'http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + appMap.currPopup.layer.feature.properties.pathName + '.png';
    document.getElementById("map-overlay").style.display = "block";
}

function closeOverlayImg() {
    document.getElementById("map-overlay").style.display = "none"; 
}