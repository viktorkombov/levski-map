function autocomplete(inp, townsData, townsLayers) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();

        if (!val) { return false; }

        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "map-search-autocomplete-list");
        a.setAttribute("class", "map-search-autocomplete-items");
        this.parentNode.appendChild(a);

        townsData = townsData.sort((a, b) => a.properties.name.localeCompare(b.properties.name));

        for (i = 0; i < townsData.length; i++) {
            var townName = townsData[i].properties.name;
            if (townName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = '<img style="width: 12px; height: 12px; margin-right: 5px" src="http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/location.png"/>'
                b.innerHTML += "<strong>" + townName.substr(0, val.length) + "</strong>";
                b.innerHTML += townName.substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + townName + "'>";


                b.addEventListener("click", function (event) {
                    map.closePopup();
                    closeSearchInput();
                    inp.value = this.getElementsByTagName("input")[0].value;
                    var selectedElement = event.target.tagName === 'DIV' ? event.target.children[2] : event.target.parentElement.children[2];
                    var coordinates = townsData.find(rec => rec.properties.name === selectedElement.value).geometry.coordinates;
                    map.flyTo(coordinates.slice().reverse(), 15.1, {
                        animate: true,
                        duration: 1.5
                    });

                    displayLayer([geojsons, geojsonsText, bulgar, USGS_USImagery, balkansBoundaries], false);
                    displayLayer([streets, townsLayers]);

                    var currLayer = townsLayers.getLayers().filter(rec => JSON.stringify(rec.feature.geometry.coordinates) === JSON.stringify(coordinates));

                    setTimeout(() => {
                        console.log(currLayer)
                        townsLayers.openPopup(currLayer[0], coordinates.slice().reverse());
                    }, 1700);

                    closeAllLists();
                    closeSearchInput();
                });
                a.appendChild(b);
            }

            if (a.children[0] && currentFocus === -1) {
                currentFocus = 0;
                a.children[currentFocus].classList.add("map-search-autocomplete-active")
            }
        }

    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "map-search-autocomplete-list");
        if (x) {
            x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
                const currItem = x[currentFocus];
                const itemsContainer = currItem.parentElement;
                const diff = getElementBottomPosition(currItem) - getElementBottomPosition(itemsContainer);
                if (diff > 0) x[currentFocus].parentElement.scrollBy(0, diff);
                if (currentFocus === 0) x[currentFocus].parentElement.scrollTo(0, 0);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
                const currItem = x[currentFocus];
                const itemsContainer = currItem.parentElement;
                const diff = getElementTopPosition(currItem) - getElementTopPosition(itemsContainer);
                if (diff < 0) x[currentFocus].parentElement.scrollBy(0, diff)
                if (currentFocus === x[currentFocus].parentElement.children.length - 1) x[currentFocus].parentElement.scrollBy(0, x[currentFocus].parentElement.scrollHeight);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        } else if (e.keyCode == 13) {
            e.preventDefault();
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("map-search-autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("map-search-autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("map-search-autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    function getElementBottomPosition(element) {
        return element.getBoundingClientRect().bottom;
    }

    function getElementTopPosition(element) {
        return element.getBoundingClientRect().top;
    }
}