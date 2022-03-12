//top navbar turn white on scroll, bottom navbar disappears when reaching bottom

const navTop = document.querySelector(".fixed-top");
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

let autocomplete1;
let autocomplete2

function initAutocomplete() {

    autocomplete1 = new google.maps.places.Autocomplete(document.querySelector("#autocomplete1"),
        {
            componentRestrictions: { 'country': ['de'] },
            fields: ['geometry', 'name', 'place_id'],
            types: ['address'],
        });

    autocomplete1.addListener('place_changed', onPlaceChanged);


    autocomplete2 = new google.maps.places.Autocomplete(document.querySelector("#autocomplete2"),
        {
            componentRestrictions: { 'country': ['de'] },
            fields: ['geometry', 'name', 'place_id'],
            types: ['address'],
        });

    autocomplete2.addListener('place_changed', onPlaceChanged);

}

// pass autocompleted address as value
let addressQuery1;
let addressQuery2;
function onPlaceChanged() {
    let place1 = autocomplete1.getPlace();
    if (!place.geometry) {
        document.getElementById('autocomplete1').placeholder = 'Enter a place';
    }
    else {
        let addressQuery1 = place.name;
        console.log(addressQuery1)
    }

    let place2 = autocomplete2.getPlace();
    if (!place2.geometry) {
        document.getElementById('autocomplete2').placeholder = 'Enter a place';
    }
    else {
        let addressQuery2 = place2.name;
        console.log(addressQuery2)
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

const swiper = new Swiper('.mySwiper', {

    direction: 'horizontal',
    slidesPerView: "auto",
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});




