// Map and InfoWindow initialised in initMap()
let map = null;
let infowindow = null;

// list for keeping track of all markers on map
let markerList = [];

const duessCoord = { lat: 51.22, lng: 6.77 };

const baseQuery = 'http://localhost:3000/api/playgrounds?';

//top navbar turn white on scroll, bottom nabar disappears when reaching bottom

const mapButton = document.querySelector('#mapButton');
const sectionOne = document.querySelector('.top-container');

const sectionOneOptions = {
    threshold: 0.1,
};

const sectionOneObserver = new IntersectionObserver(function (
    entries,
    sectionOneObserver
) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            mapButton.classList.add('visually-hidden');
        } else {
            mapButton.classList.remove('visually-hidden');
        }
    });
},
sectionOneOptions);

sectionOneObserver.observe(sectionOne);

const navBottom = document.querySelector('.fixed-bottom');
const sectionTwo = document.querySelector('.bottom-container');

const sectionTwoOptions = {
    threshold: 0.1,
};

const sectionTwoObserver = new IntersectionObserver(function (
    entries,
    sectionTwoObserver
) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navBottom.classList.add('visually-hidden');
        } else {
            navBottom.classList.remove('visually-hidden');
        }
    });
},
sectionTwoOptions);

sectionTwoObserver.observe(sectionTwo);

// navbar bottom disappears when filters is clicked on
// map button disappears when filters is clicked

const filters = document.querySelector('.filters');
filters.addEventListener('shown.bs.offcanvas', (e) => {
    if (e) {
        navBottom.classList.add('visually-hidden');
        mapButton.classList.add('visually-hidden');
    } else {
        navBottom.classList.remove('visually-hidden');
        mapButton.classList.remove('visually-hidden');
    }
});

filters.addEventListener('hidden.bs.offcanvas', (e) => {
    if (e) {
        navBottom.classList.remove('visually-hidden');
        mapButton.classList.remove('visually-hidden');
    }
});

// Location input fields behaviour

const locationInputMobile = document.querySelector('#autocompleteInResultPage');
const locationDisplayMobile = document.querySelector('#locationDisplayMobile');
const locationInput = document.querySelector('#autocompleteLg');

// both input fields should ALWAYS have the same value
locationInputMobile.addEventListener('input', () => {
    sessionStorage['q'] = locationInputMobile.value;
    locationInput.value = locationInputMobile.value;
    locationDisplayMobile.value = locationInputMobile.value;
});
locationInput.addEventListener('input', () => {
    sessionStorage['q'] = locationInput.value;
    locationInputMobile.value = locationInput.value;
    locationDisplayMobile.value = locationInput.value;
});

let addressQuery;
let place;
function initAutocomplete() {
    const autoInputs = document.querySelectorAll('.autocomplete');
    for (let autoIn of autoInputs) {
        let autocomplete = new google.maps.places.Autocomplete(autoIn, {
            componentRestrictions: { country: ['de'] },
            fields: ['geometry', 'formatted_address', 'place_id'],
            types: ['address'],
        });

        autocomplete.addListener('place_changed', () => {
            place = autocomplete.getPlace();
            if (!place.geometry) {
                autocomplete.target.placeholder = 'Enter a place';
            } else {
                addressQuery = place.formatted_address;
                locationInput.value = addressQuery;
                locationInputMobile.value = addressQuery;
                locationDisplayMobile.value = addressQuery;
                sessionStorage['q'] = locationInputMobile.value;
            }
        });
    }
}

/*
 * Checks if value is valid for latitude or longitude respectively.
 * Returns false if type is neither 'lat' or 'lng'.
 */
function isValidLatLng(value, type) {
    if (type === 'lat') {
        const lat = Number(value);
        return lat && lat >= -90.0 && lat <= 90.0;
    } else if (type === 'lng') {
        const lng = Number(value);
        return lng && lng >= -180.0 && lng <= 180.0;
    }
    return false;
}

async function getLocationFromCoords({ lat, lng }) {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&limit=1`
        );
        const { city, road } = response.data.address;
        return `${road}, ${city}`;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getCoordsFromLocation(location) {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`
        );
        return {
            lat: Number(response.data[0].lat),
            lng: Number(response.data[0].lon),
        };
    } catch (error) {
        console.log(error);
        throw err;
    }
}

// Displaying result

const resultsDisplay = document.querySelector('#resultsInLaptopView');

function findAndClickMarker({ lat, lng }) {
    for (let marker of markerList) {
        const coords = marker.getPosition();
        if (coords.lat() === lat && coords.lng() === lng) {
            mapButton.click();
            google.maps.event.trigger(marker, 'click');
        }
    }
}

function createResultCard(playground) {
    const card = document.createElement('div');
    card.className = 'card mt-2';

    const img = document.createElement('img');
    if (!playground.images.length) {
        img.src = '/images/playground.png';
    } else {
        img.src = playground.images[0].url;
    }
    img.classList.add('card-img-top');
    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);

    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title d-flex justify-content-between';
    cardBody.appendChild(cardTitle);

    const name = document.createElement('h5');
    name.className = '';
    name.textContent = playground.name;
    cardTitle.appendChild(name);

    // clicking here will center map on the playground and open InfoWindow
    const showMapBtn = document.createElement('i');
    showMapBtn.className = 'fa-solid fa-map-location-dot fa-2x icon-blue';
    showMapBtn.addEventListener('click', () => {
        const coordinates = {
            lat: playground.location.coordinates[1],
            lng: playground.location.coordinates[0],
        };
        findAndClickMarker(coordinates);
    });
    cardTitle.appendChild(showMapBtn);

    const type = document.createElement('h6');
    type.className = 'card-subtitle mb-2 text-muted';
    type.textContent = playground.type;
    cardBody.appendChild(type);

    const address = document.createElement('p');
    address.className = 'card-text';
    address.innerHTML = `${playground.address} <br> ${playground.suburb}, ${playground.city}`;
    cardBody.appendChild(address);

    const features = document.createElement('p');
    features.className = 'card-text';
    features.textContent = playground.labels.join(', ');
    cardBody.appendChild(features);

    const detailButton = document.createElement('a');
    detailButton.className = 'btn detailButton';
    detailButton.href = `/playgrounds/${playground._id}`;
    detailButton.textContent = 'More Information';
    cardBody.appendChild(detailButton);

    resultsDisplay.appendChild(card);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    for (let i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }
    markerList = [];
}

// creates markers on map for given data
//
// markers: array of objects with playground data
// currCoordinates: array [lat, lng]; current center of map
function placeMarkers(playgrounds, currCoordinates) {
    if (map) {
        // clear previous markers / cards, if they exist
        if (markerList) {
            while (resultsDisplay.firstChild) {
                resultsDisplay.removeChild(resultsDisplay.firstChild);
            }
            deleteMarkers();
        }

        // Mark the position of input location
        const marker = new google.maps.Marker({
            position: currCoordinates,
            map,
        });
        markerList.push(marker);

        // place markers for all fetched playgrounds
        for (let i = 0; i < playgrounds.length; i++) {
            const playground = playgrounds[i];
            const currMarkerImgSrc = `"https://picsum.photos/200?random=${i}"`;
            const marker = new google.maps.Marker({
                position: {
                    lat: playground.location.coordinates[1],
                    lng: playground.location.coordinates[0],
                },
                map,
                title: playground.name,
                icon: {
                    url: '/images/base/playground-pixel.png',
                    scaledSize: new google.maps.Size(40, 40),
                },
                animation: google.maps.Animation.DROP,
            });

            const contentString = `
            <b> ${playground.name}</b>
            <p id='currMarkerDescr'>
            <div id='currMarkerRating'>Adresse: ${playground.address}</div> 
            Type: ${playground.type}</p>
            <div><a href='http://localhost:3000/playgrounds/${playground._id}'>Details</a></div>`;

            marker.addListener('click', () => {
                // pan to coordinates and open InfoWindow
                const coordinates = marker.getPosition();
                map.panTo(coordinates);
                map.setZoom(15);

                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });

            markerList.push(marker);

            createResultCard(playground);
        }
    }
}

// Fetch filter result

async function fetchFilterResult() {
    // build query string from stored input
    let query = `${baseQuery}lat=${sessionStorage.getItem(
        'lat'
    )}&lng=${sessionStorage.getItem('lng')}&dist=${sessionStorage.getItem(
        'dist'
    )}`;

    if (Object.keys(sessionStorage).includes('type')) {
        query += `&type=${sessionStorage.getItem('type')}`;
    }

    if (
        Object.keys(sessionStorage).includes('minAge') &&
        Object.keys(sessionStorage).includes('maxAge')
    ) {
        query += `&age=${sessionStorage.getItem(
            'minAge'
        )}-${sessionStorage.getItem('maxAge')}`;
    }

    if (
        Object.keys(sessionStorage).includes('equipment') &&
        Object.keys(sessionStorage).includes('features')
    ) {
        query += `&labels=${sessionStorage.getItem(
            'equipment'
        )},${sessionStorage.getItem('features')}`;
    } else if (Object.keys(sessionStorage).includes('equipment')) {
        query += `&labels=${sessionStorage.getItem('equipment')}`;
    } else if (Object.keys(sessionStorage).includes('features')) {
        query += `&labels=${sessionStorage.getItem('features')}`;
    }

    // fetch & display relevant data
    axios
        .get(query)
        .then((response) => {
            const playgrounds = response.data;
            placeMarkers(playgrounds, {
                lat: Number(sessionStorage.getItem('lat')),
                lng: Number(sessionStorage.getItem('lng')),
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

// TYPE FORM

const typeForm = document.querySelector('#typeForm');
const typeFormCloseBtn = document.querySelector('#closeTypeFilter');

typeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = [];
    for (let element of typeForm) {
        if (element.name === 'type' && element.checked) {
            selected.push(element.value);
        }
    }

    if (selected.length > 0) {
        sessionStorage.setItem('type', selected.toString());
    } else {
        sessionStorage.removeItem('type');
    }
    fetchFilterResult();
    typeFormCloseBtn.click();
});

// AGE FORM

const minAge = document.querySelector('#minAge');
const maxAge = document.querySelector('#maxAge');
minAge.addEventListener('input', () => {
    const minAgeVal = minAge.value;
    // remove all but the any option
    maxAge.length = 1;
    // set options for maxAge such that smallest value is equal to selected minAge value
    for (let i = minAgeVal; i <= 16; i++) {
        const option = document.createElement('option');
        option.text = i;
        option.value = i;
        maxAge.add(option);
    }
});

const ageForm = document.querySelector('#ageForm');
const ageFormCloseBtn = document.querySelector('#closeAgeFilter');
ageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sessionStorage.setItem('minAge', minAge.value);
    sessionStorage.setItem('maxAge', maxAge.value);
    fetchFilterResult();
    ageFormCloseBtn.click();
});

// EQUIPMENT FORM

const equipForm = document.querySelector('#equipForm');
const equipFormCloseBtn = document.querySelector('#closeEquipFilter');
equipForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = [];
    for (let element of equipForm) {
        if (element.name === 'equipment' && element.checked) {
            selected.push(element.value);
        }
    }

    if (selected.length > 0) {
        sessionStorage.setItem('equipment', selected.toString());
    } else {
        sessionStorage.removeItem('equipment');
    }
    fetchFilterResult();
    equipFormCloseBtn.click();
});

// FEATURES FORM

const featureForm = document.querySelector('#featureForm');
const featureFormCloseBtn = document.querySelector('#closeFeatureFilter');
featureForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = [];
    for (let element of featureForm) {
        if (element.name === 'features' && element.checked) {
            selected.push(element.value);
        }
    }

    if (selected.length > 0) {
        sessionStorage.setItem('features', selected.toString());
    } else {
        sessionStorage.removeItem('features');
    }
    fetchFilterResult();
    featureFormCloseBtn.click();
});

// distance selector should mirror each other

const distMobile = document.querySelector('#distMobile');
const distDesktop = document.querySelector('#selectSearchRadius');
distDesktop.addEventListener('input', () => {
    distMobile.value = distDesktop.value;
    distMobile.nextElementSibling.value = distDesktop.value;
    sessionStorage.setItem('dist', distDesktop.value);
});
distMobile.addEventListener('input', () => {
    distDesktop.value = distMobile.value;
    distMobile.nextElementSibling.value = distMobile.value;
    sessionStorage.setItem('dist', distMobile.value);
});

// on page reload, during the same session, set values for any previously set filters
function restoreFilterSelection() {
    // distance selector
    if (Object.keys(sessionStorage).includes('dist')) {
        const selected = sessionStorage.getItem('dist');
        distDesktop.value = selected;
        distMobile.value = selected;
        distMobile.nextElementSibling.value = selected;
    }

    // type filter
    if (Object.keys(sessionStorage).includes('type')) {
        const selected = sessionStorage.getItem('type').split(',');
        for (let element of typeForm) {
            if (element.name === 'type' && selected.includes(element.value)) {
                element.checked = true;
            }
        }
    }

    // age filter
    if (
        Object.keys(sessionStorage).includes('minAge') &&
        Object.keys(sessionStorage).includes('maxAge')
    ) {
        minAge.value = Number(sessionStorage.getItem('minAge'));
        maxAge.value = Number(sessionStorage.getItem('maxAge'));
    }

    // equipment filter
    if (Object.keys(sessionStorage).includes('equipment')) {
        const selected = sessionStorage.getItem('equipment').split(',');
        for (let element of equipForm) {
            if (
                element.name === 'equipment' &&
                selected.includes(element.value)
            ) {
                element.checked = true;
            }
        }
    }

    // features filter
    if (Object.keys(sessionStorage).includes('features')) {
        const selected = sessionStorage.getItem('features').split(',');
        for (let element of featureForm) {
            if (
                element.name === 'features' &&
                selected.includes(element.value)
            ) {
                element.checked = true;
            }
        }
    }
}

// Main function defining many settings besides map, since it is called every time the
// page is loaded/refreshed.
async function initMap() {
    initAutocomplete();

    infowindow = new google.maps.InfoWindow();

    // get query string params
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has('q')) {
        sessionStorage.setItem('q', searchParams.get('q'));
    }

    const currentCoordinates = {};

    // only use coordinates from query string if both lat and lng present and the values are valid
    if (
        searchParams.has('lat') &&
        isValidLatLng(searchParams.get('lat'), 'lat') &&
        searchParams.has('lng') &&
        isValidLatLng(searchParams.get('lng'), 'lng')
    ) {
        currentCoordinates.lat = Number(searchParams.get('lat'));
        currentCoordinates.lng = Number(searchParams.get('lng'));
        if (!searchParams.has('q') || !searchParams.get('q')) {
            const address = await getLocationFromCoords(currentCoordinates);
            locationInputMobile.value = address;
            locationInput.value = address;
            locationDisplayMobile.value = address;
            sessionStorage.setItem('q', address);
        } else {
            locationInputMobile.value = searchParams.get('q');
            locationInput.value = searchParams.get('q');
            locationDisplayMobile.value = searchParams.get('q');
        }
    } else if (
        // locationInputMobile.value === 'Düsseldorf' ||
        !searchParams.has('q') ||
        !searchParams.get('q')
    ) {
        // default case, i.e. no location input by user: center on Düsseldorf
        currentCoordinates.lat = duessCoord.lat;
        currentCoordinates.lng = duessCoord.lng;

        sessionStorage.setItem('q', 'Düsseldorf');
        locationInputMobile.value = 'Düsseldorf';
        locationInput.value = 'Düsseldorf';
        locationDisplayMobile.value = 'Düsseldorf';
    } else {
        // no coordinates, but a location was input
        locationInputMobile.value = searchParams.get('q');
        locationInput.value = searchParams.get('q');
        locationDisplayMobile.value = searchParams.get('q');
        const { lat, lng } = await getCoordsFromLocation(searchParams.get('q'));
        currentCoordinates.lat = lat;
        currentCoordinates.lng = lng;
    }

    sessionStorage.setItem('lat', currentCoordinates.lat);
    sessionStorage.setItem('lng', currentCoordinates.lng);

    // initialise map
    map = new google.maps.Map(document.getElementById('mapInResultPage'), {
        mapId: '546de97e85a128a6',
        center: currentCoordinates,
        zoom: 15,
    });

    google.maps.event.addListener(map, 'click', function (event) {
        infowindow.close();
    });

    // save search radius from query, set it to 5 if invalid value
    const dist = searchParams.get('dist');
    sessionStorage.setItem(
        'dist',
        Number(dist) && Number(dist) < 6 ? Number(dist) : '5'
    );

    // re-set values of any filters set during current session
    restoreFilterSelection();

    // fetch relevant playgrounds
    fetchFilterResult();
}

// Search form behaviour on submit

function defineAndSendLocQuery() {
    // build query string
    let query = '/search?';
    if (place && place.formatted_address === sessionStorage.getItem('q')) {
        query += `q=${
            place.formatted_address
        }&lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}&`;
    } else {
        query += `q=${sessionStorage.getItem('q')}&`;
    }
    query += `dist=${sessionStorage.getItem('dist')}`;

    // clear session storage before navigating away
    clearSearchData();

    window.location = query; // redirect browser to search page
}

// LOCATION forms

const searchFormPlaceMobile = document.querySelector(
    '#searchform-landingpage-mobileview'
);
const searchFormPlaceLg = document.querySelector('#searchFormPlaceLg');
searchFormPlaceMobile.addEventListener('submit', (event) => {
    event.preventDefault();
    defineAndSendLocQuery();
});
searchFormPlaceLg.addEventListener('submit', (event) => {
    event.preventDefault();
    defineAndSendLocQuery();
});

// get Location from browser

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            axios
                .get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&limit=1`
                )
                .then((response) => {
                    const { city, road } = response.data.address;
                    sessionStorage.setItem('q', `${road}, ${city}`);
                    sessionStorage.setItem('lat', pos.coords.latitude);
                    sessionStorage.setItem('lng', pos.coords.longitude);
                    locationInput.value = `${road}, ${city}`;
                    locationInputMobile.value = `${road}, ${city}`;
                    locationDisplayMobile.value = `${road}, ${city}`;
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

// Swiper

//dropdown checkbox

// document.querySelector(".checkbox-menu").addEventListener("change", "input[type='checkbox']", function () {
//     document.querySelector(this).closest("li").classList.toggle("active", this.checked);
// });

// document.querySelector(document).addEventListener('click', '.allow-focus', function (e) {
//     e.stopPropagation();
// });
