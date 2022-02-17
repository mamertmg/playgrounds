//top navbar turn white on scroll

const nav = document.querySelector("nav");
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
            nav.classList.add("bg-white");
        } else {
            console.log(entry.target);

            nav.classList.remove("bg-white");
        }
    });
},
    sectionOneOptions);

sectionOneObserver.observe(sectionOne);


//Autocomplete

let autocomplete;

const southwest = { lat: 5.6108, lng: 136.589326 };
const northeast = { lat: 61.179287, lng: 2.64325 };
const newBounds = new google.maps.LatLngBounds(southwest, northeast);



function initAutocomplete() {

    autocomplete = new google.maps.places.Autocomplete(document.querySelector("#autocomplete"),
        {
            componentRestrictions: { 'country': ['de'] },
            fields: ['geometry', 'name', 'place_id'],
            types: ['address'],
        });

    autocomplete.addListener('place_changed', onPlaceChanged);

}

function onPlaceChanged() {
    let place = autocomplete.getPlace();
    if (!place.geometry) {
        // user didnt choose a prediction, reset the input field
        document.getElementById('autocomplete').placeholder = 'Enter a place';
    }
    else {
        document.getElementById('details').innerHTML = place.name;
    }
}




