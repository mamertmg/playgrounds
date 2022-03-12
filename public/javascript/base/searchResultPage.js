
let autocomplete1;
let autocomplete2;

async function initAutocomplete() {

    autocomplete1 = new google.maps.places.Autocomplete(document.querySelector(".autocomplete1"),
        {
            componentRestrictions: { 'country': ['de'] },
            fields: ['geometry', 'name', 'place_id'],
            types: ['address'],
        });

    autocomplete2 = new google.maps.places.Autocomplete(document.querySelector(".autocomplete2"),
        {
            componentRestrictions: { 'country': ['de'] },
            fields: ['geometry', 'name', 'place_id'],
            types: ['address'],
        });

    autocomplete1.addListener('place_changed', onPlaceChanged);
    autocomplete2.addListener('place_changed', onPlaceChanged);

}

//top navbar turn white on scroll, bottom nabar disappears when reaching bottom

const mapButton = document.querySelector("#mapButton");
const sectionOne = document.querySelector(".top-container");

const sectionOneOptions = {
    threshold: 0.1
};

const sectionOneObserver = new IntersectionObserver(function (
    entries,
    sectionOneObserver
) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            mapButton.classList.add("visually-hidden");
        } else {
            mapButton.classList.remove("visually-hidden");
        }
    });
},
    sectionOneOptions);

sectionOneObserver.observe(sectionOne);


const navBottom = document.querySelector(".fixed-bottom");
const sectionTwo = document.querySelector(".bottom-container");

const sectionTwoOptions = {
    threshold: 0.1
};

const sectionTwoObserver = new IntersectionObserver(function (
    entries,
    sectionTwoObserver
) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navBottom.classList.add("visually-hidden");
        } else {

            navBottom.classList.remove("visually-hidden");
        }
    });
},
    sectionTwoOptions);

sectionTwoObserver.observe(sectionTwo);


// navbar bottom disappears when filters is clicked on
// map button disappears when filters is clicked



const filters = document.querySelector('.filters')
filters.addEventListener('shown.bs.offcanvas', e => {

    if (e) {
        navBottom.classList.add("visually-hidden");
        mapButton.classList.add("visually-hidden")
    } else {
        navBottom.classList.remove("visually-hidden");
        mapButton.classList.remove("visually-hidden");
    }
})

filters.addEventListener('hidden.bs.offcanvas', e => {

    if (e) {
        navBottom.classList.remove("visually-hidden");
        mapButton.classList.remove("visually-hidden");
    }
})

async function initMap() {

    const map = new google.maps.Map(document.getElementById("mapInResultPage"), {
        mapId: "546de97e85a128a6",
        center: { lat: 51.22, lng: 6.77 },
        zoom: 15,
    });


    const markers = [
        { objektbezeichung: "Seilspielplatz", latitude: 51.232928391458785, longitude: 6.7731710355280015, objektart: "Bolzplatz", strasse_hausnr: 5 },
        { objektbezeichung: "Spielplatz Spee‘scher Graben", latitude: 51.221624427602734, longitude: 6.77031014027715, objektart: "Kinderspielplatz", strasse_hausnr: 4 },
        { objektbezeichung: "Spielplatz Schwanenmarkt", latitude: 51.22014623354839, longitude: 6.773571536911311, objektart: "Bolzplatz", strasse_hausnr: 3 },
        { objektbezeichung: "Spielplatz im WGZ Bank-Park", latitude: 51.2187728973201, longitude: 6.798678328408502, objektart: "Bolzplatz", strasse_hausnr: 5 },
        { objektbezeichung: "Spielplatz Lessingplatz", latitude: 51.21409645756707, longitude: 6.793783676859652, objektart: "Kinderspielplatz", strasse_hausnr: 4 },
    ];



    for (let i = 0; i < 5; i++) {

        const currMarker = markers[i];
        const currMarkerImgSrc = `"https://picsum.photos/200?random=${i}"`;
        const marker = new google.maps.Marker(

            {
                position: { lat: currMarker.latitude, lng: currMarker.longitude },
                map,

                title: currMarker.objektbezeichung,
                icon: {
                    url: '/images/base/playground-pixel.png',
                    scaledSize: new google.maps.Size(40, 40),
                },

                animation: google.maps.Animation.DROP,
            });


        const contentString = ` 
        <div id='currMarkerImg'><a href='www.google.com'><img src=${currMarkerImgSrc}></a></div>
        <b> ${currMarker.objektbezeichung}</b>
        <p id='currMarkerDescr'>
        <div id='currMarkerRating'>Adresse: ${currMarker.strasse_hausnr}</div> 
        Type: ${currMarker.objektart}</p>`;

        const infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener("click", () => {
            infowindow.open(map, marker);
        })


    }


    initAutocomplete();

}








// pass autocompleted address as value
let addressQuery;
function onPlaceChanged() {
    let place = autocomplete.getPlace();
    if (!place.geometry) {
        document.getElementById('autocomplete').placeholder = 'Enter a place';
    }
    else {
        let addressQuery = place.name;
        console.log(addressQuery)
    }

}


//get Location from browser

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            axios
                .get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&limit=1`
                )
                .then((response) => {
                    const { city, road } = response.data.address;
                    searchInput.value = `${city} ${road}`;
                    getPlaygrounds(
                        pos.coords.latitude,
                        pos.coords.longitude,
                        labelSelect.value,
                        limitInput.value,
                        distInput.value
                    );
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}




// Swiper



//dropdown checkbox

document.querySelector(".checkbox-menu").addEventListener("change", "input[type='checkbox']", function () {
    document.querySelector(this).closest("li").classList.toggle("active", this.checked);
});

document.querySelector(document).addEventListener('click', '.allow-focus', function (e) {
    e.stopPropagation();
});



