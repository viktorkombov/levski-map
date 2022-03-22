var acc = document.getElementsByClassName("map-sidenav-accordion");
var i;

for (i = 0; i < acc.length; i++) {
    if (acc[i].tagName === "A") continue;
    acc[i].addEventListener("click", function () {
        this.classList.toggle("map-sidenav-accordion--active");
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
    document.getElementById('mySidenav').style.width = '220px';
    document.getElementById('map-sidenav-openbtn').style.display = 'none'
}

function closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('mySidenav').style.left = '0';
    setTimeout(() => {
        document.getElementById('map-sidenav-openbtn').style.display = 'block'
        document.getElementById('mySidenav').style.left = '10px';
    }, 400);
    Array.from(document.getElementsByClassName('map-sidenav-accordion-panel')).forEach((panel) => {
        if (panel.style.display == 'block') {
            panel.previousElementSibling.classList.toggle("map-sidenav-accordion--active");
            panel.style.display = "none";
        }
    });

}