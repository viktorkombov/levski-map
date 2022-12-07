var acc = document.getElementsByClassName("map-sidenav__accordion");
var i;

for (i = 0; i < acc.length; i++) {
    if (acc[i].tagName === "A") continue;
    acc[i].addEventListener("click", function () {
        this.classList.toggle("map-sidenav__accordion--active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }); 
}

function openNav() {
    map.closePopup();
    closeSearchInput();
    document.querySelector('.map-sidenav').style.width = '220px';
    document.querySelector('.map-sidenav__openbtn').style.display = 'none';
    document.querySelector('.map-toggle-full-screen-btn').style.display = 'none';
}

function closeNav() {
    var sideNav = document.querySelector('.map-sidenav');
    sideNav.style.width = '0';
    sideNav.style.left = '0';
    setTimeout(() => {
        document.querySelector('.map-sidenav__openbtn').style.display = 'block';
        document.querySelector('.map-toggle-full-screen-btn').style.display = 'block';
        sideNav.style.left = '10px';
    }, 400);
    Array.from(document.getElementsByClassName('map-sidenav__accordion-panel')).forEach((panel) => {
        if (panel.style.display == 'block') {
            panel.previousElementSibling.classList.toggle("map-sidenav__accordion--active");
            panel.style.display = "none";
        }
    });

}