// Map and InfoWindow initialised in initMap()
let map = null;
let infowindow = null;

// list for keeping track of all markers on map
let markerList = [];

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
// both input field should ALWAYS have the same value
locationInputMobile.addEventListener('input', () => {
    locationInput.value = locationInputMobile.value;
    locationDisplayMobile.value = locationInputMobile.value;
});
locationInput.addEventListener('input', () => {
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
                locationInputMobile.value = addressQuery;
            }
        });
    }
}

/*
 * Checks if value is valid for latitude or longitude respectively..
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

const resultsDisplay = document.querySelector('#resultsInLaptopView');

function createResultCard(playground) {
    const card = document.createElement('div');
    card.className = 'card mt-2';

    const img = document.createElement('img');
    img.src = 'https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp';
    img.alt = 'Fissure in Sandstone';
    img.classList.add('card-img-top');
    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);

    const name = document.createElement('h5');
    name.className = 'card-title';
    name.textContent = playground.name;
    cardBody.appendChild(name);

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
    detailButton.className = 'btn btn-primary';
    detailButton.href = `/playgrounds/${playground._id}`;
    detailButton.textContent = 'More Information';
    cardBody.appendChild(detailButton);

    resultsDisplay.appendChild(card);
}

// creates markers on map for given data
//
// markers: array of objects with playground data
// currCoordinates: array [lat, lng]; current center of map
function placeMarkers(playgrounds, currCoordinates) {
    if (map) {
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
            <div id='currMarkerImg'><a href='www.google.com'><img src=${currMarkerImgSrc}></a></div>
            <b> ${playground.name}</b>
            <p id='currMarkerDescr'>
            <div id='currMarkerRating'>Adresse: ${playground.address}</div> 
            Type: ${playground.type}</p>
            <div><a href='http://localhost:3000/playgrounds/${playground._id}'>Details</a></div>`;

            marker.addListener('click', () => {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });

            markerList.push(marker);

            createResultCard(playground);
        }
    }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    for (let i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }
    markerList = [];
}

async function initMap() {
    initAutocomplete();

    // get query string params
    const searchParams = new URLSearchParams(window.location.search);

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
        }
    } else if (
        locationInputMobile.value === 'Düsseldorf' ||
        !searchParams.has('q') ||
        !searchParams.get('q')
    ) {
        // default case, i.e. no location input by user: center on Düsseldorf
        currentCoordinates.lat = 51.22;
        currentCoordinates.lng = 6.77;
    } else {
        // no coordinates, but a location was input
        locationInputMobile.value = searchParams.get('q');
        locationInput.value = searchParams.get('q');
        locationDisplayMobile.value = searchParams.get('q');
        const { lat, lng } = await getCoordsFromLocation(searchParams.get('q'));
        currentCoordinates.lat = lat;
        currentCoordinates.lng = lng;
    }

    map = new google.maps.Map(document.getElementById('mapInResultPage'), {
        mapId: '546de97e85a128a6',
        center: currentCoordinates,
        zoom: 15,
    });

    const dist = searchParams.get('dist');

    // fetch relevant playgrounds
    let query = `${baseQuery}lat=${currentCoordinates.lat}&lng=${
        currentCoordinates.lng
    }&dist=${Number(dist) && Number(dist) < 6 ? Number(dist) : '1'}`;

    const response = await axios.get(query);
    const playgrounds = response.data;
    placeMarkers(playgrounds, currentCoordinates);
}

// distance selector should mirror each other

const distMobile = document.querySelector('#distMobile');
const distDesktop = document.querySelector('#selectSearchRadius');
distDesktop.addEventListener('input', () => {
    distMobile.value = distDesktop.value;
    distMobile.nextElementSibling.value = distDesktop.value;
});
distMobile.addEventListener('input', () => {
    distDesktop.value = distMobile.value;
});

// Search form behaviour on submit

function defineAndSendQuery(dist) {
    // build query string
    let query = '/search?';
    if (place && place.formatted_address === locationInput.value) {
        query += `q=${
            place.formatted_address
        }&lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}&`;
    } else {
        query += `q=${locationInput.value}&`;
    }
    query += `dist=${dist}`;

    window.location = query; // redirect browser to search page
}

const searchFormPlaceMobile = document.querySelector(
    '#searchform-landingpage-mobileview'
);
const searchFormPlaceLg = document.querySelector('#searchFormPlaceLg');
searchFormPlaceMobile.addEventListener('submit', (event) => {
    event.preventDefault();
    defineAndSendQuery(distMobile.value);
});
searchFormPlaceLg.addEventListener('submit', (event) => {
    event.preventDefault();
    defineAndSendQuery(distDesktop.value);
});

//get Location from browser

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function (pos) {
//             axios
//                 .get(
//                     `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&limit=1`
//                 )
//                 .then((response) => {
//                     const { city, road } = response.data.address;
//                     searchInput.value = `${city} ${road}`;
//                     getPlaygrounds(
//                         pos.coords.latitude,
//                         pos.coords.longitude,
//                         labelSelect.value,
//                         limitInput.value,
//                         distInput.value
//                     );
//                 })
//                 .catch((e) => {
//                     console.log(e);
//                 });
//         });
//     } else {
//         console.log('Geolocation is not supported by this browser.');
//     }
// }

// Swiper

//dropdown checkbox

// document.querySelector(".checkbox-menu").addEventListener("change", "input[type='checkbox']", function () {
//     document.querySelector(this).closest("li").classList.toggle("active", this.checked);
// });

// document.querySelector(document).addEventListener('click', '.allow-focus', function (e) {
//     e.stopPropagation();
// });
