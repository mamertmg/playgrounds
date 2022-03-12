const baseURL = 'http://localhost:3000/';

//top navbar turn white on scroll, bottom navbar disappears when reaching bottom

const navTop = document.querySelector('.fixed-top');
const sectionOne = document.querySelector('.top-container');

const sectionOneOptions = {
    threshold: 0.1,
};

const sectionOneObserver = new IntersectionObserver(function (
    entries,
    sectionOneObserver
) {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            navTop.classList.add('bg-white');
        } else {
            navTop.classList.remove('bg-white');
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

//Autocomplete

const autocomplete1 = document.querySelector('#autocomplete1');
const autocomplete2 = document.querySelector('#autocomplete2');
// both input field should ALWAYS have the same value
autocomplete1.addEventListener('input', () => {
    autocomplete2.value = autocomplete1.value;
});
autocomplete2.addEventListener('input', () => {
    autocomplete1.value = autocomplete2.value;
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
                autocomplete1.value = addressQuery;
            }
        });
    }
}

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

const searchForm = document.querySelector('#searchForm');
const searchRadius = document.querySelector('#selectSearchRadius');
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // build query string before submitting form
    let query = searchForm.getAttribute('action');
    if (place && place.formatted_address === autocomplete1.value) {
        query += `?q=${
            place.formatted_address
        }&lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}`;
    } else {
        query += `?q=${autocomplete1.value} Düsseldorf`;
    }
    query += `&dist=${searchRadius.value}`;
    if (query.split('?').length > 1) {
        window.location = query;    // redirect browser to search page
    }
});

// Swiper

const swiper = new Swiper('.mySwiper', {
    direction: 'horizontal',
    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});
