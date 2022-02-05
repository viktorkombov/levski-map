function openOverlayImg() {
    // console.log(appMap.currPopup);
    // document.getElementById("map-overlay-img").src = 'http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + appMap.currPopup.layer.feature.properties.pathName + '.png';
    document.getElementById("map-overlay").style.display = "block";
}

function closeOverlayImg(event) {
    const element = event.target;
    const overlay = document.getElementById("map-overlay");
    if (element.id === 'map-overlay' || element.id === 'map-overlay-wrapper') {
        overlay.style.display = 'none';
    }
    console.log(event.target);
}