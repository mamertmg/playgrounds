//top navbar turn white on scroll, bottom nabar disappears at bottom

const navTop = document.querySelector("nav");
const sectionOne = document.querySelector(".top-container");

const sectionOneOptions = {
    threshold: 0.1
};

const sectionOneObserver = new IntersectionObserver(function (
    entries,
    sectionOneObserver
) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            navTop.classList.add("bg-white");
        } else {

            navTop.classList.remove("bg-white");
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




//Autocomplete

let autocomplete;

function initAutocomplete() {

    autocomplete = new google.maps.places.Autocomplete(document.querySelector("#autocomplete"),
        {
            componentRestrictions: { 'country': ['de'] },
            fields: ['geometry', 'name', 'place_id'],
            types: ['address'],
        });

    autocomplete.addListener('place_changed', onPlaceChanged);

}

// autocompleted address for backend
let addressQuery;
function onPlaceChanged() {
    let place = autocomplete.getPlace();
    if (!place.geometry) {
        document.getElementById('autocomplete').placeholder = 'Enter a place';
    }
    else {
        let addressQuery = place.name;
    }
}

// Swiper

const swiper = new Swiper('.mySwiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: "auto",
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});


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

document.onscroll = function () {
    if (window.innerHeight + window.scrollY > document.body.clientHeight) {
        document.getElementById('nav-bottom-mobile').style.display = 'none';
    } else {
        document.getElementById('nav-bottom-mobile').style.display = 'block';
    }
}


