// map initialised in initMap()
let map = null;

// list for keeping track of all markers on map
let markerList = [];

const baseDBQuery = 'http://localhost:3000/api/playgrounds?';

// DOM objects
const searchInput = document.querySelector('#searchbox');
const searchButton = document.querySelector('#searchbutton');
const labelSelect = document.querySelector('#labelselect');
const limitInput = document.querySelector('#num-pg');
const distInput = document.querySelector('#dist');

limitInput.setAttribute('min', 1);
distInput.setAttribute('min', 0);

// initiate search when 'Search' button is clicked
searchButton.addEventListener('click', () => {
    console.log(searchInput.value);
    if(searchInput.value) {
        // use geocoding API to get location in latitude and longitude
        axios.get(`https://nominatim.openstreetmap.org/search?q=${searchInput.value}&format=json&limit=1`)
        .then((res) => {
            // console.log(res.data[0]);
            if(res.data[0].display_name) {
                searchInput.value = res.data[0].display_name;
            }
            const lat = Number(res.data[0].lat);
            const lng = Number(res.data[0].lon);
            getPlaygrounds(lat, lng, labelSelect.value, limitInput.value, distInput.value);
        })
        .catch((e) => {
            console.log(e);
            alert("something wrong");
        });
    }
});

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
function placeMarkers(markers, currCoordinates) {
    if(map) {
        const marker = new google.maps.Marker({
            position: currCoordinates,
            map
        });

        markerList.push(marker);

        for (let i = 0; i < markers.length; i++) {

            const currMarker = markers[i];
            const currMarkerImgSrc = `"https://picsum.photos/200?random=${i}"`;
            const marker = new google.maps.Marker({
                position: { lat: currMarker.location.coordinates[1], lng: currMarker.location.coordinates[0] },
                map,
                title: currMarker.name,
                icon: {
                    url: "/images/playground-pixel.png",
                    scaledSize: new google.maps.Size(40, 40)
                },
                animation: google.maps.Animation.DROP,
            });
    
            const contentString = ` 
            <div id='currMarkerImg'><a href='www.google.com'><img src=${currMarkerImgSrc}></a></div>
            <b> ${currMarker.name}</b>
            <p id='currMarkerDescr'>
            <div id='currMarkerRating'>Adresse: ${currMarker.address}</div> 
            Type: ${currMarker.type}</p>
            <div><a href='http://localhost:3000/playgrounds/${currMarker._id}'>Details</a></div>`;
    
            const infowindow = new google.maps.InfoWindow({
                content: contentString
            });
    
            marker.addListener("click", () => {
                infowindow.open(map, marker);
            })
    
            markerList.push(marker);
        }
    }
}

async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        mapId: "546de97e85a128a6",
        center: { lat: 51.22, lng: 6.77 },
        zoom: 15,
    });

    // fetch all playgrounds
    const response = await axios.get('http://localhost:3000/api/playgrounds');
    // the data is an array of objects
    const markers = response.data;
    placeMarkers(markers, { lat: 51.22, lng: 6.77 });
}

// Given input, performs database query to fetch relevant data.
function getPlaygrounds(lat, lng, label='', limit='', dist='') {
    deleteMarkers();
    map.setCenter({ lat, lng });

    // build DB query string
    let query = baseDBQuery;
    if(lat & lng) {
        query += `lat=${lat}&lng=${lng}`;
        if(label) {
            query += `&label=${label}`;
        }
        if(dist) {
            query += `&dist=${dist}`;
        }
        if(limit) {
            query += `&limit=${limit}`;
        }

        axios.get(query)
            .then(response => {
                // markers is an array of objects
                const markers = response.data;
                placeMarkers(markers, { lat, lng });
            })
            .catch((e) => {
                console.log(e);
                alert('API error');
            });
    }
}

function getLocation() {
    if (navigator.geolocation) {
        console.log("Inside");
        navigator.geolocation.getCurrentPosition(function (pos) {
            // searchInput.value = `lat: ${pos.coords.latitude}, lng: ${pos.coords.longitude}`;
            // getPlaygrounds(pos.coords.latitude, pos.coords.longitude);
            getPlaygrounds(51.22, 6.77, labelSelect.value, limitInput.value, distInput.value);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}