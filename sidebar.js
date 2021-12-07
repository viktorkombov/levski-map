var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active"); 
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

function onSearchClick(e) {
    const searchWrapper = document.getElementById('search-map');
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    if (searchInput.style.visibility !== 'visible') {
        searchInput.style.visibility = 'visible';
        searchInput.style.width = '150px';
        searchIcon.style.borderTopLeftRadius = '0px';
        searchIcon.style.borderBottomLeftRadius = '0px';
        searchIcon.style.boxShadow = 'none'
        searchWrapper.style.boxShadow = '0 1px 5px rgba(0,0,0,0.65)'
        autocomplete(document.getElementById("search-input"), countries);
        setTimeout(() => {
            searchInput.focus();
        }, 200);
    } else {
        console.log(searchInput.value);
    }
}

function closeSearchInput() {
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const searchWrapper = document.getElementById('search-map');
    searchInput.style.width = '0';
    searchInput.style.visibility = 'hidden';
    searchInput.value = '';
    searchIcon.style.borderTopLeftRadius = '5px';
    searchIcon.style.borderBottomLeftRadius = '5px';
    searchWrapper.style.boxShadow = 'none'
    searchIcon.style.boxShadow = '0 1px 5px rgba(0,0,0,0.65)'

}

function openNav() {
    document.getElementById('mySidenav').style.width = '220px';
    document.getElementById('openbtn').style.display = 'none'
}

function closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    setTimeout(() => {
        document.getElementById('openbtn').style.display = 'block'
    }, 400);
    Array.from(document.getElementsByClassName('panel')).forEach((panel) => {
        if (panel.style.display == 'block') {
            panel.previousElementSibling.classList.toggle("active");
            panel.style.display = "none";
        }
    });

}