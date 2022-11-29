function onSearchClick(e) {
    if (map) {
        map.closePopup();
    }
    if (closeNav) {
        closeNav();
    }
    const searchWrapper = document.querySelector('.map-search');
    const searchInput = document.querySelector('.map-search__input');
    const searchIcon = document.querySelector('.map-search__icon');
    if (!searchInput.classList.contains('map-search__input--open')) {
        searchWrapper.classList.add('map-search--open')
        searchInput.classList.add('map-search__input--open');
        searchIcon.classList.add('map-search__icon--open');
        autocomplete(searchInput, townsGeoJson.features, geojsontowns);
        setTimeout(() => {
            searchInput.focus();
        }, 200);
    } else {
        // if the autocomplete is opened and click is performed
        const activeElement = document.querySelector('.map-search__autocomplete--active');
        if (activeElement) activeElement.click();
    }
}

function closeSearchInput() {
    const searchWrapper = document.querySelector('.map-search');
    const searchInput = document.querySelector('.map-search__input');
    const searchIcon = document.querySelector('.map-search__icon');

    searchWrapper.classList.remove('map-search--open')
    searchInput.classList.remove('map-search__input--open');
    searchIcon.classList.remove('map-search__icon--open');

    searchInput.value = '';
}


function autocomplete(searchInput, townsData, townsLayers) {
    var currentFocus;
    searchInput.addEventListener("input", function (e) {
        var dropdownList, dropDownItem, index, inputValue = this.value;
        closeAllLists();

        if (!inputValue) { return false; }

        currentFocus = -1;

        dropdownList = document.createElement("DIV");
        dropdownList.classList.add("map-search__autocomplete-items");
        // appends the dropdown list in the container where is the searchInput
        this.parentNode.appendChild(dropdownList);

        // TODO think to implement the sorting somewhere else and to get towns data in different way
        townsData = townsData.sort((a, b) => a.properties.name.localeCompare(b.properties.name));

        for (index = 0; index < townsData.length; index++) {
            var townName = townsData[index].properties.name;
            if (townName.substr(0, inputValue.length).toUpperCase() == inputValue.toUpperCase()) {
                dropDownItem = document.createElement("DIV");
                dropDownItem.innerHTML = '<img style="width: 12px; height: 12px; margin-right: 5px" src="https://vlevskimuseum-bg.org/wp-content/uploads/2021/12/location.png"/>'
                dropDownItem.innerHTML += "<strong>" + townName.substr(0, inputValue.length) + "</strong>";
                dropDownItem.innerHTML += townName.substr(inputValue.length);
                dropDownItem.innerHTML += "<input type='hidden' value='" + townName + "'>";
                dropDownItem.addEventListener("click", function (event) {
                    // TODO think to remove these or to change the logic with creating of events
                    if (map) {
                        map.closePopup();
                    }

                    if (closeSearchInput) {
                        closeSearchInput();
                    }

                    searchInput.value = this.getElementsByTagName("input")[0].value;
                    var selectedElement = event.target.tagName === 'DIV' ? event.target.children[2] : event.target.parentElement.children[2];

                    // TODO think to remove these or to change the logic with creating of events
                    var coordinates = townsData.find(rec => rec.properties.name === selectedElement.value).geometry.coordinates;
                    map.flyTo(coordinates.slice().reverse(), 15.1, {
                        animate: true,
                        duration: 1.5
                    });

                    displayLayer([geojsons, geojsonsText, balkansMap, balkansBoundaries], false);
                    displayLayer([streets, townsLayers]);

                    var currLayer = townsLayers.getLayers().filter(rec => JSON.stringify(rec.feature.geometry.coordinates) === JSON.stringify(coordinates));

                    setTimeout(() => {
                        console.log(currLayer);
                        townsLayers.openPopup(currLayer[0], coordinates.slice().reverse());
                        displayZoomButton(false);
                    }, 1700);

                    closeAllLists();
                    closeSearchInput();
                });
                dropdownList.appendChild(dropDownItem);
            }

            if (dropdownList.children[0] && currentFocus === -1) {
                currentFocus = 0;
                dropdownList.children[currentFocus].classList.add("map-search__autocomplete--active");
            }
        }

    });

    searchInput.addEventListener("keydown", function (e) {
        var dropDownList = document.querySelector(".map-search__autocomplete-items");
        if (dropDownList) {
            dropDownList = dropDownList.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(dropDownList);
                const currItem = dropDownList[currentFocus];
                const itemsContainer = currItem.parentElement;
                const diff = getElementBottomPosition(currItem) - getElementBottomPosition(itemsContainer);
                if (diff > 0) dropDownList[currentFocus].parentElement.scrollBy(0, diff);
                if (currentFocus === 0) dropDownList[currentFocus].parentElement.scrollTo(0, 0);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(dropDownList);
                const currItem = dropDownList[currentFocus];
                const itemsContainer = currItem.parentElement;
                const diff = getElementTopPosition(currItem) - getElementTopPosition(itemsContainer);
                if (diff < 0) dropDownList[currentFocus].parentElement.scrollBy(0, diff)
                if (currentFocus === dropDownList[currentFocus].parentElement.children.length - 1) dropDownList[currentFocus].parentElement.scrollBy(0, dropDownList[currentFocus].parentElement.scrollHeight);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (dropDownList) dropDownList[currentFocus].click();
                }
            }
        } else if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    function addActive(dropDownList) {
        if (!dropDownList) return false;
        removeActive(dropDownList);
        if (currentFocus >= dropDownList.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (dropDownList.length - 1);
        dropDownList[currentFocus].classList.add("map-search__autocomplete--active");
    }

    function removeActive(dropDownList) {
        for (var i = 0; i < dropDownList.length; i++) {
            dropDownList[i].classList.remove("map-search__autocomplete--active");
        }
    }

    function closeAllLists(elmnt) {
        var dropDownList = document.getElementsByClassName("map-search__autocomplete-items");
        for (var i = 0; i < dropDownList.length; i++) {
            if (elmnt != dropDownList[i] && elmnt != searchInput) {
                dropDownList[i].parentNode.removeChild(dropDownList[i]);
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